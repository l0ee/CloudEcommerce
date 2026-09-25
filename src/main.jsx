import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronRight, CreditCard,
  Heart, MapPin, Menu, Minus, PackageCheck, Phone, Plus, RotateCcw, Search,
  ShieldCheck, ShoppingCart, SlidersHorizontal, Star, Truck, UserRound, X,
} from 'lucide-react';
import './style.css';

const A = '/assets/';

const products = [
  { id: 'earbuds', name: 'Wireless Earbuds, IPX8', price: 89, old: 119, desc: 'Premium bone conduction open ear Bluetooth', category: 'Headphones', image: 'product-headphones.png', tag: 'BEST SELLER', color: 'black', colors: ['black', 'blue', 'white'], rating: 4.9 },
  { id: 'airpods', name: 'AirPods Max', price: 559, old: 629, desc: 'A perfect balance of high-fidelity audio', category: 'Headphones', image: 'product-airpods.png', tag: 'POPULAR', color: 'pink', colors: ['pink', 'black', 'blue', 'silver', 'green'], rating: 4.9 },
  { id: 'bose', name: 'Bose BT Earphones', price: 289, old: 349, desc: 'Rich sound with noise cancellation', category: 'Headphones', image: 'product-headphones.png', tag: '', color: 'black', colors: ['black', 'white'], rating: 4.8 },
  { id: 'vivefox', name: 'VIVEFOX Headphones', price: 39, old: 59, desc: 'Wireless stereo headphones with mic', category: 'Headphones', image: 'product-airpods.png', tag: 'NEW', color: 'red', colors: ['red', 'black', 'blue'], rating: 4.8 },
  { id: 'jbl', name: 'JBL Tune 600BTNC', price: 79, old: 99, desc: 'Lightweight sound, made to move with you', category: 'Headphones', image: 'product-headphones.png', tag: '', color: 'blue', colors: ['blue', 'black', 'white'], rating: 4.7 },
  { id: 'tagry', name: 'TAGRY Bluetooth', price: 59, old: 89, desc: 'All day battery with a comfortable fit', category: 'Headphones', image: 'product-headphones.png', tag: 'SALE', color: 'black', colors: ['black', 'green'], rating: 4.7 },
  { id: 'monster', name: 'Monster N-Flex', price: 99, old: 139, desc: 'Flex Active noise cancelling Bluetooth', category: 'Headphones', image: 'product-airpods.png', tag: '', color: 'green', colors: ['green', 'black', 'pink'], rating: 4.6 },
  { id: 'mpow', name: 'Mpow CH6', price: 36, old: 49, desc: 'Comfort-first headphones made for kids', category: 'Headphones', image: 'product-headphones.png', tag: '', color: 'red', colors: ['red', 'blue'], rating: 4.7 },
  { id: 'homepod', name: 'HomePod mini', price: 99, old: 129, desc: 'Room-filling sound in a small package', category: 'Tech', image: 'product-homepod.png', tag: 'TOP PICK', color: 'white', colors: ['white', 'blue', 'yellow'], rating: 4.8 },
  { id: 'instax', name: 'Instax Mini 9', price: 99, old: 119, desc: 'Instant photos, ready to keep and share', category: 'Tech', image: 'product-camera.png', tag: '', color: 'blue', colors: ['blue', 'pink', 'yellow'], rating: 4.7 },
  { id: 'macbook', name: 'MacBook Pro 13”', price: 1099, old: 1299, desc: '256 GB, 8-core GPU, 8 GB memory', category: 'Tech', image: 'product-macbook.png', tag: 'SAVE $200', color: 'silver', colors: ['silver', 'blue'], rating: 4.9 },
  { id: 'bottle', name: 'Pendleton Water Bottle', price: 89, old: 109, desc: 'Stainless steel, food safe, hand wash', category: 'Travel', image: 'product-bottle.png', tag: '', color: 'yellow', colors: ['yellow', 'blue'], rating: 4.6 },
  { id: 'sofa', name: 'Modern Sofa', price: 799, old: 999, desc: 'A comfortable place to land, made for everyday', category: 'Furniture', image: 'product-sofa.png', tag: 'SAVE $200', color: 'green', colors: ['green', 'blue'], rating: 4.8 },
  { id: 'tote', name: 'Tote e Medium', price: 239, old: 279, desc: 'Canvas, full-grain leather and thoughtful details', category: 'Hand Bag', image: 'product-tote.png', tag: '', color: 'tan', colors: ['tan', 'black'], rating: 4.7 },
  { id: 'book', name: 'The Design Book', price: 28, old: 34, desc: 'Fresh ideas for creative spaces and everyday life', category: 'Books', image: 'product-book.png', tag: '', color: 'red', colors: ['red'], rating: 4.6 },
  { id: 'sneakers', name: 'Adidas Court Sneakers', price: 89, old: 110, desc: 'A classic court look with a soft, easy fit', category: 'Sneakers', image: 'product-sneakers.png', tag: 'BEST SELLER', color: 'white', colors: ['white', 'blue'], rating: 4.8 },
];

const categories = [
  { title: 'Furniture', image: 'cat-furniture.png', tone: 'mint' },
  { title: 'Hand Bag', image: 'cat-bag.png', tone: 'apricot' },
  { title: 'Books', image: 'cat-books.png', tone: 'berry' },
  { title: 'Tech', image: 'cat-tech.png', tone: 'green' },
  { title: 'Sneakers', image: 'cat-sneakers.png', tone: 'rose' },
  { title: 'Travel', image: 'cat-travel.png', tone: 'gold' },
];

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

