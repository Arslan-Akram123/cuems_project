// src/pages/LandingPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
// We'll need more icons for this page
import { FiCalendar, FiBell, FiBriefcase, FiGrid, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';

// Placeholder images - in a real app, these would come from an API
import eventAnnouncementImg from '../assets/event-announcement.JPG'; // We'll need to create this placeholder
import warningimage from '../assets/warning-sign.webp'
import exploreUniversities from '../assets/exploreUniversities.JPG'; // And this one
import eventListening from '../assets/eventListening.JPG'; // And this one
import hybridInfo from '../assets/hybridInfo.JPG'; // And this one

const LandingPage = () => {
    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-0 space-y-4">
                
                {/* Section 1: Event and Announcement */}
            <div className="bg-yellow-400 rounded-lg p-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 shadow-lg">
                    <img src={warningimage} alt="Warning cone" className="h-32 w-32 object-contain " />
                    <div className="flex-grow">
                        <h2 className=" text-[22px] sm:text-3xl font-bold text-yellow-900">Event and Announcement</h2>
                        <div className="mt-4 space-y-3">
                            <Link to="/events/upcomingevents" className="flex items-center gap-3 bg-white rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                <FiCalendar className="h-6 w-6 text-teal-600" />
                                <span className="font-semibold">Upcoming Events</span>
                            </Link>
                             <Link to="/notifications" className="flex items-center gap-3 bg-white rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                <FiBell className="h-6 w-6 text-teal-600" />
                                <span className="font-semibold">Administrator Notifications</span>
                            </Link>
                        </div>
                    </div>
            </div>

                {/* Section 2: Exploring Universities */}
                <div className="bg-white rounded-lg p-8 border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-8">
                    <img src={exploreUniversities} alt="Campus" className="h-32 w-32 object-contain" />
                    <div className="flex-grow">
                        <span className="inline-block bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">Campus</span>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">Exploring Universities</h2>
                        <p className="text-gray-600 mb-4">
                           Unveiling or uncovering the depth of activities taking place within the university community.
                        </p>
                        <Link to="/universities" className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors">
                            Explore
                        </Link>
                    </div>
                </div>

                {/* Section 3 & 4: Event Info and Hybrid Info */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Event Listing Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-6">
                        <img src={eventListening} alt="Events" className="h-28 w-28 object-contain" />
                        <div>
                            
                            <span className="inline-block bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">Event Info</span>
                            <h3 className="text-xl font-bold my-1">Events Listing</h3>
                            <p className="text-gray-500 text-sm mb-4">Join us where you'll discover new techniques, unleash your creativity.</p>
                            <Link to="/events" className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                                Manage Events
                            </Link>
                        </div>
                    </div>

                    {/* Hybrid Info Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-6">
                         <img src={hybridInfo} alt="Hybrid" className="h-28 w-28 object-contain" />
                        <div className='flex-1'>
                            <span className="inline-block bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">Hybrid Info</span>
                            <div className="mt-2 gap-2 flex flex-col">
                               <Link to="/events/latest" className="w-full border border-teal-500 text-teal-600 text-center font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">Recent Events</Link>
                               <Link to="/testimonials" className="w-full border border-teal-500 text-teal-600 text-center font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">Testimonials</Link>
                               <Link to="/bookings/latest" className="w-full border border-teal-500 text-teal-600 text-center font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">Recent Bookings</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </UserLayout>
    );
};

export default LandingPage;