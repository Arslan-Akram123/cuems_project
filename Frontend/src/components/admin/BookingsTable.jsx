// src/components/admin/BookingsTable.jsx
import { FiEye, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../Loader';
const BookingsTable = ({ bookings, isloading,showSearch = true }) => {
    console.log("bookings in table", bookings);
    const [searchTerm, setSearchTerm] = useState("");
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {showSearch && (
                <div className="flex justify-end mb-4">
                    <div className="relative w-full md:w-1/2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by Booking ID, Username, or Event Name..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Booking No</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                            {/* <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Total Subscribers</th> */}
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Manage</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        { isloading ? (<tr>
                            <td colSpan="7" className="py-4 px-4 text-center"><Loader /></td>
                            </tr>) :
                            (() => {
                                const filtered = bookings
                                    .filter(b => b.status !== 'pending')
                                    .filter(b => {
                                        const idMatch = b._id.toLowerCase().includes(searchTerm.toLowerCase());
                                        const userMatch = b.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
                                        const eventMatch = b.event.name.toLowerCase().includes(searchTerm.toLowerCase());
                                        return (
                                            searchTerm === '' || idMatch || userMatch || eventMatch
                                        );
                                    });
                                return filtered.length > 0 ? (
                                    filtered.map((booking, index) => (
                                        <tr key={booking._id}>
                                            <td className="py-4 px-4">{index + 1}</td>
                                            <td className="py-4 px-4 font-mono">{booking._id}</td>
                                            <td className="py-4 px-4">{booking.user?.fullName}</td>
                                            <td className="py-4 px-4">{booking.event?.name}</td>
                                            {/* <td className="py-4 px-4 text-center">{booking.subscribers}</td> */}
                                            <td className="py-4 px-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--'}</td>
                                            <td className="py-4 px-4">
                                                <Link to={`/admin/bookings/show/${booking._id}`} className="bg-teal-500 text-white flex items-center gap-2 py-1 px-3 rounded-md hover:bg-teal-600">
                                                    <FiEye /> Show
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No bookings available</td>
                                    </tr>
                                );
                            })()
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-between items-center mt-4 text-sm">
                <p className="text-gray-600">Showing 1 to {bookings.length} of {bookings.length} entries</p>
                <div className="flex items-center">
                    <button className="px-3 py-1 border rounded-l-md bg-white hover:bg-gray-50">«</button>
                    <button className="px-3 py-1 border-t border-b bg-teal-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded-r-md bg-white hover:bg-gray-50">»</button>
                </div>
            </div> */}
        </div>
    );
};

export default BookingsTable;