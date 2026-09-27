import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, Tag } from 'lucide-react';
import './style.css';

import { getProductById, getProductBySlug } from './services/catalogService.js';
import { fetchCategories, fetchProduct, fetchProducts } from './services/strapiApi.js';
import { useCart } from './hooks/useCart.js';
import { useAuth } from './hooks/useAuth.js';
import { useFavorites } from './hooks/useFavorites.js';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import AccountModal from './components/AccountModal.jsx';
import OrderModal from './components/OrderModal.jsx';
import SellProductModal from './components/SellProductModal.jsx';

import HomePage from './pages/HomePage.jsx';
import ListingPage from './pages/ListingPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LiveStorefront from './pages/LiveStorefront.jsx';

const liveMode = Boolean(import.meta.env.VITE_STRAPI_API_URL);

function parseHashLocation() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { page: 'home', target: '' };
  
  const [route, ...rest] = hash.split('/');
  const param = decodeURIComponent(rest.join('/') || '');

  if (route === 'product') return { page: 'product', target: param };
  if (route === 'listing' || route === 'category') return { page: 'listing', target: param };
  if (route === 'search') return { page: 'listing', target: 'Search results', query: param };
  if (route === 'checkout') return { page: 'checkout', target: '' };
  return { page: 'home', target: '' };
}

function updateHashLocation(page, target, query = '') {
  if (page === 'home') {
    window.location.hash = target === 'services' ? '#services' : '#home';
  } else if (page === 'product') {
    window.location.hash = `#product/${encodeURIComponent(target)}`;
  } else if (page === 'listing') {
    if (target === 'Search results' && query) {
      window.location.hash = `#search/${encodeURIComponent(query)}`;
    } else {
      window.location.hash = `#listing/${encodeURIComponent(target || '')}`;
    }
  } else if (page === 'checkout') {
    window.location.hash = '#checkout';
  }
}