function Logo() {
  return <button className="brand" aria-label="Shopcart home"><span className="brand-mark"><ShoppingCart size={21} strokeWidth={2.2}/><i/><b/></span><span>Shopcart</span></button>;
}

function Header({ onNavigate, cartCount, onCart, query, setQuery, onAccount }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const suggestions = products.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
  const submitSearch = () => { setSearchOpen(false); onNavigate('listing', query ? 'Search results' : 'Headphones'); };
  return <header className="site-header">
    <div className="topline">
      <div className="topline-inner">
        <a className="phone-line" href="tel:+001234567890"><Phone size={12}/> +001234567890</a>
        <button className="top-promo" onClick={() => onNavigate('listing', 'Headphones')}>Get 50% Off on Selected Items <span>|</span> <u>Shop Now</u></button>
        <div className="top-selects"><button>Eng <ChevronDown size={12}/></button><button><MapPin size={12}/> Location <ChevronDown size={12}/></button></div>
      </div>
    </div>
    <div className="nav-wrap">
      <nav className="nav-main container">
        <button className="mobile-menu" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button>
        <div onClick={() => onNavigate('home')}><Logo/></div>
        <div className="nav-links">
          <div className="nav-categories-wrap">
            <button className={'nav-link ' + (categoryOpen ? 'active' : '')} onClick={() => setCategoryOpen(!categoryOpen)}>Categories <ChevronDown size={14}/></button>
            {categoryOpen && <div className="category-menu">
              <div className="menu-kicker">Shop by department</div>
              {['Electronics', 'Audio & Headphones', 'Computers & Tablets', 'Home & Living', 'Travel accessories', 'New arrivals'].map((name, index) => <button key={name} onClick={() => { setCategoryOpen(false); onNavigate('listing', index < 3 ? 'Headphones' : name); }}>{name}<ChevronRight size={14}/></button>)}
              <div className="menu-note"><span>Up to 50% off</span><small>on selected electronics</small></div>
            </div>}
          </div>
          <button className="nav-link" onClick={() => onNavigate('listing', 'Headphones')}>Deals</button>
          <button className="nav-link" onClick={() => onNavigate('listing', 'Headphones')}>What’s New</button>
          <button className="nav-link" onClick={() => onNavigate('home', 'services')}>Delivery</button>
        </div>
        <div className="search-wrap">
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
            <input aria-label="Search products" placeholder="Search Product" value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}/>
            {query && <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={14}/></button>}
            <button type="submit" aria-label="Search"><Search size={19}/></button>
          </form>
          {searchOpen && query && <div className="search-results">
            {suggestions.length ? suggestions.map((item) => <button key={item.id} onClick={() => { setSearchOpen(false); setQuery(''); onNavigate('product', item.id); }}><img src={A + item.image}/><span>{item.name}<small>{money(item.price)}</small></span><ArrowRight size={15}/></button>) : <p>No products found for “{query}”.</p>}
            <button className="search-all" onClick={submitSearch}>See all results <ArrowRight size={14}/></button>
          </div>}
        </div>
        <div className="nav-actions"><button className="account-action" onClick={onAccount}><UserRound size={19}/><span>Account</span></button><button className="cart-action" onClick={onCart}><span className="cart-icon-wrap"><ShoppingCart size={20}/>{cartCount > 0 && <i>{cartCount}</i>}</span><span>Cart</span></button></div>
      </nav>
      {mobileOpen && <div className="mobile-navigation">{[['Electronics','Headphones'],['Audio & Headphones','Headphones'],['Computers & Tablets','Tech'],['Home & Living','Furniture'],['Travel accessories','Travel'],['Deals','Headphones'],['New arrivals','Tech'],['Delivery','services']].map(([label,target])=><button key={label} onClick={()=>{setMobileOpen(false);onNavigate(target==='services'?'home':'listing',target==='services'?'services':target);}}>{label}<ChevronRight size={15}/></button>)}</div>}
    </div>
    {categoryOpen && <button aria-label="Close category menu" className="menu-backdrop" onClick={() => setCategoryOpen(false)}/>}
    {searchOpen && query && <button aria-label="Close search results" className="search-backdrop" onClick={() => setSearchOpen(false)}/>}
  </header>;
}

function Rating({ value = 4.9 }) {
  return <span className="rating" aria-label={`${value} out of 5 stars`}><span>★★★★★</span><small>(121)</small></span>;
}

function ProductCard({ product, onOpen, onAdd, favorite, onFavorite, compact = false }) {
  return <article className={'product-card ' + (compact ? 'compact' : '')}>
    <div className="product-picture" onClick={() => onOpen(product.id)} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen(product.id)}>
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <button className={'heart-button ' + (favorite ? 'hearted' : '')} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} onClick={(event) => { event.stopPropagation(); onFavorite(product.id); }}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/></button>
      <img className={'product-image tint-' + product.color} src={A + product.image} alt={product.name} loading="lazy"/>
      <div className="quick-add"><button onClick={(event) => { event.stopPropagation(); onAdd(product); }}><Plus size={15}/> Quick add</button></div>
    </div>
    <div className="product-info">
      <div className="product-name-line"><button className="product-title" onClick={() => onOpen(product.id)}>{product.name}</button><strong>{money(product.price)}</strong></div>
      {!compact && <p className="product-description">{product.desc}</p>}
      <div className="rating-line"><Rating value={product.rating}/><del>{money(product.old)}</del></div>
      <button className="outline-add" onClick={() => onAdd(product)}><ShoppingCart size={15}/> Add to Cart</button>
    </div>
  </article>;
}

