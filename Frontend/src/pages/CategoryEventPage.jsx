import react from 'react';
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';

const CategoryEventPage = () => {
    const { category } = useParams();
    const [length, setLength] = useState(0);
    const [events, setEvents] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch(`http://localhost:8001/events/getEventsByCategory/${category}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                console.log("category",data);
                setEvents(data.events || []);
                setLength(data.count);
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setEvents([]);
                setLength(0);
            }).finally(() => {
                hideLoader();
            });
    }, [category]);

    return (
        <UserLayout>
              <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Category</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Category</p>
                </div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Events in {category} Category ({length})</h1>
             {isLoading ? <Loader/>:( <div>
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventCard key={event._id || event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No events found in this category.</p>
                )}
                </div> ) }
            </div>
        </UserLayout>
    );
};

export default CategoryEventPage;