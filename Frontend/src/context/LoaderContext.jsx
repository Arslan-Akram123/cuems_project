// src/context/LoaderContext.jsx
import { createContext, useState, useContext } from 'react';
import Loader from '../components/Loader';
const LoaderContext = createContext();
export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);
    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};
export const useLoader = () => {
    return useContext(LoaderContext);
};