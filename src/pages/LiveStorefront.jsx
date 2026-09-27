import React from 'react';
import { formatMoney } from '../components/productUtils.js';
import { filterCatalog } from '../services/liveCatalog.js';

export default function LiveStorefront({ page = 'home', products = [], categories = [], category = '', query = '', product = null, loading = false, error = '', onRetry = () => {}, onNavigate = () => {}, onAdd = () => {} }) {
  if (loading) return <main className="container live-store" role="status"><p>Loading products from Strapi…</p><div className="live-skeleton" /></main>;
  if (error) return <main className="container live-store"><div className="empty-state" role="alert"><h2>We couldn’t load the shop</h2><p>{error}</p><button className="button button-green" onClick={onRetry}>Retry</button></div></main>;

  if (page === 'product') {
    if (!product) return <main className="container live-store"><div className="empty-state"><h1>Product not found</h1><button onClick={() => onNavigate('listing', '')}>Browse products</button></div></main>;
    return <main className="container product-page live-store">
      <button className="text-action" onClick={() => onNavigate('listing', '')}>← All products</button>
      <div className="product-detail-grid">
        <div className="main-product-image"><img className="product-image" src={product.image} alt={product.name} /></div>
        <div className="detail-info"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p><div className="detail-price">{formatMoney(product.price)}</div>
          <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <button className="button button-green" type="button" disabled={product.stock <= 0} onClick={() => onAdd(product)}>Add to Cart</button>
        </div>
      </div>
    </main>;
  }

  const visible = filterCatalog(products, { query, category: page === 'listing' ? category : '' });
  return <main className="container live-store">
    <div className="live-heading"><span className="eyebrow">FECS329 Store · Strapi catalogue</span><h1>{page === 'home' ? 'Discover something new' : query ? `Results for “${query}”` : category ? `Shop ${category}` : 'All products'}</h1><p>Explore products listed by our community.</p></div>
    <div className="live-categories"><button className={!category ? 'active' : ''} onClick={() => onNavigate('listing', '')}>All products</button>{categories.map((cat) => <button key={cat.id} className={category === cat.slug || category === cat.name ? 'active' : ''} onClick={() => onNavigate('listing', cat.slug || cat.name)}>{cat.name}</button>)}</div>
    {visible.length ? <div className="product-grid">{visible.map((item) => <article className="product-card" key={item.id}>
      <button className="product-picture live-picture" aria-label={`View ${item.name}`} onClick={() => onNavigate('product', item.documentId)}><img className="product-image" src={item.image} alt={item.name} /></button>
      <div className="product-info"><span className="eyebrow">{item.category}</span><div className="product-name-line"><button className="product-title" onClick={() => onNavigate('product', item.documentId)}>{item.name}</button><strong>{formatMoney(item.price)}</strong></div>
        <p className="product-description">{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</p>
        <button className="outline-add" disabled={item.stock <= 0} onClick={() => onAdd(item)}>Add to Cart</button>
      </div>
    </article>)}</div> : <div className="empty-state"><h2>No products found</h2><p>Try another category or search term.</p></div>}
  </main>;
}