export function App() {
  const [locationState, setLocationState] = useState(parseHashLocation);
  const [category, setCategory] = useState(locationState.target || '');
  const [query, setQuery] = useState(locationState.query || '');
  const [selectedProductId, setSelectedProductId] = useState(locationState.page === 'product' ? locationState.target : '');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [strapiCategories, setStrapiCategories] = useState([]);
  const [strapiProducts, setStrapiProducts] = useState([]);
  const [loadingStrapi, setLoadingStrapi] = useState(liveMode);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState('');
  const [strapiError, setStrapiError] = useState('');
  const [toast, setToast] = useState('');

  const { items: cartItems, addToCart, changeQuantity: updateQuantity, removeItem, clearCart } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user, token, ready, login, register, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  // Handle browser back/forward and hash changes
  useEffect(() => {
    function handleHashChange() {
      const parsed = parseHashLocation();
      setLocationState(parsed);
      if (parsed.page === 'listing') {
        if (parsed.query) setQuery(parsed.query);
        setCategory(parsed.target === 'Search results' ? '' : parsed.target);
      } else if (parsed.page === 'product' && parsed.target) {
        setSelectedProductId(parsed.target);
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load Strapi Categories & Products
  const loadStrapiData = async () => {
    if (!liveMode) return;
    try {
      setLoadingStrapi(true);
      setStrapiError('');
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setStrapiCategories(cats);
      setStrapiProducts(prods);
    } catch (err) {
      setStrapiError(err.message || 'Unable to connect to Strapi.');
    } finally {
      setLoadingStrapi(false);
    }
  };

  useEffect(() => {
    loadStrapiData();
  }, []);

  // Fetch product detail whenever selectedProductId changes
  useEffect(() => {
    let active = true;
    async function loadProduct() {
      if (locationState.page !== 'product' || !selectedProductId) return;
      setSelectedProduct(null); setProductError(''); setLoadingProduct(true);
      try {
        let prod;
        if (liveMode) prod = await fetchProduct(selectedProductId);
        else prod = await getProductBySlug(selectedProductId) || await getProductById(selectedProductId);
        if (active) setSelectedProduct(prod);
      } catch (err) {
        if (active) setProductError(err.message || 'Unable to load product');
      } finally {
        if (active) setLoadingProduct(false);
      }
    }
    loadProduct();
    return () => { active = false; };
  }, [selectedProductId, locationState.page]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__shopcartToast);
    window.__shopcartToast = window.setTimeout(() => setToast(''), 2500);
  };

  const navigate = (nextPage, target = '', searchVal = '') => {
    if (nextPage === 'product') {
      setSelectedProductId(target);
    } else if (nextPage === 'listing') {
      setCategory(target === 'Search results' ? '' : target);
      if (target === 'Search results') {
        setQuery(searchVal || query);
      } else {
        setQuery('');
      }
    }
    setLocationState({ page: nextPage, target, query: searchVal });
    updateHashLocation(nextPage, target, searchVal || (target === 'Search results' ? query : ''));
    setCartOpen(false);
    setAccountOpen(false);

    if (nextPage === 'home' && target === 'services') {
      setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    showToast(`${product.name || 'Item'} added to your cart`);
  };

  const currentPage = locationState.page;

  return (
    <div className="app-shell">
      <div className="seller-banner"><div className="container"><span><Tag size={14} /> Sell your items on FECS329 Store</span><button type="button" onClick={() => { if (user) setSellModalOpen(true); else setAccountOpen(true); }}>{user ? 'Sell Product' : 'Sign in to sell'}</button></div></div>

      <Header
        onNavigate={navigate}
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        query={query}
        setQuery={setQuery}
        onAccount={() => setAccountOpen(true)}
        accountName={user?.username}
        liveCategories={liveMode}
        categories={liveMode ? strapiCategories : undefined}
        products={liveMode ? strapiProducts : undefined}
      />

      {liveMode && ['home', 'listing', 'product'].includes(currentPage) && <LiveStorefront page={currentPage} products={strapiProducts} categories={strapiCategories} category={category} query={currentPage === 'listing' ? query : ''} product={selectedProduct} loading={currentPage === 'product' ? loadingProduct : loadingStrapi} error={currentPage === 'product' ? productError : strapiError} onRetry={currentPage === 'product' ? () => { setSelectedProductId(''); setTimeout(() => setSelectedProductId(locationState.target), 0); } : loadStrapiData} onNavigate={navigate} onAdd={handleAddToCart} />}

      {!liveMode && <div className="container config-note" role="status">Demo catalog: set VITE_STRAPI_API_URL to show live Strapi products and account listings.</div>}
      {!liveMode && currentPage === 'home' && (
        <HomePage
          onNavigate={navigate}
          onOpen={(id) => navigate('product', id)}
          onAdd={handleAddToCart}
          favorites={favorites}
          onFavorite={toggleFavorite}
        />
      )}

      {!liveMode && currentPage === 'listing' && (
        <ListingPage
          onNavigate={navigate}
          onOpen={(id) => navigate('product', id)}
          onAdd={handleAddToCart}
          favorites={favorites}
          onFavorite={toggleFavorite}
          searchQuery={query}
          category={category}
          setCategory={setCategory}
        />
      )}

      {!liveMode && currentPage === 'product' && selectedProduct && (
        <ProductDetailPage
          key={selectedProduct.id}
          product={selectedProduct}
          onNavigate={navigate}
          onAdd={handleAddToCart}
        />
      )}

      {currentPage === 'checkout' && (
        <CheckoutPage
          items={cartItems}
          onChangeQty={updateQuantity}
          onNavigate={navigate}
          onPlaceOrder={() => {
            if (cartItems.length) {
              setOrderOpen(true);
            } else {
              showToast('Your cart is empty');
            }
          }}
        />
      )}

      <Footer onNavigate={navigate} />

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onNavigate={navigate}
          onChangeQty={updateQuantity}
          onRemove={removeItem}
        />
      )}

      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} onLogin={login} onRegister={register} user={user} onLogout={logout} />}

      <SellProductModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        token={ready ? token : ''}
        categories={strapiCategories}
        onProductCreated={async (newProd) => {
          await loadStrapiData();
          showToast(`Created ${newProd?.title || 'product'}!`);
          navigate('listing', '');
        }}
      />

      {orderOpen && (
        <OrderModal
          onClose={() => setOrderOpen(false)}
          onContinue={() => {
            setOrderOpen(false);
            clearCart();
            navigate('home');
          }}
        />
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <CheckCircle2 size={17} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
