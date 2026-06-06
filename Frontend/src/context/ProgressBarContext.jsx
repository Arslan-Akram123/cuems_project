// src/context/ProgressBarContext.jsx
import { createContext, useState, useContext, useCallback } from 'react';
import TopProgressBar from '../components/TopProgressBar';

const ProgressBarContext = createContext();

export const ProgressBarProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);

    const start = useCallback(() => {
        setIsActive(true);
    }, []);

    const finish = useCallback(() => {
        setIsActive(false);
    }, []);

    return (
        <ProgressBarContext.Provider value={{ start, finish, isActive }}>
            <TopProgressBar isActive={isActive} />
            {children}
        </ProgressBarContext.Provider>
    );
};

export const useProgressBar = () => {
    return useContext(ProgressBarContext);
};