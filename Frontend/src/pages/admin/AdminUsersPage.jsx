// src/pages/admin/AdminUsersPage.jsx

import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
const AdminUsersPage = () => {
    const [mockUsers, setMockUsers] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/settings/getAllUsers', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setMockUsers(data);
                   
                } else {
                    setMockUsers([]);
                }
            })
            .catch(err => {
                setMockUsers([]);
                console.log(err);
            })
            .finally(hideLoader);
    }, []);

    const getStatusClass = (status) => {
        return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    // Toggle admin role handler
    const handleToggleAdmin = async (userId, makeAdmin) => {
        try {
            console.log(userId, makeAdmin);
            // showLoader();
            const response = await fetch('http://localhost:8001/settings/updateProfileData', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, role: makeAdmin ? 'Admin' : 'User' })
            });
            const result = await response.json();
            if (response.ok) {
                setMockUsers(prev => prev.map(u =>
                    u._id === userId ? { ...u, role: makeAdmin ? 'Admin' : 'User' } : u
                ));
            } else {
                // Optionally show error message
                alert(result.message || 'Failed to update user role.');
            }
        } catch (error) {
            alert('Network error. Try again.');
        }
        // finally{
        //     hideLoader();
        // }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Information Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Make Admin</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {isLoading ?<tr><td colSpan="7" className='py-4 px-4 text-center'><Loader /></td></tr>:
                            mockUsers.length > 0 ? mockUsers.map((user, index) => {
                                
                             return(   <tr key={user._id }>
                                    <td className="py-4 px-4">{index + 1}</td>
                                    <td className="py-4 px-4 font-semibold">{user.fullName}</td>
                                    <td className="py-4 px-4">{user.email}</td>
                                    <td className="py-4 px-4 capitalize">{user.role}</td>
                                    <td className="py-4 px-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.isActive)}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            type="button"
                                            aria-pressed={user.role === 'Admin'}
                                            onClick={() => user.isActive && handleToggleAdmin(user._id, user.role !== 'Admin')}
                                            disabled={!user.isActive}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${user.role === 'Admin' ? 'bg-teal-500' : 'bg-gray-200'} ${!user.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="sr-only">Toggle admin</span>
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.role === 'Admin' ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </td>
                                </tr>
                              )}) : (
                                <tr>
                                    <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No user found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;