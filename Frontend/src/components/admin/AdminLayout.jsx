// src/components/admin/AdminLayout.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // It's good practice to have explicit open/close functions
    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);
    
    // The header button will toggle the state
    const handleMenuButtonClick = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* Pass both the state and the specific close function to the Sidebar */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                onSidebarClose={closeSidebar} 
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* The header button can still use the toggle function */}
                <AdminHeader onMenuButtonClick={handleMenuButtonClick} />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;