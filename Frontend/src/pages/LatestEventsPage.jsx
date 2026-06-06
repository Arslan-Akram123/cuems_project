// src/pages/LatestEventsPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';
// We can reuse a similar card structure, but create it locally for this page.
const LatestEventCard = ({ event }) => (
    <div className="relative pl-8 ">
        <div className="absolute left-0 top-0 -translate-x-1/2 bg-white rounded-full h-8 w-8 flex items-center justify-center overflow-hidden">
            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
        </div>
        <div className="absolute left-0 top-4 bottom-0 w-0.5 bg-teal-500"></div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 ml-4">
           <div className="flex items-center justify-between text-sm text-gray-800">
             <h3 className="font-bold text-lg">{event.title}</h3>
             <span className='inline-block bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full'>{event.status}</span>
           </div>
           {/* <div className='flex justify-between items-center'> */}
             <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p><span className="font-semibold">Location:</span> {event.location}</p>
                <p><span className="font-semibold">Description:</span> {event.description}</p>
                <p><span className="font-semibold">Start Date:</span> {event.startDate ? new Date(event.startDate).toLocaleDateString() : ''}</p>
                <p><span className="font-semibold">Start Time:</span> {event.startTime}</p>
                <p><span className="font-semibold">Category:</span> {event.category}</p>
            </div>
            {/* <div className='flex justify-center items-center'>
                <img src={event.image} alt={event.title} className=' rounded-2xl' />
            </div>
           </div> */}
            <Link to={`/events/${event.id}`} className="text-teal-600 hover:underline font-semibold mt-2 inline-block">
                More Info
            </Link>
        </div>
    </div>
);


const LatestEventsPage = () => {
    const [events, setEvents] = useState([]);
   const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/events/getAllEvents', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                // Only show events with status 'ongoing' or 'completed'
                const filtered = (data.events || []).filter(ev => ev.status === 'ongoing' || ev.status === 'completed');
                setEvents(filtered);
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setEvents([]);
            }).finally(() => {
                hideLoader();
            });
    }, []);

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Recent Events</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Recent-Events</p>
                </div>

                {isLoading ? <Loader /> : ( <div className="space-y-8">
                    {events.length === 0 ? <p className="text-gray-500 text-center py-4">No events found.</p> : events.map(event => (
                        <LatestEventCard key={event._id} event={{
                            ...event,
                            id: event._id,
                            imageUrl: event.image || 'https://via.placeholder.com/50/E0E7FF/4338CA?text=E',
                            title: event.name,
                        }} />
                    ))}
                </div>)}
            </div>
        </UserLayout>
    );
};

export default LatestEventsPage;