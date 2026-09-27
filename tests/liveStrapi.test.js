import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { login, register, getCurrentUser } from '../src/services/authApi.js';
import { fetchProducts, fetchProduct, uploadImage, createProduct } from '../src/services/strapiApi.js';

const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });

describe('live Strapi boundaries', () => {
  beforeEach(() => { global.fetch = vi.fn(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('registers and signs in using Strapi user auth, without an admin token', async () => {
    fetch.mockResolvedValue(response({ jwt: 'user-jwt', user: { id: 4, username: 'shopper' } }));
    expect((await register({ username: 'shopper', email: 's@example.com', password: 'password123' })).jwt).toBe('user-jwt');
    expect(fetch.mock.calls[0][0]).toContain('/api/auth/local/register');
    expect(JSON.parse(fetch.mock.calls[0][1].body).email).toBe('s@example.com');
    expect((await login({ identifier: 's@example.com', password: 'password123' })).user.id).toBe(4);
    expect(fetch.mock.calls[1][0]).toContain('/api/auth/local');
    expect(JSON.parse(fetch.mock.calls[1][1].body).identifier).toBe('s@example.com');
  });

  it('verifies stored sessions against Strapi', async () => {
    fetch.mockResolvedValue(response({ id: 4, username: 'shopper' }));
    expect((await getCurrentUser('user-jwt')).username).toBe('shopper');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer user-jwt');
  });

  it('reports backend auth errors without leaking secrets', async () => {
    fetch.mockResolvedValue(response({ error: { message: 'Invalid identifier or password' } }, 400));
    await expect(login({ identifier: 'bad', password: 'bad' })).rejects.toThrow('Invalid identifier or password');
  });

  it('normalizes populated v5 products and uses documentId for detail', async () => {
    const product = { id: 1, documentId: 'doc123', title: 'Hat', price: '12.50', stock: 3,
      category: { id: 7, name: 'Clothes', slug: 'clothes' }, image: { url: 'https://s3.example/hat.jpg' } };
    fetch.mockResolvedValueOnce(response({ data: [product] })).mockResolvedValueOnce(response({ data: product }));
    const [item] = await fetchProducts();
    expect(item).toMatchObject({ id: 'doc123', name: 'Hat', price: 12.5, category: 'Clothes', categoryId: '7', image: 'https://s3.example/hat.jpg' });
    expect(fetch.mock.calls[0][0]).toContain('/api/products?populate=*');
    expect((await fetchProduct('doc123')).id).toBe('doc123');
    expect(fetch.mock.calls[1][0]).toContain('/api/products/doc123?populate=*');
  });

  it('renders Strapi rich-text descriptions as readable text', async () => {
    fetch.mockResolvedValue(response({ data: [{ id: 2, documentId: 'rich', title: 'Hat', description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Soft cotton' }] }] }] }));
    expect((await fetchProducts())[0].description).toBe('Soft cotton');
  });

  it('uploads and creates with a category documentId and the signed-in user JWT', async () => {
    fetch.mockResolvedValueOnce(response([{ id: 33 }])).mockResolvedValueOnce(response({ data: { id: 2, documentId: 'new', title: 'Hat' } }));
    const file = new File(['image'], 'hat.png', { type: 'image/png' });
    expect(await uploadImage(file, 'user-jwt')).toBe(33);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer user-jwt');
    expect(fetch.mock.calls[0][1].body.get('files')).toBe(file);
    await createProduct({ title: 'Hat', description: 'Blue hat', price: 12.5, stock: 2, categoryDocumentId: 'electronicdoc123', uploadedImageId: 33 }, 'user-jwt');
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer user-jwt');
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ data: { title: 'Hat', description: 'Blue hat', price: 12.5, stock: 2, category: 'electronicdoc123', image: 33 } });
  });

  it('rejects uploads without a session', async () => {
    await expect(uploadImage(new File(['a'], 'a.png'), '')).rejects.toThrow(/sign in/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('explains missing Strapi upload permissions', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403, text: async () => JSON.stringify({ error: { message: 'Forbidden' } }) });
    await expect(uploadImage(new File(['a'], 'a.png'), 'jwt')).rejects.toThrow(/Authenticated role/i);
  });

  it('reports offline product GETs instead of presenting an empty catalog', async () => {
    fetch.mockRejectedValue(new Error('Network offline'));
    await expect(fetchProducts()).rejects.toThrow('Network offline');
  });

  it('loads every page of the Strapi catalogue', async () => {
    fetch.mockResolvedValueOnce(response({ data: [{ id: 1, documentId: 'first', title: 'First' }], meta: { pagination: { page: 1, pageCount: 2 } } }))
      .mockResolvedValueOnce(response({ data: [{ id: 2, documentId: 'second', title: 'Second' }], meta: { pagination: { page: 2, pageCount: 2 } } }));
    expect((await fetchProducts()).map((item) => item.name)).toEqual(['First', 'Second']);
    expect(fetch.mock.calls[1][0]).toContain('pagination[page]=2');
    expect(fetch.mock.calls[1][0]).toContain('populate=*');
  });
});
