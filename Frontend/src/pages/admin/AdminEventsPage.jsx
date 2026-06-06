import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
   
    const getStatusClass = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-green-100 text-green-800';
            case 'ongoing': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/events/getAllEvents', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || []);
                setFilteredEvents(data.events || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setEvents([]);
                setFilteredEvents([]);
                setLoading(false);
            }).finally(() => {
                hideLoader();
            });
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEvents(events);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredEvents(
                events.filter(event =>
                    event.name?.toLowerCase().includes(term) ||
                    event.category?.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, events]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Manage Events</h1>
                <Link 
                    to="/admin/events/create"
                    className="flex items-center gap-1 sm:gap-2 bg-teal-500 text-white sm:font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-teal-600 transition-colors"
                >
                    <FiPlus /> Create Event
                </Link>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex items-center">
                    <FiSearch className="text-gray-400 mr-3 text-3xl" />
                    <input
                        type="text"
                        placeholder="Search events by name or category..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full border-0 rounded-md focus:ring-0 focus:outline-none"
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500"><Loader/></td>
                            </tr>
                        ) : events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">No events found.</td>
                            </tr>
                        ) : (
                            filteredEvents.map((event, index) => (
                                <tr key={event._id}>
                                    <td className="py-4 px-6 whitespace-nowrap">{index + 1}</td>
                                    <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">{event.name}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{event.category}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap flex items-center gap-4">
                                        <Link to={`/admin/events/edit/${event._id}`} className="text-blue-600 hover:text-blue-900"><FiEdit size={18} /></Link>
                                        {/* <button className="text-red-600 hover:text-red-900"><FiTrash2 size={18} /></button> */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEventsPage;
