// src/components/Toast.jsx
import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'; // Add more icons for flexibility

const Toast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 1500); // The duration is 1 seconds
        return () => clearTimeout(timer);
    }, [message, type, onClose]);

    // Expanded config for more toast types and better styling
    const config = {
        success: {
            icon: <FiCheckCircle className="h-6 w-6 text-green-500" />,
            barColor: 'bg-green-500',
        },
        error: {
            icon: <FiXCircle className="h-6 w-6 text-red-500" />,
            barColor: 'bg-red-500',
        },
        info: {
            icon: <FiInfo className="h-6 w-6 text-blue-500" />,
            barColor: 'bg-blue-500',
        },
        warning: {
            icon: <FiAlertTriangle className="h-6 w-6 text-yellow-500" />,
            barColor: 'bg-yellow-500',
        },
    };

    // Use a fallback if an invalid type is passed
    const toastConfig = config[type] || config.info;

    return (
        <div
            className={`
                fixed top-5 right-5 z-50 w-full max-w-sm overflow-hidden
                bg-white p-4 rounded-lg shadow-lg 
                transform transition-all duration-300 ease-in-out
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {toastConfig.icon}
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{message}</p>
                </div>
            </div>
            
            {/* --- THIS IS THE NEW PROGRESS BAR --- */}
            <div
                className={`absolute bottom-0 left-0 h-1 ${toastConfig.barColor}`}
                // The animation will run for 3s, matching our setTimeout duration
                style={{ animation: 'shrink-width 1.5s linear forwards' }} 
            ></div>
        </div>
    );
};

export default Toast;