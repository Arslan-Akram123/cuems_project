// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import {  useEffect } from 'react';
import { useProfile } from './context/ProfileContext/ProfileContext';
// --- Page Imports ---
// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicHomePage from './pages/PublicHomePage';
import MaintenancePage from './pages/MaintenancePage';
// User-Facing Pages
import LandingPage from './pages/LandingPage';
import CategoryEventPage from './pages/CategoryEventPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import UniversitiesListPage from './pages/UniversitiesListPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import CompareDataPage from './pages/CompareDataPage';
import MyBookingsPage from './pages/MyBookingsPage';
import UserProfilePage from './pages/UserProfilePage';
import TestimonialsPage from './pages/TestimonialsPage';
import LatestEventsPage from './pages/LatestEventsPage';
import UpcommingEvent from './pages/UpcommingEvent';
import LatestBookingsPage from './pages/LatestBookingsPage';
import AdminNoticesPages from './pages/AdminNoticesPage';
import UniversityComparativeDataPage from './pages/UniversityComparativeDataPage';
// Not Found Page
import NotFoundPage from './pages/NotFoundPage';
// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import AdminCommentsPage from './pages/admin/AdminCommentsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import ConfirmBookingsPage from './pages/admin/ConfirmBookingsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import CreateCategoryPage from './pages/admin/CreateCategoryPage';
import CreateUniversityPage from './pages/admin/CreateUniversityPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminNoticesPage from './pages/admin/AdminNoticesPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import EditEventPage from './pages/admin/EditEventPage';
import EditCategoryPage from './pages/admin/EditCategoryPage';
import EditUniversityPage from './pages/admin/EditUniversityPage';
import ShowBookingPage from './pages/admin/ShowBookingPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import ViewUniversityAdminsPage from './pages/admin/ViewUniversityAdminsPage'; 
import UniversityAdminFormPage from './pages/admin/UniversityAdminFormPage';
// --- Layout & Component Imports ---
// User-Facing Components
import UniversityEvents from './components/UniversityEvents';
import UniversityPrograms from './components/UniversityPrograms';
import UniversityFeeStructure from './components/UniversityFeeStructure';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import CheckoutPage from './pages/CheckoutPage'; // Import the new checkout page

// static pages
// ... (imports)
import FaqPage from './pages/FaqPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// --- Authentication & Routing Logic ---
const getAuth = () => {
  const localtoken = localStorage.getItem('token');
  if (!localtoken) return { isAuthenticated: false, role: null };
  try {
    const decoded = jwtDecode(localtoken);
    return { isAuthenticated: true, role: decoded.role };
  } catch {
    return { isAuthenticated: false, role: null };
  }
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = getAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, role } = getAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  // This route is now strictly for the 'Admin' (Super Admin)
  return role === 'Admin' ? children : <Navigate to="/admin/dashboard" />; // Or to a "not authorized" page
};
const SubAdminRoute = ({ children }) => {
  const { isAuthenticated, role } = getAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  // This allows access if the role is either 'Admin' or 'subAdmin'
  return (role === 'Admin' || role === 'subAdmin') ? children : <Navigate to="/home" />;
};

const SubAdminOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = getAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  // This route is accessible ONLY by 'subAdmin', NOT 'Admin'
  return role === 'subAdmin' ? children : <Navigate to="/admin/dashboard" />;
};


const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = getAuth();
  if (!isAuthenticated) return children;
  if (role === 'Admin' || role === 'subAdmin') return <Navigate to="/admin/dashboard"  />;
  return <Navigate to="/home"  />;
};


