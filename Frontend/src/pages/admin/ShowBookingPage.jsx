// src/pages/admin/ShowBookingPage.jsx
import { Link, useParams } from 'react-router-dom';
import { FiCheck, FiX, FiChevronLeft } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
// Reusable component for displaying a read-only field
const InfoField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md">{value || '---'}</div>
    </div>
);

const ShowBookingPage = () => {
   const { bookingId } = useParams();
   const [booking, setBooking] = useState([]);
   const navigate = useNavigate();
   const {showToast} = useToast();
   const {showLoader, hideLoader,isLoading} = useLoader();
   const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch(`http://localhost:8001/eventsbook/getBooking/${bookingId}`,
             { credentials: 'include' }
            ).then(res => res.json())
            .then(data => setBooking(data))
            .catch(err => console.error(err));
    }, []);

    const handleConfirmBooking = (bookingId) => {
        showLoader();
        fetch(`http://localhost:8001/eventsbook/confirmBooking/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showToast(data.error, 'error');
            } else {
                showToast('Booking confirmed successfully.', 'success');
                setTimeout(() => {
                    navigate('/admin/bookings');
                }, 1500);
            }
        })
        .catch(err => {
            showToast('Error confirming booking.', 'error');
        }).finally(() => {
            hideLoader();
        });
    }

    const handleCancelBooking = (bookingId) => {
        setLoading(true);
        fetch(`http://localhost:8001/eventsbook/cancelBooking/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showToast(data.error, 'error');
            } else {
                showToast('Booking cancelled successfully.', 'success');
                setTimeout(() => {
                    navigate('/admin/bookings');
                }, 1500);
            }
        })
        .catch(err => {
            showToast('Error cancelling booking.', 'error');
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div>
          
            <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Show Booking</h1>
                <div className="flex justify-center md:justify-end flex-wrap gap-4 flex-grow">
                    <button onClick={() => handleConfirmBooking(bookingId)} className="flex items-center gap-2  bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600"
                    {...booking?.status === 'paid' || booking?.status === 'confirmed' ? { disabled: true, className: 'flex items-center gap-2 bg-gray-400 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed' } : {} }
                        ><FiCheck /> {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Confirming... </span>):(<span>Confirm</span>)}
                        </button>
                    <button onClick={() => handleCancelBooking(bookingId)} className="flex items-center gap-2 bg-red-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-800"
                    {...booking?.status === 'cancelled' || booking?.status === 'paid' ? { disabled: true, className: 'flex items-center gap-2 bg-gray-400 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed' } : {} }><FiX />{loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Cancelling... </span>):(<span> Cancel</span>)}</button>
                    <Link to="/admin/bookings" className="flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500"><FiChevronLeft /> Back</Link>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md space-y-8">
                {/* Booking Info */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Booking Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InfoField label="Booking No" value={bookingId} />
                        {/* <InfoField label="Total Subscribers" value={booking.subscribers} /> */}
                        <InfoField label="Status" value={booking?.status} />
                        <div className="md:col-span-3">
                            <InfoField label="Notes" value={booking?.bookingNotes} />
                        </div>
                    </div>
                </section>
                
                {/* Member Info */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Member Information</h2>
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        <div className="flex flex-col items-center">
                            <img src={booking?.user?.profileImageURL} alt="Member" className="h-48 w-48 rounded-full object-cover bg-gray-200" />
                            {/* <label className="mt-2 text-sm font-medium text-gray-700">Image</label> */}
                        </div>
                        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                            <InfoField label="Name" value={booking?.user?.fullName} />
                            <InfoField label="Email" value={booking?.user?.email} />
                            <InfoField label="Role" value={booking?.user?.role} />
                            {/* Add other member fields if necessary */}
                        </div>
                    </div>
                </section>
                
                {/* Event Info */}
                 <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Event Information</h2>
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        <div className="flex flex-col items-center">
                            <img src={booking?.event?.image} alt="Event" className="h-60 w-60 object-contain bg-gray-100 p-2 rounded-md" />
                            {/* <label className="mt-2 text-sm font-medium text-gray-700">Image</label> */}
                        </div>
                         <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                            <InfoField label="Title" value={booking?.event?.name} />
                            <InfoField label="Category" value={booking?.event?.category} />
                            {/* <InfoField label="Sponsors" value={booking.event.sponsors} /> */}
                            <InfoField label="Location" value={booking?.event?.location} />
                            <InfoField label="Price" value={`$${booking?.event?.price}`} />
                            <InfoField label="Total Subscribers" value={
                [booking?.event?.totalSubscribers, booking?.event?.bookings, booking?.event?.reservedSeats]
                  .map(x => Number(x) || 0)
                  .reduce((a, b) => a + b, 0)
              } />
                         </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ShowBookingPage;