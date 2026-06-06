// src/pages/admin/ConfirmBookingsPage.jsx
import { Link } from 'react-router-dom';
import BookingsTable from '../../components/admin/BookingsTable';
import { FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';

const ConfirmBookingsPage = () => {
     const [allBookings, setAllBookings] = useState([]);
     const {showLoader, hideLoader,isLoading} = useLoader();
      useEffect(() => {
            showLoader();
            fetch('http://localhost:8001/eventsbook/getAllBookings', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setAllBookings(data);
                
            })
            .catch(err => console.error(err)).finally(hideLoader);
      },[]);

    const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiCheckCircle /> Confirm Bookings
                </h1>
                <Link
                    to="/admin/bookings"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm_Bookings</h2>
            {/* We pass the filtered list to our reusable table component */}
            <BookingsTable bookings={confirmedBookings} showSearch={true} isloading={isLoading} />
        </div>
    );
};

export default ConfirmBookingsPage;