// --- Main App Component ---
function App() {
   const { siteSetting,fetchSiteSettingData } = useProfile();
console.log(siteSetting);
  useEffect(() => {
    fetchSiteSettingData();
  }, []);
  if(siteSetting.siteCloseMessage){
    return <MaintenancePage settings={siteSetting} />;
    
  }
  return (
    
      <BrowserRouter>
        <Routes>
          {/* === AUTHENTICATION ROUTES === */}
          <Route path="/" element={<PublicOnlyRoute><PublicHomePage /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />

          

          {/* === ADMIN PANEL ROUTES === */}
              <Route path="/admin" element={<SubAdminRoute><AdminLayout /></SubAdminRoute>}>
            <Route index element={<Navigate to="dashboard" />} />
            
            {/* --- Routes Accessible to BOTH Admin & SubAdmin --- */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="notices" element={<AdminNoticesPage />} />

            {/* --- Routes Accessible ONLY to SubAdmin (NOT Admin) --- */}
            <Route path="events" element={<SubAdminOnlyRoute><AdminEventsPage /></SubAdminOnlyRoute>} />
            <Route path="events/create" element={<SubAdminOnlyRoute><CreateEventPage /></SubAdminOnlyRoute>} />
            <Route path="events/edit/:eventId" element={<SubAdminOnlyRoute><EditEventPage /></SubAdminOnlyRoute>} />
            <Route path="comments" element={<SubAdminOnlyRoute><AdminCommentsPage /></SubAdminOnlyRoute>} />
            <Route path="bookings" element={<SubAdminOnlyRoute><AdminBookingsPage /></SubAdminOnlyRoute>} />
            <Route path="bookings/confirmed" element={<SubAdminOnlyRoute><ConfirmBookingsPage /></SubAdminOnlyRoute>} />
            <Route path="bookings/show/:bookingId" element={<SubAdminOnlyRoute><ShowBookingPage /></SubAdminOnlyRoute>} />
            <Route path="payments" element={<SubAdminOnlyRoute><AdminPaymentsPage /></SubAdminOnlyRoute>} />
            <Route path="categories" element={<SubAdminOnlyRoute><AdminCategoriesPage /></SubAdminOnlyRoute>} />
            <Route path="categories/create" element={<SubAdminOnlyRoute><CreateCategoryPage /></SubAdminOnlyRoute>} />
            <Route path="categories/edit/:categoryId" element={<SubAdminOnlyRoute><EditCategoryPage /></SubAdminOnlyRoute>} />

            {/* --- Routes Accessible ONLY to Super Admin --- */}
            {/* We wrap these specific routes in the SuperAdminRoute guard */}
            <Route path="users" element={<SuperAdminRoute><AdminUsersPage /></SuperAdminRoute>} />
            <Route path="universities" element={<SuperAdminRoute><AdminUniversitiesPage /></SuperAdminRoute>} />
            <Route path="universities/create" element={<SuperAdminRoute><CreateUniversityPage /></SuperAdminRoute>} />
            <Route path="universities/edit/:universityId" element={<SuperAdminRoute><EditUniversityPage /></SuperAdminRoute>} />
            <Route path="university-admins" element={<SuperAdminRoute><ViewUniversityAdminsPage /></SuperAdminRoute>} />
            <Route path="university-admins/create" element={<SuperAdminRoute><UniversityAdminFormPage /></SuperAdminRoute>} />
            <Route path="university-admins/edit/:adminId" element={<SuperAdminRoute><UniversityAdminFormPage /></SuperAdminRoute>} />
            <Route path="setting" element={<SuperAdminRoute><AdminSettingsPage /></SuperAdminRoute>} />
        </Route>

          {/* === USER-FACING ROUTES === */}
          <Route path="/home" element={<PrivateRoute> <LandingPage /> </PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute> <UserProfilePage /> </PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute> <MyBookingsPage /> </PrivateRoute>} />
           <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute> <AdminNoticesPages /> </PrivateRoute>} />
          <Route path="/compare-data" element={<PrivateRoute> <UniversityComparativeDataPage /> </PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute> <EventsListPage /> </PrivateRoute>} />
          <Route path="/events/:eventId" element={<PrivateRoute> <EventDetailPage /> </PrivateRoute>} />
          <Route path="/categories/:category" element={<PrivateRoute> <CategoryEventPage /> </PrivateRoute>} />
          <Route path="/testimonials" element={<PrivateRoute> <TestimonialsPage /> </PrivateRoute>} />
          <Route path="/events/latest" element={<PrivateRoute> <LatestEventsPage /> </PrivateRoute>} />
          <Route path="/events/upcomingevents" element={<PrivateRoute> <UpcommingEvent /> </PrivateRoute>} />
          <Route path="/bookings/latest" element={<PrivateRoute> <LatestBookingsPage /> </PrivateRoute>} />
          <Route path="/universities" element={<PrivateRoute> <UniversitiesListPage /> </PrivateRoute>} />
          <Route path="/universities/:universityId" element={<PrivateRoute><UniversityDetailPage /></PrivateRoute>}>
            <Route index element={<Navigate to="events"  />} />
            <Route path="events" element={<UniversityEvents />} />
            <Route path="programs" element={<UniversityPrograms />} />
            <Route path="fees" element={<UniversityFeeStructure />} />
          </Route>
          <Route path="/compare-data" element={<PrivateRoute><CompareDataPage /></PrivateRoute>} />
           {/* Footer Routes */}
        <Route path="/faq/general" element={<PrivateRoute><FaqPage /></PrivateRoute>}/>
        <Route path="/support" element={<PrivateRoute><SupportPage /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
        <Route path="/terms" element={<PrivateRoute><TermsPage /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
        <Route path="/privacy" element={<PrivateRoute><PrivacyPolicyPage /></PrivateRoute>} />
           <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
   
  );
}

export default App;