// src/components/BookingModal.jsx
import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
const BookingModal = ({ eventName, isOpen, onClose, onSubmit,isloading }) => {
    // State for the form inputs, internal to this component
    // const [subscribers, setSubscribers] = useState(1);
    const [notes, setNotes] = useState('');

    // If the modal isn't open, render nothing
    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the collected data up to the parent component
        
        onSubmit({  notes,setNotes });
    };

    return (
        // Main overlay
        <>
        <div 
            className="fixed inset-0 bg-[#A9D6D5] opacity-90 flex items-center justify-center z-40"
            onClick={onClose} 
        >
       </div>
            {/* Modal Content */}
            <div 
                className="bg-white p-8 in rounded-lg shadow-xl w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
            >
                <div className="flex items-center gap-3 mb-8">
                    <FiCheckCircle className="text-teal-500 h-10 w-10" />
                    <h2 className="text-3xl font-bold text-gray-800">Event Booking</h2>
                </div>
               
                <p className="mb-6 text-gray-600">You are booking for: <span className="font-semibold">{eventName}</span></p>
                <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="bookingNotes" className="block text-sm font-medium text-gray-700 mb-2">Booking Notes:</label>
                            <textarea
                                id="bookingNotes"
                                name='bookingNotes'
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                required
                                placeholder="Any special requests or notes..."
                                className="mt-1 px-1 py-1 w-full border border-teal-300 rounded-md shadow-sm focus:border-teal-500 focus:outline-teal-500 focus:ring-teal-500"
                            ></textarea>
                        </div>
                    <div className="mt-8 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
                            Close
                        </button>
                        <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600">
                            {isloading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Booking... </span>):(<span>Book Now</span>)}
                        </button>
                    </div>
                </form>
            </div>
        {/* </div> */}
        </>
    );
};

export default BookingModal;