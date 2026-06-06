// src/context/ToastContext.jsx
import { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/Toast';

// 1. Create the context
const ToastContext = createContext();

// 2. Create the provider component
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    // The function to show the toast
    // useCallback ensures the function isn't recreated on every render
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Function to close the toast, passed to the Toast component
    const closeToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {/* If there is a toast, render the Toast component */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
            {children}
        </ToastContext.Provider>
    );
};

// 3. Create a custom hook for easy access
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};