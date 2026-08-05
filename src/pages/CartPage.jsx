import { Link } from "react-router-dom";

function CartPage({ cartItems, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) {
  const normalizePrice = (value) => {
    const raw = String(value || "").replace(/,/g, "").replace(/[^0-9.-]+/g, "");
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = normalizePrice(item.price);
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);
  const shipping = cartItems.length > 0 ? 499 : 0;
  const total = subtotal + shipping;

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2>Cart</h2>
        <Link to="/" className="page-link">
          Back to shop
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <p className="page-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price} each</p>
                </div>
                <div className="cart-controls">
                  <button onClick={() => onDecreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onIncreaseQuantity(item.id)}>+</button>
                </div>
                <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                <button className="remove-btn" onClick={() => onRemoveItem(item)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString()}</strong>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <strong>{shipping > 0 ? `₹${shipping.toLocaleString()}` : "Free"}</strong>
              </div>
              <div className="summary-line total-line">
                <span>Total</span>
                <strong>₹{total.toLocaleString()}</strong>
              </div>
            </div>
            <button className="checkout-btn" type="button">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