function SectionTitle({ eyebrow, title, action, onAction }) {
  return <div className="section-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action && <button className="text-action" onClick={onAction}>{action}<ArrowRight size={16}/></button>}</div>;
}

function ProductGrid({ items, onOpen, onAdd, favorites, onFavorite, compact = false }) {
  if (!items.length) return <div className="empty-state"><Search size={24}/><h3>No matches just yet</h3><p>Try another search or clear your filters.</p></div>;
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} onAdd={onAdd} favorite={favorites.includes(product.id)} onFavorite={onFavorite} compact={compact}/>)}</div>;
}

function HomePage({ onNavigate, onOpen, onAdd, favorites, onFavorite }) {
  const popular = [products[0], products[1], products[2], products[3]];
  const trending = [products[8], products[9], products[10], products[11]];
  return <main>
    <section className="hero container">
      <div className="hero-copy"><span className="hero-eyebrow"><span/> Fresh finds, everyday favourites</span><h1>Shopping And<br/>Department Store.</h1><p>Shopping is a bit of a relaxing hobby for me, which is sometimes troubling for the bank balance.</p><button className="button button-green" onClick={() => onNavigate('listing', 'Headphones')}>Learn More <ArrowRight size={16}/></button><div className="hero-proof"><div className="proof-avatars"><span>J</span><span>A</span><span>M</span></div><p><strong>4.9/5</strong><small>from 2,400+ happy shoppers</small></p></div></div>
      <div className="hero-art" aria-hidden="true"><img className="stage" src={A+'hero-stage.png'} alt=""/>
        <img className="hero-item hero-item-bag" src={A+'product-bag.png'} alt=""/><img className="hero-item hero-item-homepod" src={A+'product-homepod.png'} alt=""/><img className="hero-item hero-item-camera" src={A+'product-camera.png'} alt=""/><img className="hero-item hero-item-phone" src={A+'product-ipad.png'} alt=""/><img className="hero-item hero-item-headphones" src={A+'product-headphones.png'} alt=""/>
        <div className="float-note float-note-one"><span><Truck size={16}/></span><div><b>Free delivery</b><small>on your first order</small></div></div><div className="float-note float-note-two"><span className="note-check"><Check size={17}/></span><div><b>Shop with confidence</b><small>Easy returns, always</small></div></div>
      </div>
      <div className="hero-pagination"><button aria-label="Previous slide"><ArrowLeft size={15}/></button><span>01 <i/> 03</span><button aria-label="Next slide"><ArrowRight size={15}/></button></div>
    </section>

    <section className="container section-space categories-section">
      <SectionTitle eyebrow="Find your next favourite" title="Shop Our Top Categories" action="Explore all" onAction={() => onNavigate('listing', 'Headphones')}/>
      <div className="category-grid">{categories.map((category) => <button key={category.title} className={'category-card tone-'+category.tone} onClick={() => onNavigate('listing', category.title === 'Tech' ? 'Tech' : category.title)}><span>{category.title}</span><img src={A+category.image} alt="" loading="lazy"/><i><ArrowRight size={15}/></i></button>)}</div>
    </section>

    <section className="container section-space">
      <SectionTitle eyebrow="The ones everyone wants" title="Today’s Best Deals For You" action="View all deals" onAction={() => onNavigate('listing', 'Headphones')}/>
      <ProductGrid items={popular} onOpen={onOpen} onAdd={onAdd} favorites={favorites} onFavorite={onFavorite} compact/>
    </section>

    <section className="container promo-band">
      <div className="promo-copy"><span className="sale-pill"><span/> Weekend special</span><h2>Grab up to <em>50% off</em><br/>on selected headphones</h2><p>Big sound. Little prices. Find the pair that feels made for you.</p><button className="button button-green" onClick={() => onNavigate('listing', 'Headphones')}>Shop headphones <ArrowRight size={16}/></button><div className="promo-counter"><span><b>02</b><small>Days</small></span><i>:</i><span><b>18</b><small>Hours</small></span><i>:</i><span><b>36</b><small>Mins</small></span><i>:</i><span><b>42</b><small>Secs</small></span></div></div>
      <div className="promo-art"><div className="promo-orbit orbit-one"/><div className="promo-orbit orbit-two"/><div className="promo-product-shadow"/><img src={A+'product-airpods.png'} alt="Pink wireless headphones" loading="lazy"/><div className="promo-percent">-50%<small>limited time</small></div></div>
    </section>

    <section className="container section-space headphones-home">
      <div className="product-section-head"><SectionTitle eyebrow="Hear every detail" title="Headphones For You!" action="Browse all headphones" onAction={() => onNavigate('listing', 'Headphones')}/><div className="segmented"><button className="selected">Popular</button><button onClick={() => onNavigate('listing', 'Headphones')}>New arrivals</button><button onClick={() => onNavigate('listing', 'Headphones')}>Top rated</button></div></div>
      <ProductGrid items={popular} onOpen={onOpen} onAdd={onAdd} favorites={favorites} onFavorite={onFavorite}/>
    </section>

    <section className="container section-space brand-section">
      <SectionTitle eyebrow="Good things, trusted names" title="Choose By Brand" action="See all brands" onAction={() => onNavigate('listing', 'Tech')}/>
      <div className="brand-grid">{['STAPLES', 'sprouts', 'GROCERY outlet', 'mollie stones', 'SPORTS BASEMENT', 'the container store', 'target', 'bevmo!'].map((brand, index) => <button className={'brand-tile brand-tile-'+index} key={brand} onClick={() => onNavigate('listing','Tech')}><span>{brand}</span><small><Check size={12}/> Official store</small></button>)}</div>
    </section>

    <section className="container service-strip" id="services"><div><Truck/><span><b>Free delivery</b><small>On orders over $50</small></span></div><div><RotateCcw/><span><b>Easy returns</b><small>30 day return policy</small></span></div><div><ShieldCheck/><span><b>Secure checkout</b><small>100% protected payment</small></span></div><div><PackageCheck/><span><b>Great support</b><small>Here whenever you need us</small></span></div></section>

    <section className="container section-space popular-products"><SectionTitle eyebrow="Good picks, good prices" title="Weekly Popular Products" action="See everything" onAction={() => onNavigate('listing','Headphones')}/><ProductGrid items={trending} onOpen={onOpen} onAdd={onAdd} favorites={favorites} onFavorite={onFavorite} compact/></section>
  </main>;
}

