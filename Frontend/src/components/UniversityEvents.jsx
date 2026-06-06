// src/components/UniversityEvents.jsx
import { useParams, Link,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from './Loader';


const UniversityEvents = () => {
    const location = useLocation();
     const { searchQuery } = location.state || {};
    const { universityId } = useParams();
    console.log(universityId);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { showLoader, hideLoader, isLoading } = useLoader();

    useEffect(() => {
        showLoader();
        fetch(`http://localhost:8001/scraping/getsepcificEvents/${universityId}?search=${searchQuery}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setEvents(data || []);
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setEvents([]);
            })
            .finally(() => hideLoader());
    }, []);

    // Pagination/filter logic
    const filteredEvents = events.filter(event =>
        event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredEvents.length / 10);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    );

    

    return (
        <div>
            <div className="flex justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search for Events..."
                    className="w-full md:w-1/2 px-2 py-2 focus:outline-teal-500 border border-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader />
                </div>
            ) : filteredEvents.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedEvents.map(event => (
                            <div key={event._id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-md mb-4"/>
                                <h4 className="text-lg font-bold truncate">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.date}</p>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                <Link to={event.link} target="_blank" rel="noopener noreferrer">
                                    <button
                                        className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition-colors font-semibold text-sm"
                                        type="button"
                                    >
                                        Read more
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex flex-col gap-2 justify-between items-center mt-4 text-sm">
                        <p className="text-gray-600 ">
                            Showing {(filteredEvents.length === 0 ? 0 : (currentPage - 1) * 10 + 1)} 
                              to {Math.min(currentPage * 10, filteredEvents.length)} of {filteredEvents.length} entries
                        </p>
                        <div className="w-full flex justify-center items-center ">
                            <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowX: 'auto' }}>
                                <button
                                    className="px-3 py-1 border rounded-l-md bg-white hover:bg-gray-50"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`px-3 py-1 border-t border-r border-b ${currentPage === i + 1 ? 'bg-teal-500 text-white' : 'bg-white hover:bg-gray-50'}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="px-3 py-1 border rounded-r-md bg-white hover:bg-gray-50"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &raquo;
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">No events found for this university.</p>
            )}
        </div>
    );
};

export default UniversityEvents;