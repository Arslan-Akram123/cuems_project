// src/pages/FaqPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
const FaqItem = ({ question, answer }) => (
    <div className="py-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">{question}</h3>
        <p className="mt-2 text-gray-600">{answer}</p>
    </div>
);

const FaqPage = () => {
    return (
        <UserLayout>
             <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / FAQs</p>
                </div>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
                        <p className="mt-2 text-lg text-gray-500">Find answers to the most common questions about EventOps Hub.</p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <FaqItem
                            question="What is EventOps Hub?"
                            answer="EventOps Hub is a centralized platform for discovering, managing, and booking events across multiple universities. It connects students and administrators in one unified ecosystem."
                        />
                        <FaqItem
                            question="How do I book an event?"
                            answer="Once you are logged in, navigate to the event you are interested in and click the 'Book Now' button. If the event has a price, you will be guided through the payment process."
                        />
                        <FaqItem
                            question="Can I see my booking history?"
                            answer="Yes! Click on your user icon in the top-right corner and select 'Booking' from the dropdown menu to view all your past and upcoming bookings."
                        />
                         <FaqItem
                            question="Who can I contact for support?"
                            answer="For any issues or questions, please navigate to our Support page using the link in the footer. We're happy to help!"
                        />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default FaqPage;