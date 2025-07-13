import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-1 truncate">{product.title}</h3>

      <p className="text-gray-600 text-sm mb-2 overflow-hidden" style={{ maxHeight: '3.6em', lineHeight: '1.2em' }}>
        {product.description}
      </p>

      <p className="text-green-600 font-bold mb-4">${product.price}</p>

      <button
        onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
      >
        Add to Cart
      </button>
    </div>
  );
}
