import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const TOAST_DURATION = 3500;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toastHelper = {
        success: (msg) => showToast(msg, 'success'),
        error: (msg) => showToast(msg, 'error'),
        warning: (msg) => showToast(msg, 'warning'),
        info: (msg) => showToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={{ showToast, toast: toastHelper }}>
            {children}
            <div className="fixed bottom-4 right-4 z-999 flex flex-col gap-2 pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto">
                    {toasts.map((t) => (
                        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ id, message, type, onClose }) {
    const styles = {
        success: 'bg-emerald-600 text-white border-emerald-700',
        error: 'bg-red-600 text-white border-red-700',
        warning: 'bg-yellow-500 text-white border-yellow-600',
        info: 'bg-[#F89520] text-white border-orange-600',
    };
    return (
        <div
            role="alert"
            className={`min-w-70 max-w-md px-4 py-3 rounded-xl shadow-lg border ${styles[type] || styles.info} animate-slideIn`}
        >
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

