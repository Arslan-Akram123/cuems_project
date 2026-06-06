// src/components/UserLayout.jsx
import UserHeader from './UserHeader';
import Footer from './Footer';

// This layout component takes `children` and renders them between the header and footer.
const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50">
            <UserHeader />
            
            {/* Main content area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:py-6 md:px-24">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default UserLayout;