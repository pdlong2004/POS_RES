import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const CART_KEY_PREFIX = 'cart_';

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD':
            return action.payload || [];
        case 'ADD': {
            const { product, quantity } = action.payload;
            const existing = state.find((i) => i.product._id === product._id);
            if (existing) {
                return state.map((i) =>
                    i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i,
                );
            }
            return [...state, { product, quantity }];
        }
        case 'UPDATE':
            return state.map((i) =>
                i.product._id === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i,
            );
        case 'REMOVE':
            return state.filter((i) => i.product._id !== action.payload.productId);
        case 'CLEAR':
            return [];
        default:
            return state;
    }
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, []);
    useLocation(); // Re-render khi đổi route (sau khi đăng nhập bàn → /menu) để đọc lại tableInfo

    const tableInfo = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tableInfo') || 'null') : null;
    const tableId = tableInfo?._id;

    // Load cart from localStorage when tableId changes
    useEffect(() => {
        if (!tableId) {
            dispatch({ type: 'CLEAR' });
            return;
        }
        try {
            const raw = localStorage.getItem(CART_KEY_PREFIX + tableId);
            const saved = raw ? JSON.parse(raw) : [];
            dispatch({ type: 'LOAD', payload: saved });
        } catch {
            dispatch({ type: 'CLEAR' });
        }
    }, [tableId]);

    // Persist cart to localStorage when items change
    useEffect(() => {
        if (!tableId || items.length === 0) {
            if (tableId) localStorage.setItem(CART_KEY_PREFIX + tableId, JSON.stringify(items));
            return;
        }
        localStorage.setItem(CART_KEY_PREFIX + tableId, JSON.stringify(items));
    }, [tableId, items]);

    const addItem = useCallback((product, quantity = 1) => {
        dispatch({ type: 'ADD', payload: { product, quantity } });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) dispatch({ type: 'REMOVE', payload: { productId } });
        else dispatch({ type: 'UPDATE', payload: { productId, quantity } });
    }, []);

    const removeItem = useCallback((productId) => {
        dispatch({ type: 'REMOVE', payload: { productId } });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR' });
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const value = {
        items,
        totalItems,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isTableLogin: !!tableId,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
