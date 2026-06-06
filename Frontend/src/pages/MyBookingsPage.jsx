// src/pages/MyBookingsPage.jsx
import { Link, useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { FiChevronLeft, FiSearch, FiBookOpen,FiDownload } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { generateInvoice } from '../utils/generateInvoice'; // Import the utility function
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';
const MyBookingsPage = () => {
    const [userBookings, setUserBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const { bookingid } = location.state || {};
    const [highlightedId, setHighlightedId] = useState(bookingid || null);
    const {showLoader, hideLoader,isLoading} = useLoader();
    const handleDownloadInvoice = (booking) => {
       generateInvoice(booking);
    };
    
    useEffect(() => {
        if (!highlightedId) return;
        const handleClick = () => setHighlightedId(null);
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [highlightedId]);

    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/eventsbook/getAllUserBookings', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserBookings(data))
            .catch(err => console.error(err)).finally(hideLoader);
    }, [])


    return (
        <UserLayout>
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FiBookOpen /> My Bookings
                    </h1>
                    <Link
                        to="/home" // Link back to the user dashboard
                        className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                        <FiChevronLeft /> Back
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Total Bookings</h2>
                        <div className="relative w-full md:w-1/3">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search by Event Name..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Table or No Data Message */}
                    <div className="overflow-x-auto">
                        {
                            (() => {
                                const filtered = userBookings
                                    .sort((a, b) => new Date(b.event.endDate) - new Date(a.event.endDate))
                                    .filter(b =>
                                        searchTerm === '' || b.event.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    );
                                return isLoading ?<div className='text-center py-4'><Loader /></div> : filtered.length > 0 ? (
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                            {isLoading ?<tr><td colSpan="6" className='text-center py-4'><Loader /></td></tr> :filtered.map((booking) => (
                                                <tr key={booking._id}
                                                    className={highlightedId === booking._id ? 'bg-yellow-100 transition-colors' : ''}
                                                >
                                                    <td className="py-4 px-4 font-semibold">
                                                        <Link to={`/events/${booking.event._id}`} className="text-teal-600 hover:underline">
                                                            {booking.event.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-4 px-4">{booking.user.fullName}</td>
                                                    <td className="py-4 px-4">{
                                                        booking.event.endDate && !isNaN(new Date(booking.event.endDate).getTime())
                                                            ? new Date(booking.event.endDate).toLocaleDateString()
                                                            : ''
                                                    }</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                            booking.status === 'paid' ? 'bg-teal-400 text-teal-800':'bg-gray-100 text-gray-800'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {(() => {
                                                           
                                                            let isPast = false;
                                                            if (booking.event.endDate && booking.event.endTime) {
                                                                const endDate = new Date(booking.event.endDate);
                                                                const [endHour = '00', endMinute = '00'] = (booking.event.endTime || '').split(':');
                                                                endDate.setHours(Number(endHour), Number(endMinute), 0, 0);
                                                                isPast = endDate.getTime() < Date.now();
                                                            }
                                                            const disabled = booking.status === 'cancelled' || booking.status === 'pending' || booking.status === 'paid'|| booking.event.price === 0 || isPast;
                                                            return (
                                                                <Link
                                                                    to="/checkout"
                                                                   
                                                                    state={{ booking: booking }}
                                                                    
                                                                    className={`px-2 py-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800 ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-green-200'}`}
                                                                    // Prevent click event if disabled
                                                                    onClick={(e) => disabled && e.preventDefault()}
                                                                >
                                                                    Add Payment
                                                                </Link>
                                                            );

                                                        })()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {booking.status === 'paid' || booking.status === 'confirmed' && booking.event.price===0 ? (
                                                            <button
                                                                className="px-2 py-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-teal-500 text-white hover:bg-teal-600"
                                                                onClick={() => handleDownloadInvoice(booking)}
                                                            >
                                                                <FiDownload  className='text-xl font-bold'/> 
                                                                {/* Download */}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="px-2 py-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                <FiDownload  className='text-xl font-bold'/>
                                                                {/* Download */}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-red-500 font-semibold">No Booking Data Available</p>
                                    </div>
                                );
                            })()
                        }
                    </div>


                </div>
            </div>
        </UserLayout>
    );
};

export default MyBookingsPage;