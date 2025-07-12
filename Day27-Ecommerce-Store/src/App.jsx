import { CartProvider, useCart } from './context/CartContext';
import { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { useState } from 'react';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ onSearch, onCategoryChange }) {
  const { dispatch, cart } = useCart();
  const itemCount = cart.cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-extrabold text-green-700 tracking-tight">🛍️ Shopping Cart</h1>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full md:w-64 border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition-all duration-200"
          >
            View Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-green-600 text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] text-center shadow">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </header>
  );
}

function Main({ filteredProducts, loading, error }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-600">⚠️ Failed to load products.</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const endpoint = category
          ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
          : 'https://fakestoreapi.com/products';
        const res = await fetch(endpoint);
        const data = await res.json();
        setProducts(data);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CartProvider>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        <Header onSearch={setSearchTerm} onCategoryChange={setCategory} />
        <Main filteredProducts={filteredProducts} loading={loading} error={error} />
        <Cart />
      </div>
    </CartProvider>
  );
}
