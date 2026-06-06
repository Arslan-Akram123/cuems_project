// src/pages/admin/AdminPaymentsPage.jsx
import { useState,useEffect } from 'react';
import { FiDollarSign, FiSearch } from 'react-icons/fi';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';

const AdminPaymentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mockPayments, setMockPayments] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
useEffect(()=>{
    showLoader();
     fetch('http://localhost:8001/stripe/getAllPayments', { credentials: 'include' }).then(res => res.json()).then(data => setMockPayments(data)).catch(err => console.error(err)).finally(hideLoader);
},[])
    const filteredPayments = mockPayments.filter(payment =>
        payment.user.fullName.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        payment.event.name.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FiDollarSign /> Payments
            </h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Payment Information</h2>
                    <div className="relative w-full md:w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, or event..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">User Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Event End Date</th>
                                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {
                                isLoading? <tr><td colSpan="7" className="py-4 px-4 text-center text-gray-500"><Loader /></td></tr>:
                            filteredPayments.length>0?filteredPayments.map((payment) => (
                                <tr key={payment?._id}>
                                    <td className="py-4 px-4 font-semibold">{payment?.user?.fullName}</td>
                                    <td className="py-4 px-4">{payment?.user?.email}</td>
                                    <td className="py-4 px-4">{payment?.event?.name}</td>
                                    <td className="py-4 px-4">{new Date(payment?.event?.endDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 ">{payment?.amount?.toFixed(2)}</td>
                                </tr>
                            )):
                        <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No bookings available</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentsPage;