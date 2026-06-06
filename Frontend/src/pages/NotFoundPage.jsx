// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
// import Logo from '../components/Logo'; 
import { useProfile } from '../context/ProfileContext/ProfileContext';
const NotFoundPage = () => {
    const { siteSetting } = useProfile();
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="absolute top-8 left-8">
                {/* <Logo /> */}
                {/* <img src={`/uploads/siteSettings/${siteSetting.siteLogo}`} alt="Site Logo" className="h-28 w-48 object-contain" /> */}
            </div>
            <div className="text-center">
                <FiAlertTriangle className="text-yellow-400 mx-auto h-24 w-24" />
                <h1 className="mt-4 text-6xl font-bold text-gray-800">404</h1>
                <p className="mt-2 text-2xl font-semibold text-gray-600">Page Not Found</p>
                <p className="mt-4 text-gray-500">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/" // The root path will intelligently redirect to the correct dashboard
                    className="mt-8 inline-flex items-center gap-2 bg-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-105"
                >
                    <FiHome />
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;