import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';
const AdminNoticesPage = () => {
    const [notices, setNotices] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/notices/getNotificationOfUSer', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                setNotices(data);
            })
            .catch(error => {
                console.error('Error fetching notices:', error);
            }).finally(() => {
                hideLoader();
            });
    }, []);

    const markAsRead = async (noticeId) => {
        try {
            await fetch('http://localhost:8001/notices/markAsRead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noticeId })
            });

            // Update frontend state
            setNotices(prev =>
                prev.map(n =>
                    n._id === noticeId ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    
    let filteredNotices = notices;
    if (activeTab === 'unread') {
        filteredNotices = notices.filter(n => !n.isRead);
    } else if (activeTab === 'read') {
        filteredNotices = notices.filter(n => n.isRead);
    }

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Notifications</p>
                </div>

               
                <div className=" flex gap-2">
                    <button
                        className={`px-8 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-150 ${activeTab === 'all' ? 'border-teal-600 text-teal-700 bg-teal-50' : 'border-transparent text-gray-600 bg-white'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-150 ${activeTab === 'unread' ? 'border-teal-600 text-teal-700 bg-teal-50' : 'border-transparent text-gray-600 bg-white'}`}
                        onClick={() => setActiveTab('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-150 ${activeTab === 'read' ? 'border-teal-600 text-teal-700 bg-teal-50' : 'border-transparent text-gray-600 bg-white'}`}
                        onClick={() => setActiveTab('read')}
                    >
                        Read
                    </button>
                </div>

                <div className="bg-teal-50 rounded-lg  shadow-md overflow-x-auto">
                    <table className="min-w-[700px] w-full ">
                        <thead className="bg-gray-100 border-t border-gray-200">
                            <tr>
                                <th className="py-4 px-6 text-left text-sm font-bold text-gray-600 uppercase">Title</th>
                                <th className="py-4 px-6 text-left text-sm font-bold text-gray-600 uppercase">Description</th>
                                <th className="py-4 px-6 text-left text-sm font-bold text-gray-600 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? <tr><td colSpan="3" className="py-4 px-6 text-center text-gray-500"><Loader /></td></tr>:
                            filteredNotices.length > 0 ? filteredNotices.map((notice) => {
                                return (
                                    <tr
                                        key={notice._id}
                                        className={`cursor-pointer   
  ${!notice.isRead ? 'bg-green-100 font-semibold text-gray-900' : 'bg-white text-gray-600'}`}
                                        onClick={() => {
                                            if (!notice.isRead && activeTab === 'unread') {
                                                markAsRead(notice._id);
                                            }
                                        }}
                                    >
                                        <td className="py-4 px-6 text-gray-800 align-top break-words">{notice.title}</td>
                                        <td className="py-4 px-6 text-gray-600 align-top break-words">{notice.description}</td>
                                        <td className="py-4 px-6 text-gray-500 align-top whitespace-nowrap">
                                            {new Date(notice.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).replace(',', '')}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-6 text-center text-gray-500">No notices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
};

export default AdminNoticesPage;
