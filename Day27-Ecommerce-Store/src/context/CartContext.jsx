import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cart')) || [],
  showCart: false,
};

function cartReducer(state, action) {
  let updatedCart;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.cartItems.find(item => item.id === action.payload.id);
      updatedCart = exists
        ? state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.cartItems, { ...action.payload, quantity: 1 }];
      break;
    }
    case 'REMOVE_FROM_CART': {
      updatedCart = state.cartItems.filter(item => item.id !== action.payload.id);
      break;
    }
    case 'INCREASE_QUANTITY': {
      updatedCart = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;
    }
    case 'DECREASE_QUANTITY': {
      updatedCart = state.cartItems
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
      break;
    }
    case 'TOGGLE_CART':
      return {
        ...state,
        showCart: !state.showCart,
      };
    case 'CLEAR_CART':
      updatedCart = [];
      break;
    default:
      updatedCart = state.cartItems;
  }

  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return { ...state, cartItems: updatedCart };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart: state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ THIS LINE IS REQUIRED
export const useCart = () => useContext(CartContext);
