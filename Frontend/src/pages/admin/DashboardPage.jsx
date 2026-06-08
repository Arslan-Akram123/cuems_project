// src/pages/admin/DashboardPage.jsx
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiBook ,FiBookmark, FiMessageCircle, FiGrid, FiEye,FiAward,FiDollarSign,FiUserCheck  } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import {useProgressBar} from '../../context/ProgressBarContext';
import { jwtDecode } from 'jwt-decode';
const getAuth = () => {
  const localtoken = localStorage.getItem('token');
  if (!localtoken) return { role: null };
  try {
    const decoded = jwtDecode(localtoken);
    return { role: decoded.role };
  } catch {
    return { role: null };
  }
};
const StatCard = ({ icon, title, value, color }) => {
    const colorClasses = {
        orange: 'bg-orange-100 text-orange-600',
        blue: 'bg-blue-100 text-blue-600 border-blue-500',
        red: 'bg-red-100 text-red-600',
        teal: 'bg-teal-100 text-teal-600',
        indigo: 'bg-indigo-100 text-indigo-600 border-indigo-500',
        purple: 'bg-purple-100 text-purple-600 border-purple-500',
        gray: 'bg-gray-100 text-gray-600 border-gray-500',
        green: 'bg-green-100 text-green-600 border-green-500',
    };

    return (
        <div className={`bg-white p-6 rounded-lg shadow-md flex items-center gap-6 border-b-4 ${colorClasses[color]}`}>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-4xl font-bold text-gray-800">{value}</p>
                <p className="text-gray-500">{title}</p>
            </div>
        </div>
    );
};



const DashboardPage = () => {
    const {start,finish}=useProgressBar();
    const [newBookings, setNewBookings] = useState([]);
   const [dashboardData, setDashboardData] = useState([]);
   const { role } = getAuth();
    useEffect(() => {
        start();
        fetch('http://localhost:8001/dashboard/getDashboardData', { credentials: 'include' }).then(res => res.json()).then(data => setDashboardData(data)).catch(err => console.error(err)).finally(finish);
        fetch('http://localhost:8001/eventsbook/getNewBookings', { credentials: 'include' }).then(res => res.json()).then(data => setNewBookings(data)).catch(err => console.error(err));
    }, []);

    const Allstats = [
        { icon: <FiUsers size={32}/>, title: 'Total Users', value:  dashboardData.totalUsers||0 , color: 'orange' },
        { icon: <FiCalendar size={32}/>, title: 'Total Events', value: dashboardData.totalEvents || 0, color: 'blue' },
        { icon: <FiBookmark size={32}/>, title: 'Total Bookings', value: dashboardData.totalBookEvents || 0, color: 'red' },
        { icon: <FiMessageCircle size={32}/>, title: 'Total Comments', value: dashboardData.totalComments || 0, color: 'teal' },
        { icon: <FiGrid size={32}/>, title: 'Total Categories', value: dashboardData.totalCategories || 0, color: 'indigo' },
        { icon: <FiAward  size={32}/>, title: 'Total Universities', value: dashboardData.totalUniversities || 0, color: 'purple' },
        { icon: <FiDollarSign size={32}/>, title: 'Total Payments', value: `$${(dashboardData.totalPayments || 0).toFixed(2)}`, color: 'gray' },
        { icon: <FiUserCheck size={32}/>, title: 'Total University Admins', value: dashboardData.totalUniversityAdmins || 0, color: 'green' },
        { icon: <FiDollarSign size={32}/>, title: 'Wallet Balance', value: `$${(dashboardData.totalWalletAmount || 0).toFixed(2)}`, color: 'green' }
    ];
    const superAdminStats =['Total Users', 'Total Universities', 'Total University Admins', ];
    const stats=Allstats.filter(stat => {
        if(role === 'Admin'){
            return superAdminStats.includes(stat.title) || ['Total Events', 'Total Bookings', 'Total Comments', 'Total Categories', 'Total Payments'].includes(stat.title);
        }
        return superAdminStats.includes(stat.title) === false;
    });
    return (
        <>
        <div>
           
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>
            {/* === NEW BOOKINGS SECTION === */}
            {newBookings.filter(b => b.adminRead === true && b.status === 'pending').length > 0 ? (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">New Bookings</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Booking No</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Manage</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {newBookings.filter(b => b.adminRead === true && b.status === 'pending').map((booking, index) => (
                                        <tr key={booking._id}>
                                            <td className="py-4 px-4">{index + 1}</td>
                                            <td className="py-4 px-4 font-mono">{booking._id}</td>
                                            <td className="py-4 px-4">{booking.user.fullName}</td>
                                            <td className="py-4 px-4">{booking.event.name}</td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Link to={`/admin/bookings/show/${booking._id}`} className="bg-teal-500 text-white flex items-center gap-2 py-1 px-3 rounded-md hover:bg-teal-600">
                                                    <FiEye /> Show
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <p className="text-red-700">Notification not Available</p>
                </div>
            )}
            
        </div>
        </>
    );
};

export default DashboardPage;