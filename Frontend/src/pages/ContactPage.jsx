import UserLayout from '../components/UserLayout';
import { useState } from 'react';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
import { Link } from 'react-router-dom';
const ContactPage = () => {
    const {showLoader, hideLoader,isLoading} = useLoader();
      const {showToast} = useToast();
    const [contactData, setContactData] = useState({  
        message: ''
    });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        try {
            const response = await fetch('http://localhost:8001/contactus/createContactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(contactData)
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                setContactData({ message: '' });
            } else {
                showToast(result.message || 'Failed to send message.', 'error');
            }
        } catch (error) {
            showToast('Network error. Try again.', 'error');
        } finally {
            hideLoader();
        }
    }

    return (
        <UserLayout>
              <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Contact Us</p>
                </div>
            <div className="container mx-auto px-4 py-16 ">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Have a question or want to partner with us? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </div>
                <form className="mt-12 max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleContactSubmit}>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            name='message'
                            rows={5}
                            required
                            className="mt-1 w-full border border-teal-300 rounded-md shadow-sm px-2 py-2 focus:outline-teal-500"
                            placeholder="Type your message here..."
                            value={contactData.message}
                            onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700">
                           {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" /> Sending... </span>):(<span> Send Message</span>)}
                        </button>
                    </div>
                   
                </form>
            </div>
        </UserLayout>
    );
};

export default ContactPage;