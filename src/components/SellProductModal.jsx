import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { createProduct, uploadImage } from '../services/strapiApi.js';

export function SellProductModal({ isOpen, onClose, token = '', categories = [], onProductCreated = () => {} }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [categoryDocumentId, setCategoryDocumentId] = useState('');
  const [file, setFile] = useState(null);
  const uploaded = useRef(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    const close = (event) => { if (event.key === 'Escape' && !busy) onClose(); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, busy, onClose]);

  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!token) { setError('Please sign in to sell products.'); return; }
    if (!title.trim() || !file || !categoryDocumentId || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      setError('Enter a title, category, image, valid price and whole-number stock.'); return;
    }
    setBusy(true); setError('');
    try {
      let uploadedImageId = uploaded.current?.file === file ? uploaded.current.id : null;
      if (!uploadedImageId) {
        setStatus('Uploading image…');
        uploadedImageId = await uploadImage(file, token);
        uploaded.current = { file, id: uploadedImageId };
      }
      setStatus('Creating product…');
      const product = await createProduct({ title: title.trim(), description: description.trim(), price: Number(price), stock: Number(stock), categoryDocumentId, uploadedImageId }, token);
      await onProductCreated(product);
      uploaded.current = null;
      setStatus(''); setTitle(''); setDescription(''); setPrice(''); setStock('1'); setCategoryDocumentId(''); setFile(null);
      onClose();
    } catch (err) { setError(err.message || 'Could not publish the product.'); setStatus(''); }
    finally { setBusy(false); }
  };

  return <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <div className="account-modal sell-modal" role="dialog" aria-modal="true" aria-labelledby="sell-title">
      <button className="modal-close" type="button" aria-label="Close sell dialog" disabled={busy} onClick={onClose}><X size={18} /></button>
      <span className="eyebrow">List your item</span><h2 id="sell-title">Sell a product</h2>
      {!token ? <p>Please sign in to list products.</p> : <>
        <p>Your image uploads to Strapi media storage before the product is created.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        {status && <p role="status">{status}</p>}
        <form onSubmit={submit}>
          <label>Title<input name="title" required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label>Description<textarea name="description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} /></label>
          <div className="sell-row">
            <label>Price ($)<input name="price" type="number" min="0" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} /></label>
            <label>Stock<input name="stock" type="number" min="0" step="1" required value={stock} onChange={(event) => setStock(event.target.value)} /></label>
          </div>
          <label>Category<select name="category" required value={categoryDocumentId} onChange={(event) => setCategoryDocumentId(event.target.value)}><option value="">Choose a category</option>{categories.map((cat) => <option key={cat.documentId} value={cat.documentId}>{cat.name}</option>)}</select></label>
          <label>Product image<input name="image" type="file" accept="image/*" required onChange={(event) => { uploaded.current = null; setFile(event.target.files?.[0] || null); }} /></label>
          <button className="button button-green" type="submit" disabled={busy || !categories.length}>{busy ? 'Publishing…' : 'Publish product'}</button>
          {!categories.length && <small>No categories available. Check Strapi category permissions.</small>}
        </form>
      </>}
    </div>
  </div>;
}

export default SellProductModal;
