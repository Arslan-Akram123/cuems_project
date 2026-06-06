// src/pages/admin/AdminBookingsPage.jsx
import { Link } from 'react-router-dom';
import BookingsTable from '../../components/admin/BookingsTable';
import { FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';


const AdminBookingsPage = () => {
    const [allBookings, setAllBookings] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
  useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/eventsbook/getAllBookings', { credentials: 'include' }).then(res => res.json()).then(data => setAllBookings(data)).catch(err => console.error(err)).finally(hideLoader);
        // console.log("all bookings in admin page", allBookings);
  },[]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className=" text-xl sm:text-3xl font-bold text-gray-800">Bookings</h1>
                <Link
                    to="/admin/bookings/confirmed"
                    className="flex items-center gap-1 sm:gap-2 bg-teal-500 text-white font-bold py-2 px-2 sm:px-4 rounded-lg hover:bg-teal-600 transition-colors"
                >
                    <FiCheckCircle /> Confirm Bookings
                </Link>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Bookings</h2>
            <BookingsTable bookings={allBookings} isloading={isLoading} />
        </div>
    );
};

export default AdminBookingsPage;