// src/pages/MaintenancePage.jsx
import { FiTool } from 'react-icons/fi';
// import Logo from '../components/Logo';

// This component expects a 'settings' object prop containing the message
const MaintenancePage = ({ settings }) => {
 
    const defaultMessage = "Our site is currently down for maintenance. We'll be back shortly. Thank you for your patience!";
    
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="absolute top-8 left-8">
                {/* <Logo /> */}
                <img src={settings.siteLogo} alt="Site Logo" className="h-28 w-48 object-contain" />
            </div>
            <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-lg max-w-2xl">
                <FiTool className="text-teal-500 mx-auto h-16 w-16" />
                <h1 className="mt-4 text-3xl font-bold text-gray-800">
                    Under Maintenance
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    {/* Use the message from settings, or a default one if it's not provided */}
                    {settings?.siteCloseMessage || defaultMessage}
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;