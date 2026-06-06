// src/pages/admin/ViewUniversityAdminsPage.jsx
import { useState, useEffect } from 'react'; // 1. Import hooks
import { Link } from 'react-router-dom';
import { FiPlus, FiUserCheck, FiEdit, FiLoader, FiAlertCircle } from 'react-icons/fi';

const ViewUniversityAdminsPage = () => {
    // 2. Define states
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Fetch data using useEffect and fetch
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch('http://localhost:8001/settings/getAllSubAdminsWithWallet',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Fetched Admins:", data);
                setAdmins(data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    // 4. Loading & Error States
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-teal-600">
            <FiLoader className="animate-spin text-4xl mb-2" />
            <p>Loading University Admins...</p>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 p-6 rounded-lg text-red-700 flex items-center gap-3">
            <FiAlertCircle className="text-2xl" />
            <p>Failed to load data: {error}</p>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiUserCheck /> University Admins
                </h1>
                <Link to="/admin/university-admins/create" className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">
                    <FiPlus /> Add University Admin
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Admin Name</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Stripe Account ID</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Wallet Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                <th className="py-3 px-4  text-xs font-medium text-gray-500 uppercase text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {admins.map((wallet) => (
                                <tr key={wallet._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 font-semibold text-gray-800">
                                        {wallet.user?.fullName || 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">
                                        {wallet.user?.email || 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 font-mono text-xs text-blue-600">
                                        {wallet.stripeAccountId}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                            wallet.status === 'active' ? 'bg-green-100 text-green-800' : 
                                            wallet.status === 'restricted' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold text-gray-700">
                                        ${wallet.balance}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <Link 
                                            to={`/admin/university-admins/edit/${wallet.user?._id}`} 
                                            className="inline-block text-teal-600 hover:text-teal-800 p-2"
                                            title="Edit Admin"
                                        >
                                            <FiEdit size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-500">No admins found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewUniversityAdminsPage;