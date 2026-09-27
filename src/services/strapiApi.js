import { formatStrapiImageUrl, getStrapiApiUrl } from '../utils/strapi.js';

function plainText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean).join('\n');
  if (value && typeof value === 'object') return value.text || plainText(value.children);
  return '';
}

/**
 * Normalizes a raw Strapi product item into a consistent component-friendly object.
 */
export function normalizeProduct(item) {
  if (!item) return null;

  // Handle both Strapi v5 envelope `{ id, documentId, title, ... }` or nested `attributes` (Strapi v4 fallback)
  const id = item.documentId || item.id;
  const attributes = item.attributes || item;

  const title = attributes.title || attributes.name || 'Untitled Product';
  const description = plainText(attributes.description);
  const price = Number(attributes.price ?? 0);
  const stock = Number(attributes.stock ?? 0);

  // Category handling (can be string, object, or populated Strapi v5 object)
  let category = 'Uncategorized';
  let categoryId = null;
  let categorySlug = '';
  if (attributes.category) {
    const catData = attributes.category.data ? attributes.category.data : attributes.category;
    if (typeof catData === 'object') {
      const catAttrs = catData.attributes || catData;
      category = catAttrs.name || catAttrs.title || 'Uncategorized';
      categoryId = String(catData.id || catAttrs.documentId || '');
      categorySlug = catAttrs.slug || category.toLowerCase();
    } else if (typeof catData === 'string') {
      category = catData;
      categorySlug = catData.toLowerCase();
    }
  }

  // Image handling
  const imageRaw = attributes.image || attributes.images?.[0];
  const imageUrl = formatStrapiImageUrl(imageRaw);

  return {
    id: String(id),
    documentId: item.documentId || String(item.id),
    title,
    name: title,
    description,
    price,
    stock,
    category,
    categoryId,
    categorySlug,
    imageUrl,
    image: imageUrl,
    raw: item,
  };
}

/**
 * Fetch all products populated with relations from Strapi.
 */
export async function fetchProducts() {
  const items = [];
  let page = 1;
  let pageCount = 1;
  do {
    const apiUrl = getStrapiApiUrl(`/api/products?populate=*&pagination[page]=${page}`);
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch products (${response.status} ${response.statusText})`);
    const json = await response.json();
    if (!Array.isArray(json?.data)) throw new Error('Unexpected products response from Strapi.');
    items.push(...json.data.map(normalizeProduct));
    pageCount = Number(json.meta?.pagination?.pageCount) || 1;
    page += 1;
  } while (page <= pageCount);
  return items;
}

/**
 * Fetch single product by documentId or id populated from Strapi.
 */
export async function fetchProduct(documentIdOrId) {
  const apiUrl = getStrapiApiUrl(`/api/products/${documentIdOrId}?populate=*`);
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${documentIdOrId}`);
  }
  const json = await response.json();
  const rawData = json?.data;
  return normalizeProduct(rawData);
}

/**
 * Fetch all categories populated with relations from Strapi.
 */
export async function fetchCategories() {
  const apiUrl = getStrapiApiUrl('/api/categories?populate=*');
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories (${response.status} ${response.statusText})`);
  }
  const json = await response.json();
  const rawList = Array.isArray(json?.data) ? json.data : [];
  return rawList.map((item) => {
    const id = item.id;
    const documentId = item.documentId || id;
    const attrs = item.attributes || item;
    return {
      id,
      documentId,
      name: attrs.name || attrs.title || 'Category',
      slug: attrs.slug || (attrs.name || '').toLowerCase(),
      description: attrs.description || '',
      image: formatStrapiImageUrl(attrs.image),
    };
  });
}

/**
 * Step 1: Upload Image to S3 / Strapi Media API.
 */
export async function uploadImage(file, jwt) {
  if (!jwt) throw new Error('Please sign in before uploading a product.');
  const formData = new FormData();
  formData.append('files', file);

  const apiUrl = getStrapiApiUrl('/api/upload');
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 403) throw new Error('Image upload denied. Enable upload permission for the Authenticated role in Strapi.');
    let message = errText;
    try { message = JSON.parse(errText)?.error?.message || errText; } catch { /* non-JSON error */ }
    throw new Error(`Image upload failed (${response.status}): ${message}`);
  }

  const json = await response.json();
  // Strapi returns an array of uploaded file objects
  if (Array.isArray(json) && json.length > 0) {
    return json[0].id;
  }
  if (json?.id) {
    return json.id;
  }
  throw new Error('Invalid response structure from media upload endpoint.');
}

/**
 * Step 2: Create Product record linking uploaded image & category.
 */
export async function createProduct({ title, description, price, stock, categoryDocumentId, uploadedImageId }, jwt) {
  if (!jwt) throw new Error('Please sign in before creating a product.');
  const payload = {
    data: {
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      ...(categoryDocumentId ? { category: categoryDocumentId } : {}),
      ...(uploadedImageId ? { image: uploadedImageId } : {}),
    },
  };

  const apiUrl = getStrapiApiUrl('/api/products');
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 403) throw new Error('Product creation denied. Enable Product.create for the Authenticated role in Strapi.');
    let message = errText;
    try { message = JSON.parse(errText)?.error?.message || errText; } catch { /* non-JSON error */ }
    throw new Error(`Product creation failed (${response.status}): ${message}`);
  }

  const json = await response.json();
  return normalizeProduct(json?.data);
}
