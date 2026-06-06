// src/pages/TermsPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-4 text-gray-600">{children}</div>
    </div>
);

const TermsPage = () => {
    return (
        <UserLayout>
             <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Terms of Service</p>
                </div>
            <div className="container mx-auto px-4 py-16 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Terms of Service</h1>
                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using the EventOps Hub platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                    </Section>
                    <Section title="2. User Accounts">
                        <p>You are responsible for safeguarding your account information. You agree to provide accurate and complete information when creating an account and to update your information to keep it current.</p>
                    </Section>
                    <Section title="3. Event Bookings and Payments">
                        <p>All payments for events are processed through our third-party payment gateways. EventOps Hub is not responsible for any issues arising from the payment process. Refunds and cancellations are subject to the policy of the individual event organizer.</p>
                    </Section>
                </div>
            </div>
        </UserLayout>
    );
};

export default TermsPage;