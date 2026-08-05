import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function WishlistPage({ wishlist, products, onRemoveWishlist, onToggleWishlist, onAddToCart }) {
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2>Wishlist</h2>
        <Link to="/" className="page-link">
          Back to shop
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <p className="page-empty">No wishlist items yet.</p>
      ) : (
        <div className="product-grid page-grid">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              rating={product.rating}
              isBestSeller={product.isBestSeller}
              onAddToCart={() => onAddToCart(product)}
              onToggleWishlist={() => onToggleWishlist(product.id)}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
