import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Cart() {
  const { cart, dispatch } = useCart();
  const total = cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = () => {
    localStorage.removeItem('cart');
    dispatch({ type: 'CLEAR_CART' });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      dispatch({ type: 'TOGGLE_CART' });
    }, 3000);
  };

  if (!cart.showCart) return null;

  return (
    <div className="fixed top-0 right-0 h-full bg-white p-4 shadow-lg w-96 z-50 transition-transform transform translate-x-0">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">🛒 Your Cart</h2>
        <button onClick={() => dispatch({ type: 'TOGGLE_CART' })} className="text-gray-500 hover:text-black">✖️</button>
      </div>
      {showSuccess && (
        <div className="bg-green-100 text-green-700 p-2 mb-2 rounded text-sm text-center">
          ✅ Checkout successful!
        </div>
      )}
      {cart.cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4 max-h-80 overflow-y-auto">
          {cart.cartItems.map(item => (
            <li key={item.id} className="flex gap-3 items-center border-b pb-2">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{item.name}</h4>
                <p className="text-xs text-gray-600">
                  ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => dispatch({ type: 'INCREASE_QUANTITY', payload: item })} className="px-2 py-0.5 bg-green-100 hover:bg-green-200 rounded">+</button>
                  <button onClick={() => dispatch({ type: 'DECREASE_QUANTITY', payload: item })} className="px-2 py-0.5 bg-red-100 hover:bg-red-200 rounded">-</button>
                  <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item })} className="text-red-500 text-xs ml-auto">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold text-right">Total: ${total.toFixed(2)}</div>
      {cart.cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      )}
    </div>
  );
}
