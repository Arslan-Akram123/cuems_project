// src/pages/SupportPage.jsx
import UserLayout from '../components/UserLayout';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useProfile } from '../context/ProfileContext/ProfileContext';
import { Link } from 'react-router-dom';
const SupportPage = () => {
    const { siteSetting } = useProfile();
    return (
         <UserLayout>
              <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Support</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Support</p>
                </div>
            <div className="container mx-auto px-4 py-16 bg-white">
                 <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        We're here to help! If you encounter any issues or have questions about our platform, please don't hesitate to reach out.
                    </p>
                </div>

                <div className="mt-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-start gap-4">
                        <FiMail className="h-8 w-8 text-teal-500 mt-1"/>
                        <div>
                            <h3 className="text-xl font-semibold">Email Support</h3>
                            <p className="text-gray-600 mt-1">For general inquiries and support, please email us.</p>
                            <a href="mailto:support@eventopshub.com" className="text-teal-600 font-bold hover:underline">{siteSetting?.siteEmail}</a>
                        </div>
                    </div>
                     <div className="mt-8 flex items-start gap-4">
                        <FiPhone className="h-8 w-8 text-teal-500 mt-1"/>
                        <div>
                            <h3 className="text-xl font-semibold">Phone Support</h3>
                            <p className="text-gray-600 mt-1">Our support team is available from 9 AM to 5 PM (PKT).</p>
                            <p className="text-gray-800 font-bold">{siteSetting?.sitePhone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default SupportPage;