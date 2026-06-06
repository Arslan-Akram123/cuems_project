// src/components/admin/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiMessageSquare, FiUser, FiCheckSquare, FiGrid, FiUsers, FiAward , FiSettings, FiPlusCircle, FiX,FiDollarSign, FiUserCheck } from 'react-icons/fi';

import { useProfile } from '../../context/ProfileContext/ProfileContext';
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
const Sidebar = ({ isSidebarOpen, onSidebarClose }) => {
     const { siteSetting } = useProfile();
     const location = useLocation();
    const { role } = getAuth();
    const superAdminOnlyLinks = ['Users', 'University Admins', 'Universities', 'Setting'];
    const allNavLinks  = [
        { icon: <FiHome />, text: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FiCalendar />, text: 'Events', path: '/admin/events' },
        { icon: <FiMessageSquare />, text: 'Comments', path: '/admin/comments' },
        { icon: <FiUser />, text: 'Profile', path: '/admin/profile' },
        { icon: <FiCheckSquare />, text: 'Bookings', path: '/admin/bookings' },
         { icon: <FiDollarSign />, text: 'Payments', path: '/admin/payments' },
        { icon: <FiGrid />, text: 'Categories', path: '/admin/categories' },
        { icon: <FiUsers />, text: 'Users', path: '/admin/users' },
        { icon: <FiUserCheck />, text: 'University Admins', path: '/admin/university-admins' },
        { icon: <FiPlusCircle />, text: 'Notices', path: '/admin/notices' },
        { icon: <FiAward  />, text: 'Universities', path: '/admin/universities' },
        { icon: <FiSettings />, text: 'Setting', path: '/admin/setting' },
    ];
    const navLinks = allNavLinks.filter(link => {
        const subAdminOnlyLinks = ['Events', 'Comments', 'Bookings', 'Payments', 'Categories'];

        if (role === 'Admin') {
            return !subAdminOnlyLinks.includes(link.text);
        }
        return !superAdminOnlyLinks.includes(link.text);
    });
    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'bg-teal-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
    };

    return (
        <>
            {/* === OVERLAY for mobile view === */}
            {/* This dark overlay will appear behind the sidebar on small screens */}
            <div 
                className={`
                    fixed inset-0 bg-black bg-opacity-40 z-10 lg:hidden
                    transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onSidebarClose} // Close sidebar when overlay is clicked
            ></div>
            
            <aside 
                className={`
                    w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0
                    fixed lg:static lg:translate-x-0 h-full z-20 
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* --- HEADER OF THE SIDEBAR --- */}
                <div className="h-20 flex items-center justify-between px-4  flex-shrink-0">
                    {/* <Logo/> */}
                    <img src={siteSetting.siteLogo} alt="Site Logo" className="h-28 w-48 object-contain" />
                    {/* --- THE NEW CLOSE BUTTON --- */}
                    {/* It's only visible on small screens (lg:hidden) */}
                    <button onClick={onSidebarClose} className="lg:hidden text-gray-500 hover:text-gray-800">
                        <FiX size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.text}
                            to={link.path}
                            onClick={onSidebarClose}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${getLinkClass(link.path)}`}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.text}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;