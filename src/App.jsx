import ProductCard from "./components/ProductCard";
import products from "./data/products";
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
      <path d="M3 4h2l2.4 9.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L17 7H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

function App() {
  const allBrands = [...new Set(products.map((product) => product.brand))];

  const normalizePrice = (value) => {
    const number = Number(String(value).replace(/,/g, "").replace(/[^0-9.-]+/g, ""));
    return Number.isNaN(number) ? 0 : number;
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (!raw) return [];
      const savedItems = JSON.parse(raw);
      return Array.isArray(savedItems)
        ? savedItems.map((item) => ({
            ...item,
            price: normalizePrice(item.price),
            originalPrice: normalizePrice(item.originalPrice),
            quantity: Number(item.quantity) || 1,
          }))
        : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [sortBy, setSortBy] = useState("featured");
  const [theme, setTheme] = useState("dark");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const themeClass = theme === "dark" ? "app dark" : "app light";
  const themeLabel = theme === "dark" ? "☀︎ Light" : "⏾ Dark";

  function addToCart(product) {
    const normalizedProduct = {
      ...product,
      price: normalizePrice(product.price),
      originalPrice: normalizePrice(product.originalPrice),
    };

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === normalizedProduct.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === normalizedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...normalizedProduct, quantity: 1 }];
    });
  }

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function handleRemoveFromCart(item) {
    const moveToWishlist = window.confirm(
      `Move "${item.name}" to wishlist? Click OK to move it to wishlist, or Cancel to remove from cart.`
    );

    if (moveToWishlist) {
      setWishlist((currentWishlist) =>
        currentWishlist.includes(item.id) ? currentWishlist : [...currentWishlist, item.id]
      );
    }

    removeFromCart(item.id);
  }

  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = normalizePrice(item.price);
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);

  function toggleWishlist(productID) {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(productID)
        ? currentWishlist.filter((id) => id !== productID)
        : [...currentWishlist, productID]
    );
  }

  function removeFromWishlist(productID) {
    setWishlist((currentWishlist) => currentWishlist.filter((id) => id !== productID));
  }

  function toggleCartDrawer() {
    setIsCartOpen((currentValue) => !currentValue);
  }

  function closeCartDrawer() {
    setIsCartOpen(false);
  }

  // persist cart and wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      // ignore
    }
  }, [wishlist]);

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "All Brands" || product.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  if (sortBy === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className={themeClass}>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">◆</span>
            TechStore
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Products
              </Link>
            </li>
            <li>
              <a href="#" className="nav-link">
                Deals
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                About
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button
              className={`nav-btn wishlist-nav-btn ${wishlist.length > 0 ? "has-items" : ""}`}
              type="button"
              onClick={() => (window.location.href = "/wishlist")}
              aria-label="Open wishlist"
            >
              <span className={`wish-icon ${wishlist.length > 0 ? "active" : ""}`}>
                {wishlist.length > 0 ? "♥" : "♡"}
              </span>
              <span>{wishlist.length}</span>
            </button>

            <button className="nav-btn cart-btn" type="button" onClick={toggleCartDrawer} aria-label="Open cart">
              <CartIcon /> <span>{cartCount}</span>
            </button>

            <button
              className="nav-btn theme-toggle"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" width="18" height="18" className="theme-icon" aria-hidden="true">
                  <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" className="theme-icon" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button className="nav-btn">Sign In</button>
            <button className="nav-btn primary">Shop Now</button>
          </div>
        </div>
      </nav>

      <div className={`cart-drawer-backdrop ${isCartOpen ? "open" : ""}`} onClick={closeCartDrawer} />
      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <div>
            <p className="drawer-eyebrow">Your bag</p>
            <h3>Shopping cart</h3>
          </div>
          <button className="drawer-close" type="button" onClick={closeCartDrawer}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your cart is currently empty.</p>
            <span>Add a few premium devices to begin.</span>
          </div>
        ) : (
          <div className="cart-drawer-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-drawer-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-drawer-info">
                  <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>
                  </div>
                  <div className="cart-drawer-qty">
                    <button type="button" onClick={() => decreaseQuantity(item.id)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-drawer-footer">
          <div className="drawer-total-row">
            <span>Subtotal</span>
            <strong>₹{cartTotal.toLocaleString()}</strong>
          </div>
          <div className="drawer-actions">
            <Link to="/cart" className="drawer-link" onClick={closeCartDrawer}>
              View full cart
            </Link>
            <button className="drawer-checkout" type="button">
              Checkout
            </button>
          </div>
        </div>
      </aside>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <section className="hero">
                <div className="hero-content">
                  <p className="hero-tag">New Arrivals 2026</p>
                  <h1 className="hero-title">
                    The Future of Tech
                    <br />
                    <span className="hero-highlight">Is Here.</span>
                  </h1>
                  <p className="hero-description">
                    Discover the latest in premium technology. From powerful computers to cutting-edge smartphones, find everything you need in one place.
                  </p>
                  <div className="hero-cta">
                    <button className="btn-primary">Explore Products</button>
                    <button className="btn-secondary">Learn More</button>
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Happy Customers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Premium Products</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Customer Support</span>
                  </div>
                </div>
              </section>

              <section className="products-section" id="products">
                <div className="section-header">
                  <h2 className="section-title">Best Sellers</h2>
                  <p className="section-subtitle">Our most popular products loved by customers</p>
                </div>

                <div className="controls-panel">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />

                  <select
                    className="filter-select"
                    value={selectedBrand}
                    onChange={(event) => setSelectedBrand(event.target.value)}
                  >
                    <option value="All Brands">All Brands</option>
                    {allBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>

                  <select
                    className="filter-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="summary-row">
                  <span>{filteredProducts.length} products shown</span>
                  <span>
                    Cart: {cartCount} item{cartCount === 1 ? "" : "s"} • Total ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="product-grid">
                  {filteredProducts.map((data) => (
                    <ProductCard
                      key={data.id}
                      id={data.id}
                      image={data.image}
                      name={data.name}
                      price={data.price}
                      originalPrice={data.originalPrice}
                      discount={data.discount}
                      rating={data.rating}
                      isBestSeller={data.isBestSeller}
                      onAddToCart={() => addToCart(data)}
                      onToggleWishlist={() => toggleWishlist(data.id)}
                      isWishlisted={wishlist.includes(data.id)}
                    />
                  ))}
                </div>
              </section>
            </>
          }
        />

        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlist={wishlist}
              products={products}
              onRemoveWishlist={removeFromWishlist}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onRemoveItem={handleRemoveFromCart}
            />
          }
        />
      </Routes>

      <footer className="footer">
        <p>&copy; 2027 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
