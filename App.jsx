import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* HEADER*/}
      <header className="header">
        <div className="logo">SPORTON</div>
        <nav className="nav">
          <span className="active">Home</span>
          <span>Category</span>
          <span>Explore Products</span>
        </nav>
        <div className="header-extra">
          <span>🔍</span>
          <span className="cart-icon">🛒<small>3</small></span>
        </div>
      </header>

      {/* HERO SECTION*/}
      <main className="hero">
        <div className="hero-content">
          <p className="sale-tag">Friday Sale 50%</p>
          <h1>WEAR YOUR <br /> TOP-QUALITY <br /> SPORTSWEAR</h1>
          <p className="description">
            Engineered for endurance and designed for speed. Experience gear 
            that moves as fast as you do. Premium fabrics. Unmatched comfort. 
            Limitless motion.
          </p>
          <div className="cta-container">
            <button className="btn-primary">Explore More <span>»</span></button>
            <button className="btn-secondary">Watch Video <span>▶</span></button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Hero Shoes" />
        </div>
      </main>

      {/* CATEGORIES SECTION*/}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse By Categories</h2>
          <span className="see-all">See All Categories →</span>
        </div>
        <div className="category-grid">
          {['Running', 'Tennis', 'Basketball', 'Football', 'Badminton', 'Swimming'].map((item) => (
            <div key={item} className="category-card">
              <div className="cat-icon">👟</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PRODUCT SECTION */}
      <section className="products-section">
        <h2 className="center-title">OUR PRODUCTS</h2>
        <div className="product-grid">
          <ProductCard 
            img="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            name="SportsOn Hyperfast Shoes" 
            category="Running" 
            price="Rp. 329.000" 
          />
          <ProductCard 
            img="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
            name="SportsOn Rockets Tennis" 
            category="Tennis" 
            price="Rp. 999.000" 
          />
          <ProductCard 
            img="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            name="SportsOn Slowlivin" 
            category="Running" 
            price="Rp. 119.000" 
          />
          <ProductCard 
            img="https://images.unsplash.com/photo-1543353071-873f17a7a088"
            name="SportsOn HyperSoccer v2" 
            category="Football" 
            price="Rp. 458.000" 
          />
        </div>
      </section>

      {/* FOOTER*/}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-info">
            <h3 className="logo">SPORTON</h3>
            <p>Engineered for endurance and designed for speed. Experience gear that moves as fast as you do.</p>
          </div>
          <div className="footer-links">
             <div className="col">
               <h4>Quick Links</h4>
               <p>Home</p>
               <p>Categories</p>
             </div>
             <div className="col">
               <h4>Social</h4>
               <p>Instagram</p>
               <p>Facebook</p>
             </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>SportsOn© 2025 All Rights Reserved.</p>
          <div className="footer-legal">
            <span>Privacy Policy</span>
            <span>Terms Conditions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// REUSABLE COMPONENT
function ProductCard({ img, name, category, price }) {
  return (
    <div className="product-card">
      <div className="product-thumb">
        <img src={img} alt={name} />
        <button className="add-btn">+</button>
      </div>
      <div className="product-info">
        <h4>{name}</h4>
        <p className="prod-cat">{category}</p>
        <p className="prod-price">{price}</p>
      </div>
    </div>
  );
}

export default App;