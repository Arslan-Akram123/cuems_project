// src/pages/EventsListPage.jsx

import UserLayout from '../components/UserLayout';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';

const EventsListPage = () => {
  const [Events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const {showLoader, hideLoader,isLoading} = useLoader();
  useEffect(() => {
    showLoader();
    fetch('http://localhost:8001/events/getAllEvents', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setEvents([]);
        setFilteredEvents([]);
      }).finally(() => {
        hideLoader();
      });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(Events);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredEvents(
        Events.filter(event =>
          event.name?.toLowerCase().includes(term) ||
          event.category?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, Events]);

  return (
 
    <UserLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar for Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md "> {/* sticky top value depends on header height */}
            <h2 className="text-xl font-bold mb-4">Search & Filter</h2>
            
            <div className="mb-6">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 border border-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-teal-500"
              />
            </div>

          

            <Link to="/home" className="mt-8 w-full block text-center bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </aside>

        {/* Right Main Content for Events Grid */}
        <main className="w-full md:w-3/4">
          <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-6 border-l-4 border-teal-500">
            <h1 className="text-2xl font-bold text-gray-800">Events List</h1>
            <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Events-List</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>): (<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* {filteredEvents.filter(event => event.status !== 'ongining' && event.status !== 'completed').map(event => (
              <EventCard key={event._id} event={event} />
            ))} */}
              {filteredEvents.length === 0 ? <p>No events found.</p> : filteredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
          </div>)}
        </main>

      </div>
    </UserLayout>
  );
};

export default EventsListPage;