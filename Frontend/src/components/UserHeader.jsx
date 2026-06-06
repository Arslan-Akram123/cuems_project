// src/components/UserHeader.jsx
import { useEffect, useState, useRef } from 'react';
// import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiBell, FiBookOpen, FiLogOut  } from 'react-icons/fi';
import { useProfile } from '../context/ProfileContext/ProfileContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const UserHeader = () => {
    const location = useLocation();
    // Notification click handler
    const {showToast} = useToast();
    const handleNotificationClick = async (notif_id) => {
        setLoadingNotif(true);
        try {
            const response = await fetch('http://localhost:8001/eventsbook/UpdateUserRead', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notif_id }),
            });
            await response.json();
            fetch('http://localhost:8001/eventsbook/getAllUserBookings', { credentials: 'include' })
                .then(res => res.json())
                .then(data =>{
                    setNotifications(data)
                    navigate('/my-bookings',{ state: { bookingid: notif_id } });
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
        }
        setLoadingNotif(false);
    };
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);
    const { formData, setFormData, fetchProfileData,siteSetting } = useProfile();
    const [categories, setCategories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate=useNavigate();

    // search functionality
   useEffect(() => {
  const controller = new AbortController();

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8001/scraping/globalSearchTitle',
        {
          params: { query: searchQuery },
          signal: controller.signal,
          withCredentials: true
        }
      );
        console.log("Search results:", response.data);
      setSearchResults(response.data);
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log("Search request cancelled");
        return;
      }
      console.error(error);
    }
  };

  let timeoutId;
  if (searchQuery.trim() !== "") {
    timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 1000); // debounce: wait 1s of inactivity
  } else {
    setSearchResults([]);
  }

  return () => {
    controller.abort();
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [searchQuery]);

    useEffect(() => {
        fetchProfileData();
        const fetchNotifications = () => {
            fetch('http://localhost:8001/eventsbook/getAllUserBookings', { credentials: 'include' })
                .then(res => res.json())
                .then(data => setNotifications(data))
                .catch(err => console.error(err));
        };
        fetchNotifications(); // initial fetch
        const intervalId = setInterval(fetchNotifications, 10000); // fetch every 10 seconds
        return () => clearInterval(intervalId); // cleanup on unmount
    },[]);

    useEffect(() => {
        fetch('http://localhost:8001/category/getCategories',{ credentials: 'include',})
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    // Close user menu and notification dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target) && isUserMenuOpen) {
                setIsUserMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target) && isNotificationOpen) {
                setIsNotificationOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen, isNotificationOpen]);
    const handleSignOut = () => {
        setIsUserMenuOpen(false);
       
        fetch('http://localhost:8001/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Logout successful:', data);
            // showToast('Logout successful', 'success');
             localStorage.clear();
        setFormData({
            fullName: '',
            street: '',
            country: '',
            city: '',
            state: '',
            postalCode: '',
            phoneNumber: '',
            email: '',
            profileImage: ''
        });
        setTimeout(() => {
                navigate('/login');
            }, 1500);
        })
        .catch(error => {
            console.error('Error logging out:', error);
            showToast('Error logging out', 'error');
        })
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            {/* === MAIN CONTAINER - Changed layout logic here === */}
            <div className="container mx-auto px-4">
                
                {/* --- TOP ROW (Always visible) --- */}
                {/* On small screens, it's a row with space-between. On medium screens, it becomes part of the larger flex layout. */}
                <div className="flex items-center justify-between gap-3 h-16 md:h-auto md:py-2 my-2 sm:my-0">
                    
                    {/* LOGO */}
                    <Link to="/home">
                    {/* <Logo /> */}
                    <img src={siteSetting.siteLogo} alt="Site Logo" className="h-16 w-44 object-contain" />
                    </Link>

                    {/* SEARCH BAR - This is the biggest change */}
                    {/* It's hidden on small screens in this row, but visible in the row below */}
                    <div className="relative w-full max-w-xl hidden md:block">
                        <input type="text" placeholder="Search Here ..."
                         value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <ul className="max-h-60 overflow-y-auto">
                                    {searchResults.map(result => (
                                        <li key={result._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSearchQuery(''); // Clear the search query
                                                setSearchResults([]); // Clear the search results
                                            navigate(`/universities/${result.name.toUpperCase()}/events`, { state: {searchQuery: result._id } });

                                            }}>
                                           <b>"{searchQuery}"</b> events  is: {result.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                               
                    </div>

                    {/* USER ICONS & DROPDOWN */}
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={notificationRef}>
                            <button onClick={() => setIsNotificationOpen(prev => !prev)} className="relative">
                                <FiBell className="h-8 mt-2 w-8 text-gray-600 hover:text-teal-600 cursor-pointer" />
                                {notifications.filter(n => n.userRead === false && n.status !== 'pending').length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {notifications.filter(n => n.userRead === false && n.status !== 'pending').length}
                                    </span>
                                )}
                            </button>
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                    <div className="p-4 border-b">
                                        <h4 className="font-semibold">You have {notifications.filter(n => n.userRead === false && n.status !== 'pending').length || '0'} notification(s)</h4>
                                    </div>
                                    <div className="py-2 px-2">
                                        {loadingNotif ? (
                                            <p className="text-sm text-gray-700">Updating...</p>
                                        ) : notifications.filter(n => n.userRead === false && n.status !== 'pending').length > 0 ? (
                                            notifications.filter(n => n.userRead === false && n.status !== 'pending').map((notif, index) => (
                                                <div key={notif._id}
                                                    onClick={() => handleNotificationClick(notif._id)}
                                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                    <p className="text-sm text-gray-700">{index + 1}) {notif.event.name} - {notif.status}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-700">No new notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setIsUserMenuOpen(prevState => !prevState)} className="flex items-center gap-2">
                                <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                  {formData.profileImage ? (
                                    typeof formData.profileImage === 'string' ? (
                                      <img src={formData.profileImage} alt="Profile" className="h-12 w-12 object-cover" />
                                    ) : (
                                      <img src={URL.createObjectURL(formData.profileImage)} alt="Profile" className="h-12 w-12 object-cover" />
                                    )
                                  ) : (
                                    <FiUser className="h-7 w-7 text-gray-600" />
                                  )}
                                </span>
                                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200 py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiUser className="mr-3" /> Profile
                                    </Link>
                                    <Link to="/my-bookings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FiBookOpen className="mr-3" /> Booking
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => handleSignOut()}
                                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <FiLogOut className="mr-3" /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM ROW (Mobile-only Search Bar) --- */}
                {/* This div is only visible on small screens (block) and hidden on medium and larger screens (md:hidden) */}
                <div className="pb-4 md:hidden">
                    <div className="relative w-full">
                         <input type="text" placeholder="Search Here ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          {searchQuery && searchResults.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <ul className="max-h-60 overflow-y-auto">
                                    {searchResults.map(result => (
                                        <li key={result._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSearchQuery(''); // Clear the search query
                                                setSearchResults([]); // Clear the search results
                                                // universities/FAST/events
                                                navigate(`/universities/${result.name.toUpperCase()}/events`, { state: {searchQuery: result._id } });

                                            }}>
                                           <b>"{searchQuery}"</b>events is: {result.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom part of the header - Category Navigation (No changes needed here) */}
            <div className="border-t border-gray-200 bg-teal-600 text-white">
                <nav
                    className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-teal-100"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="flex items-center justify-start md:justify-center space-x-6 px-4 min-w-max">
                        {categories.length > 0 ? categories.map((category) => {
                             const isActive = decodeURIComponent(location.pathname) === `/categories/${category.name}`;
                             return (
                            <Link
                                key={category._id}
                                to={`/categories/${category.name}`}
                                className={`py-2 px-3 whitespace-nowrap rounded-md transition-colors ${isActive ? 'bg-teal-800 font-semibold' : 'hover:bg-teal-700'}`}
                                tabIndex={0}
                            >
                                {category.name}
                            </Link>
                        )}) : null}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default UserHeader;