function FilterPopover({ label, options, value, onChoose }) {
  const [open, setOpen] = useState(false);
  return <div className="filter-wrap"><button className={'filter-chip ' + (value && value !== 'All' ? 'filter-active' : '')} onClick={() => setOpen(!open)}>{value && value !== 'All' ? value : label}<ChevronDown size={13}/></button>{open && <div className="filter-popover">{options.map((option) => <button key={option} onClick={() => { onChoose(option === 'All' ? '' : option); setOpen(false); }} className={(value === option || (!value && option === 'All')) ? 'chosen' : ''}>{option}{(value === option || (!value && option === 'All')) && <Check size={14}/>}</button>)}</div>}</div>;
}

function ListingPage({ onNavigate, onOpen, onAdd, favorites, onFavorite, searchQuery, category, setCategory }) {
  const [sort, setSort] = useState('Featured');
  const [priceFilter, setPriceFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const source = useMemo(() => {
    let list = [...products];
    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter((item) => (item.name+' '+item.desc+' '+item.category).toLowerCase().includes(q));
    else if (category && category !== 'Headphones' && category !== 'All') list = list.filter((item) => item.category.toLowerCase() === category.toLowerCase() || (category === 'Electronics' && ['Headphones','Tech'].includes(item.category)));
    else if (!category || category === 'Headphones') list = list.filter((item) => item.category === 'Headphones');
    if (priceFilter === 'Under $100') list = list.filter((item) => item.price < 100);
    if (priceFilter === '$100–$300') list = list.filter((item) => item.price >= 100 && item.price <= 300);
    if (priceFilter === 'Over $300') list = list.filter((item) => item.price > 300);
    if (colorFilter) list = list.filter((item) => item.colors.includes(colorFilter.toLowerCase()));
    if (saleOnly) list = list.filter((item) => item.old > item.price);
    if (sort === 'Price: low to high') list.sort((a,b) => a.price-b.price);
    if (sort === 'Price: high to low') list.sort((a,b) => b.price-a.price);
    if (sort === 'Top rated') list.sort((a,b) => b.rating-a.rating);
    return list;
  }, [category, searchQuery, priceFilter, colorFilter, saleOnly, sort]);
  const title = searchQuery ? `Search results for “${searchQuery}”` : category && category !== 'Headphones' ? `${category} For You!` : 'Headphones For You!';
  return <main className="container listing-page">
    <div className="breadcrumbs"><button onClick={() => onNavigate('home')}>Home</button><ChevronRight size={13}/><button onClick={() => setCategory('Electronics')}>Electronics</button><ChevronRight size={13}/><span>{category || 'Headphones'}</span></div>
    <section className="listing-promo"><div className="listing-promo-copy"><span className="sale-pill"><span/> SHOP THE DROP</span><h1>Grab up to <em>50% off</em><br/>on selected headphones</h1><p>Make room for your new favourite. The sound upgrade you’ve been waiting for is here.</p><button className="button button-green" onClick={() => window.scrollTo({top:650,behavior:'smooth'})}>Shop now <ArrowRight size={15}/></button></div><div className="listing-promo-art"><div className="promo-glow"/><img src={A+'product-airpods.png'} alt="AirPods Max headphones"/></div><div className="banner-corner">UP TO<br/><b>50%</b><br/>OFF</div></section>
    <div className="listing-toolbar"><div className="filter-list"><FilterPopover label="Headphone Type" options={['All','Wireless','Over-ear','Earbuds']} value={category === 'Headphones' ? '' : category} onChoose={(v) => setCategory(v === 'Wireless' || v === 'Over-ear' || v === 'Earbuds' ? 'Headphones' : v || 'Headphones')}/><FilterPopover label="Price" options={['All','Under $100','$100–$300','Over $300']} value={priceFilter} onChoose={setPriceFilter}/><FilterPopover label="Review" options={['All','4.5 & up','Top rated']} value={sort === 'Top rated' ? 'Top rated' : ''} onChoose={(value) => value === 'Top rated' || value === '4.5 & up' ? setSort('Top rated') : setSort('Featured')}/><FilterPopover label="Color" options={['All','Black','Blue','Pink','White','Green']} value={colorFilter} onChoose={setColorFilter}/><FilterPopover label="Material" options={['All','Aluminum','Leather','Plastic']} value="" onChoose={() => {}}/><button className={'filter-chip ' + (saleOnly ? 'filter-active' : '')} onClick={() => setSaleOnly(!saleOnly)}>Offer <ChevronDown size={13}/></button><button className="filter-chip all-filters" onClick={() => {setPriceFilter('');setColorFilter('');setSaleOnly(false)}}><SlidersHorizontal size={14}/> All filters</button></div><label className="sort-label">Sort by <select value={sort} onChange={(e)=>setSort(e.target.value)}><option>Featured</option><option>Top rated</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={13}/></label></div>
    <div className="listing-heading"><div><span className="eyebrow">Thoughtful tech, timeless sound</span><h2>{title}</h2><p>Find your next favourite from the latest picks, loved by listeners everywhere.</p></div><span className="result-count">Showing <b>{source.length}</b> products</span></div>
    <ProductGrid items={source} onOpen={onOpen} onAdd={onAdd} favorites={favorites} onFavorite={onFavorite}/>
    {source.length > 4 && <div className="pagination"><button className="selected">1</button><button onClick={() => window.scrollTo({top:640,behavior:'smooth'})}>2</button><button onClick={() => window.scrollTo({top:640,behavior:'smooth'})}>3</button><button className="page-next" onClick={() => window.scrollTo({top:640,behavior:'smooth'})}><ChevronRight size={16}/></button></div>}
    <div className="listing-bottom-note"><span><ShieldCheck size={17}/></span><p><b>Thoughtful tech, straightforward service.</b><small>Every Shopcart order is packed with care and backed by easy returns.</small></p></div>
  </main>;
}

function ProductPage({ product, onNavigate, onAdd }) {
  const [color, setColor] = useState(product.color);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [postal, setPostal] = useState('');
  const [postalResult, setPostalResult] = useState('');
  const image = product.id === 'airpods' && color === 'black' ? 'product-headphones.png' : product.image;
  const chooseColor = (value) => { setColor(value); setActiveImage(product.id === 'airpods' && value === 'black' ? 'product-headphones.png' : product.image); };
  const add = () => onAdd(product, qty);
  return <main className="container product-page">
    <div className="breadcrumbs"><button onClick={() => onNavigate('home')}>Home</button><ChevronRight size={13}/><button onClick={() => onNavigate('listing','Headphones')}>Electronics</button><ChevronRight size={13}/><button onClick={() => onNavigate('listing','Headphones')}>Audio</button><ChevronRight size={13}/><span>{product.name}</span></div>
    <section className="product-detail-grid"><div className="detail-gallery"><div className="main-product-image"><span className="product-tag detail-tag">{product.tag || 'SHOPCART PICK'}</span><img className={'product-image tint-'+color} src={A+activeImage} alt={product.name}/><button className="gallery-arrow prev" aria-label="Previous image"><ArrowLeft size={17}/></button><button className="gallery-arrow next" aria-label="Next image"><ArrowRight size={17}/></button><span className="image-counter">01 / 04</span></div><div className="thumb-row">{[product.image,'product-headphones.png','product-airpods.png','product-homepod.png'].map((src,index) => <button key={index} className={activeImage === src ? 'thumb active' : 'thumb'} onClick={() => setActiveImage(src)}><img src={A+src} alt={`${product.name} view ${index+1}`}/></button>)}</div></div>
      <div className="detail-info"><div className="detail-overline"><span className="eyebrow">{product.category} / Wireless</span><button className="share-button"><span>Share</span><ArrowRight size={14}/></button></div><h1>{product.name}</h1><p className="detail-description">{product.id === 'airpods' ? 'A perfect balance of exhilarating high-fidelity audio, effortless magic and deep comfort. Experience sound in a completely new way.' : product.desc + '. A great everyday companion, built for lasting comfort and beautifully clear sound.'}</p><div className="detail-rating"><Rating value={product.rating}/><span>4.9 <i/> 121 verified reviews</span></div><div className="detail-price">{money(product.price)} <del>{money(product.old)}</del><span className="save-chip">Save {money(product.old-product.price)}</span></div><p className="installment">or 4 interest-free payments of <b>{money(product.price/4)}</b> with <strong>shop<span>pay</span></strong></p>
        <div className="detail-divider"/><div className="selection-heading"><span>Choose a color</span><b>{color.charAt(0).toUpperCase()+color.slice(1)}</b></div><div className="color-swatches">{product.colors.map((tone) => <button key={tone} className={'swatch swatch-'+tone+(color===tone?' selected':'')} aria-label={tone} onClick={() => chooseColor(tone)}><span/></button>)}</div>
        <div className="stock-and-qty"><div><span className="stock-dot"/> In stock <small>— ships in 1–2 days</small></div><div className="quantity-control"><button onClick={() => setQty(Math.max(1,qty-1))} aria-label="Decrease quantity"><Minus size={14}/></button><span>{qty}</span><button onClick={() => setQty(qty+1)} aria-label="Increase quantity"><Plus size={14}/></button></div></div>
        <div className="detail-buttons"><button className="button button-green" onClick={() => {add();onNavigate('checkout')}}>Buy Now <ArrowRight size={16}/></button><button className="button button-outline" onClick={add}><ShoppingCart size={16}/> Add to Cart</button></div>
        <div className="delivery-card"><div><span><Truck size={17}/></span><p><b>Free delivery</b><small>On orders over $50 · estimated 2–4 business days</small></p></div><div className="postal-check"><span><PackageCheck size={16}/></span><div><b>Check delivery to your area</b><form onSubmit={(e)=>{e.preventDefault();setPostalResult(postal ? `Great news — delivery is available for ${postal}.` : 'Please enter your postal code.')}}><input placeholder="Enter your postal code" value={postal} onChange={(e)=>setPostal(e.target.value)}/><button>Check</button></form>{postalResult && <small className="postal-result">{postalResult}</small>}</div></div><div><span><RotateCcw size={17}/></span><p><b>Easy 30 day returns</b><small>Free returns on all eligible items</small></p></div></div>
        <div className="secure-note"><ShieldCheck size={16}/> Secure checkout <i/> Free shipping on orders over $50</div>
      </div></section>
    <section className="specifications"><SectionTitle eyebrow="A closer look" title={`${product.name} — Full Specifications`}/><div className="spec-grid"><div className="spec-card"><h3>General</h3>{[['Brand','Apple'],['Model',product.name],['Price',money(product.price)],['Release date','December 2020'],['Model Number','A2096'],['Headphone Type','Over-Ear'],['Connectivity','Wireless']].map(([a,b])=><div className="spec-row" key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="spec-card"><h3>Product details</h3>{[['Microphone','Yes'],['Driver Type','Dynamic'],['Driver Size (mm)','40'],['Number of Drivers','1'],['Water Resistant','No'],['Weight (g)','385.00'],['Battery Life (Hrs)','20']].map(([a,b])=><div className="spec-row" key={a}><span>{a}</span><b>{b}</b></div>)}</div></div></section>
    <section className="section-space similar-section"><SectionTitle eyebrow="More to love" title="Similar Items You Might Like" action="View all" onAction={() => onNavigate('listing','Headphones')}/><ProductGrid items={products.filter((item)=>item.id!==product.id).slice(0,4)} onOpen={(id)=>onNavigate('product',id)} onAdd={onAdd} favorites={[]} onFavorite={()=>{}} compact/></section>
  </main>;
}

function CheckoutPage({ items, onChangeQty, onNavigate, onPlaceOrder, coupon, setCoupon, couponApplied, applyCoupon }) {
  const subtotal = items.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const delivery = subtotal > 50 || subtotal === 0 ? 0 : 5.9;
  const total = subtotal - discount + delivery;
  return <main className="container checkout-page">
    <div className="breadcrumbs"><button onClick={() => onNavigate('home')}>Home</button><ChevronRight size={13}/><button onClick={() => onNavigate('listing','Headphones')}>Shopping cart</button><ChevronRight size={13}/><span>Checkout</span></div>
    <div className="checkout-heading"><div><span className="eyebrow">Almost yours</span><h1>Review & checkout</h1><p>Just a few details and we’ll get your order on its way.</p></div><div className="checkout-progress"><span className="complete"><Check size={12}/></span><i/><span className="active">2</span><i/><span>3</span><small>Cart <b>Shipping</b> Payment</small></div></div>
    <div className="checkout-layout"><div className="checkout-left">
      <section className="checkout-card"><div className="checkout-card-head"><div><span className="step-number">01</span><h2>Review your items</h2></div><button onClick={()=>onNavigate('listing','Headphones')}>Continue shopping <ArrowRight size={14}/></button></div>{items.length ? items.map(({product,qty})=><div className="review-item" key={product.id}><img src={A+product.image} alt={product.name}/><div className="review-product"><button onClick={()=>onNavigate('product',product.id)}>{product.name}</button><small>Color: {product.color} · In stock</small><span className="review-rating">★★★★★ <i>(121 reviews)</i></span></div><div className="review-quantity"><button onClick={()=>onChangeQty(product.id,qty-1)}><Minus size={12}/></button><span>{qty}</span><button onClick={()=>onChangeQty(product.id,qty+1)}><Plus size={12}/></button></div><b className="review-total">{money(product.price*qty)}</b></div>) : <div className="empty-cart"><ShoppingCart size={22}/><p>Your cart is empty.</p><button onClick={()=>onNavigate('listing','Headphones')}>Find something you’ll love</button></div>}</section>
      <section className="checkout-card"><div className="checkout-card-head"><div><span className="step-number">02</span><h2>Delivery information</h2></div><span className="secure-small"><ShieldCheck size={14}/> Your details are secure</span></div><div className="form-grid"><label>First name<input placeholder="e.g. Alex"/></label><label>Last name<input placeholder="e.g. Morgan"/></label><label>Email address<input type="email" placeholder="alex@example.com"/></label><label>Phone number<input type="tel" placeholder="+1 (555) 000-0000"/></label><label className="full-field">Street address<input placeholder="House number and street name"/></label><label>City<input placeholder="Your city"/></label><label>Postal code<input placeholder="Postal code"/></label><label>State / province<select defaultValue=""><option value="" disabled>Select state</option><option>California</option><option>New York</option><option>Texas</option></select></label><label>Country<select defaultValue="United States"><option>United States</option><option>Canada</option><option>United Kingdom</option></select></label><label className="full-field">Delivery notes <span className="optional">Optional</span><textarea placeholder="Anything we should know about delivery?" rows="3"/></label></div><label className="checkbox-line"><input type="checkbox" defaultChecked/><span/> Save this address for next time</label></section>
      <section className="checkout-card payment-card"><div className="checkout-card-head"><div><span className="step-number">03</span><h2>Payment method</h2></div><span className="secure-small"><ShieldCheck size={14}/> Secure payment</span></div><div className="payment-options"><label className="payment-option"><input type="radio" name="payment" defaultChecked/><span className="fake-radio"/><span className="payment-title"><b>Credit or debit card</b><small>Visa, Mastercard, Amex</small></span><div className="payment-brands"><b>VISA</b><i>●●</i></div></label><div className="card-fields"><label>Cardholder name<input placeholder="Name on card"/></label><label className="full-field">Card number<div className="input-icon"><CreditCard size={16}/><input placeholder="0000 0000 0000 0000"/></div></label><label>Expiry date<input placeholder="MM / YY"/></label><label>CVC <input placeholder="123"/></label></div><label className="payment-option"><input type="radio" name="payment"/><span className="fake-radio"/><span className="payment-title"><b>Shopcart Card</b><small>Get 5% cash back on this order</small></span><span className="shopcart-card-mini">Shopcart</span></label><label className="payment-option"><input type="radio" name="payment"/><span className="fake-radio"/><span className="payment-title"><b>PayPal</b><small>Fast and secure checkout</small></span><strong className="paypal-word">PayPal</strong></label><label className="payment-option"><input type="radio" name="payment"/><span className="fake-radio"/><span className="payment-title"><b>Cash on delivery</b><small>Pay when your order arrives</small></span></label></div></section>
    </div><aside className="order-summary"><div className="summary-header"><h2>Order summary</h2><span>{items.reduce((n,item)=>n+item.qty,0)} items</span></div><div className="coupon-form"><label htmlFor="coupon">Promo code</label><div><input id="coupon" placeholder="Enter coupon code" value={coupon} onChange={(e)=>setCoupon(e.target.value)}/><button onClick={applyCoupon}>{couponApplied?'Applied':'Apply'}</button></div>{couponApplied && <small className="coupon-success"><CheckCircle2 size={13}/> Welcome! 10% off applied.</small>}</div><div className="summary-items">{items.map(({product,qty})=><div key={product.id}><span>{product.name} <small>× {qty}</small></span><b>{money(product.price*qty)}</b></div>)}</div><div className="summary-row"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="summary-row"><span>Delivery</span><b className={delivery===0?'free-shipping':''}>{delivery===0?'Free':money(delivery)}</b></div>{discount>0&&<div className="summary-row discount-row"><span>Discount</span><b>-{money(discount)}</b></div>}<div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="button button-green pay-button" onClick={onPlaceOrder}>Place order <ArrowRight size={16}/></button><p className="terms-note"><ShieldCheck size={14}/> Your payment details are encrypted and secure.</p><div className="summary-promise"><Truck size={18}/><span><b>Free delivery</b><small>On all orders over $50</small></span></div><div className="summary-promise"><RotateCcw size={18}/><span><b>30-day returns</b><small>Shop with peace of mind</small></span></div></aside></div>
  </main>;
}

function CartDrawer({ items, onClose, onNavigate, onChangeQty, onRemove }) {
  const subtotal = items.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  return <div className="drawer-layer" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><aside className="cart-drawer"><div className="drawer-header"><div><span className="eyebrow">Saved for you</span><h2>Your cart <small>({items.reduce((n,item)=>n+item.qty,0)})</small></h2></div><button onClick={onClose} aria-label="Close cart"><X size={21}/></button></div>{items.length ? <><div className="drawer-items">{items.map(({product,qty})=><div className="drawer-item" key={product.id}><img src={A+product.image} alt={product.name}/><div className="drawer-item-main"><button className="drawer-item-name" onClick={()=>onNavigate('product',product.id)}>{product.name}</button><small>Color: {product.color}</small><div className="drawer-line-bottom"><div className="quantity-control"><button onClick={()=>onChangeQty(product.id,qty-1)}><Minus size={12}/></button><span>{qty}</span><button onClick={()=>onChangeQty(product.id,qty+1)}><Plus size={12}/></button></div><button className="remove-item" onClick={()=>onRemove(product.id)}>Remove</button></div></div><b>{money(product.price*qty)}</b></div>)}</div><div className="drawer-footer"><div className="drawer-subtotal"><span>Subtotal</span><b>{money(subtotal)}</b></div><p>Shipping and taxes calculated at checkout.</p><button className="button button-green" onClick={()=>onNavigate('checkout')}>Go to checkout <ArrowRight size={16}/></button><button className="continue-shopping" onClick={onClose}>Continue shopping</button><div className="drawer-secure"><ShieldCheck size={14}/> Secure checkout <i/> Easy returns</div></div></> : <div className="drawer-empty"><div><ShoppingCart size={24}/></div><h3>Your cart is waiting for a little joy.</h3><p>Discover something lovely and it’ll be right here.</p><button className="button button-green" onClick={()=>onNavigate('listing','Headphones')}>Explore best sellers <ArrowRight size={15}/></button></div>}</aside></div>;
}

function OrderModal({ onClose, onContinue }) {
  return <div className="modal-layer"><div className="order-modal"><button className="modal-close" onClick={onClose}><X size={18}/></button><div className="success-halo"><div><Check size={34}/></div><i/><b/></div><span className="eyebrow">All set</span><h2>Your order has<br/>been accepted</h2><p>Thanks for shopping with us. We’ll send your order details and tracking link by email.</p><div className="order-number">Order number <b>#SC-894294820</b></div><button className="button button-orange" onClick={onContinue}>Continue shopping <ArrowRight size={15}/></button></div></div>;
}

function AccountModal({ onClose }) {
  return <div className="modal-layer" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><div className="account-modal"><button className="modal-close" onClick={onClose}><X size={18}/></button><span className="eyebrow">Welcome back</span><h2>Good to see you.</h2><p>Sign in to see your orders and save your favourites.</p><label>Email address<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="Your password"/></label><button className="button button-green" onClick={onClose}>Sign in <ArrowRight size={15}/></button><div className="account-create">New to Shopcart? <button onClick={onClose}>Create an account</button></div></div></div>;
}

function Footer({ onNavigate }) {
  return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><div onClick={()=>onNavigate('home')}><Logo/></div><p>Good things for the everyday.<br/>A little joy in every delivery.</p><div className="social-links"><button aria-label="Instagram">ig</button><button aria-label="Facebook">f</button><button aria-label="Pinterest">p</button></div></div><div><h3>Shop</h3><button onClick={()=>onNavigate('listing','Headphones')}>Audio & headphones</button><button onClick={()=>onNavigate('listing','Tech')}>Tech & electronics</button><button onClick={()=>onNavigate('listing','Travel')}>Travel essentials</button><button onClick={()=>onNavigate('listing','Headphones')}>Weekly deals</button></div><div><h3>Help & support</h3><a href="#services">Delivery information</a><a href="#services">Returns & refunds</a><a href="#services">Track an order</a><a href="#services">Contact us</a></div><div className="footer-newsletter"><h3>Good news, occasionally.</h3><p>Get thoughtful finds and little surprises in your inbox.</p><form onSubmit={(e)=>{e.preventDefault();e.currentTarget.reset();}}><input type="email" placeholder="Your email address" required/><button aria-label="Subscribe"><ArrowRight size={16}/></button></form><small>By subscribing you agree to our Privacy Policy.</small></div></div><div className="container footer-bottom"><span>© 2024 Shopcart. All rights reserved.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#accessibility">Accessibility</a></div><span className="payment-brands"><b>VISA</b><i>●●</i><b>PayPal</b></span></div></footer>;
}

function App() {
  const [page,setPage] = useState('home');
  const [category,setCategory] = useState('Headphones');
  const [query,setQuery] = useState('');
  const [cartOpen,setCartOpen] = useState(false);
  const [accountOpen,setAccountOpen] = useState(false);
  const [orderOpen,setOrderOpen] = useState(false);
  const [favorites,setFavorites] = useState([]);
  const [cart,setCart] = useState({});
  const [selectedProductId,setSelectedProductId] = useState('airpods');
  const [toast,setToast] = useState('');
  const [coupon,setCoupon] = useState('');
  const [couponApplied,setCouponApplied] = useState(false);
  const cartItems = useMemo(()=>Object.entries(cart).map(([id,qty])=>({product:products.find((item)=>item.id===id),qty})).filter((item)=>item.product),[cart]);
  const cartCount = cartItems.reduce((sum,item)=>sum+item.qty,0);
  const selectedProduct = products.find((item)=>item.id===selectedProductId) || products[1];
  const showToast = (message) => { setToast(message); window.clearTimeout(window.__shopcartToast); window.__shopcartToast=window.setTimeout(()=>setToast(''),2400); };
  const navigate = (next, target) => {
    if (next==='product') { setSelectedProductId(target || 'airpods'); setPage('product'); }
    else if (next==='listing') { setCategory(target || 'Headphones'); setPage('listing'); setQuery(target === 'Search results' ? query : ''); }
    else if (next==='home') { setPage('home'); if (target==='services') setTimeout(()=>document.getElementById('services')?.scrollIntoView({behavior:'smooth'}),80); }
    else setPage(next);
    setCartOpen(false); setAccountOpen(false); window.scrollTo({top:0,behavior:'smooth'});
  };
  const addToCart = (product, quantity=1) => { setCart((current)=>({...current,[product.id]:(current[product.id]||0)+quantity})); showToast(`${product.name} added to your cart`); };
  const changeQty = (id,qty) => setCart((current)=>{ if(qty<1){const next={...current};delete next[id];return next;} return {...current,[id]:qty}; });
  const toggleFavorite = (id) => setFavorites((current)=>current.includes(id)?current.filter((item)=>item!==id):[...current,id]);
  const onNavigate = (next,target) => navigate(next,target);
  return <><Header onNavigate={onNavigate} cartCount={cartCount} onCart={()=>setCartOpen(true)} query={query} setQuery={setQuery} onAccount={()=>setAccountOpen(true)}/>
    {page==='home' && <HomePage onNavigate={onNavigate} onOpen={(id)=>onNavigate('product',id)} onAdd={addToCart} favorites={favorites} onFavorite={toggleFavorite}/>}
    {page==='listing' && <ListingPage onNavigate={onNavigate} onOpen={(id)=>onNavigate('product',id)} onAdd={addToCart} favorites={favorites} onFavorite={toggleFavorite} searchQuery={query} category={category} setCategory={setCategory}/>}
    {page==='product' && <ProductPage key={selectedProduct.id} product={selectedProduct} onNavigate={onNavigate} onAdd={addToCart}/>}
    {page==='checkout' && <CheckoutPage items={cartItems} onChangeQty={changeQty} onNavigate={onNavigate} onPlaceOrder={()=>cartItems.length ? setOrderOpen(true) : showToast('Your cart is empty')} coupon={coupon} setCoupon={setCoupon} couponApplied={couponApplied} applyCoupon={()=>{if(coupon.trim()){setCouponApplied(true);showToast('10% discount applied');}else showToast('Enter a promo code first');}}/>}
    <Footer onNavigate={onNavigate}/>
    {cartOpen&&<CartDrawer items={cartItems} onClose={()=>setCartOpen(false)} onNavigate={onNavigate} onChangeQty={changeQty} onRemove={(id)=>changeQty(id,0)}/>}
    {accountOpen&&<AccountModal onClose={()=>setAccountOpen(false)}/>}
    {orderOpen&&<OrderModal onClose={()=>setOrderOpen(false)} onContinue={()=>{setOrderOpen(false);setCart({});setCouponApplied(false);navigate('home');}}/>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
