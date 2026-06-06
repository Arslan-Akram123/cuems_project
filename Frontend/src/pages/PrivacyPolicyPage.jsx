// src/pages/PrivacyPolicyPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-4 text-gray-600">{children}</div>
    </div>
);

const PrivacyPolicyPage = () => {
    return (
        <UserLayout>
              <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Privacy Policy</p>
                </div>
            <div className="container mx-auto px-4 py-16 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Privacy Policy</h1>
                    <Section title="Information We Collect">
                        <p>We collect information you provide directly to us, such as when you create an account, book an event, or contact us for support. This may include your name, email address, and booking details.</p>
                    </Section>
                    <Section title="How We Use Your Information">
                        <p>We use the information we collect to operate, maintain, and provide the features and functionality of the EventOps Hub platform, including processing your bookings and communicating with you about events.</p>
                    </Section>
                </div>
            </div>
        </UserLayout>
    );
};

export default PrivacyPolicyPage;