// // src/pages/PublicHomePage.jsx
// import { Link } from 'react-router-dom';
// import Logo from '../components/Logo'; 
// import homePageImage from '../assets/homelogo.jpeg'; // We'll need to add this image
// import { useProfile } from '../context/ProfileContext/ProfileContext';
// // A simple header for this page
// const PublicHeader = () => {
//      const { siteSetting } = useProfile();
//     return (
     
//     <header className="absolute top-0 left-0 w-full p-6 ">
//         <div className="container mx-auto ">
//             {/* <Logo /> */}
//             <img src={`/uploads/siteSettings/${siteSetting.siteLogo}`} alt="Site Logo" className="h-28 w-48 object-contain" />
//         </div>
//     </header>
// )};

// const PublicHomePage = () => {
//      const { siteSetting } = useProfile();
//     return (
//         <div className="bg-white min-h-screen flex flex-col justify-center">
//             <PublicHeader />
//             <main className="container mx-auto px-6 py-16 flex-grow flex items-center mt-10">
//                 <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
//                     {/* Left Side: Text Content */}
//                     <div className="text-center md:text-left order-1">
//                         <h1 className="text-2xl mt-8 md:text-3xl font-bold text-teal-500 tracking-wider">
//                             EVENTOPS HUB
//                         </h1>
//                         <p className="mt-4 text-md  text-gray-600 ">
//                            {siteSetting.description}
//                         </p>
//                         <Link
//                             to="/login"
//                             className="mt-8 inline-block bg-teal-500 text-white  text-sm py-2 px-2  rounded-lg shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-100"
//                         >
//                             Login / Demo User
//                         </Link>
//                     </div>

//                     {/* Right Side: Image */}
//                     <div className="w-full order-2 mt-10 md:mt-0">
//                         <img 
//                             src={siteSetting.siteMainImage} 
//                             alt="Event management illustration" 
//                             className="w-3/4 h-auto mx-auto"
//                         />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default PublicHomePage;

// src/pages/PublicHomePage.jsx
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext/ProfileContext';
import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUsers, FiLogIn } from 'react-icons/fi';
import Footer from '../components/Footer';
import landing from '../assets/image.png'; // Example landing image
import { useInView } from 'react-intersection-observer'; // Import for scroll animations

// --- Header Component (with scroll effect) ---
const PublicHeader = () => {
    const { siteSetting } = useProfile();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto flex justify-between items-center px-4 py-0">
                <img src={siteSetting.siteLogo} alt="Site Logo" className="h-12 md:h-16 w-auto object-contain rounded-lg" />
               <div className='flex gap-2 items-center justify-center'>
                 <Link to="/login" className={`font-semibold py-2 px-5 rounded-lg text-sm transition-all duration-300 ${isScrolled ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-white text-teal-600 hover:bg-gray-100 shadow-lg'}`}>
                    Login
                </Link>
                <Link to="/register" className={`font-semibold py-2 px-5 rounded-lg text-sm transition-all duration-300 ${isScrolled ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-white text-teal-600 hover:bg-gray-100 shadow-lg'}`}>
                    Register
                </Link>
               </div>
            </div>
        </header>
    );
};

// --- Reusable Animated Section Component ---
const AnimatedSection = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only animates once
        threshold: 0.1,    // Trigger when 10% of the section is visible
    });

    return (
        <section ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </section>
    );
};


// --- The Main Landing Page Component ---
const PublicHomePage = () => {
    const { siteSetting } = useProfile();

    return (
        <div className="bg-white font-sans">
            <PublicHeader />
            
            <main>
                {/* === 1. Hero Section === */}
                <section 
                    className="relative min-h-screen flex items-end pb-10 justify-center text-white text-center px-4"
                    style={{ backgroundImage: `url(${siteSetting.siteMainImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
                >
                    <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
                    <div className="relative z-10 ">
                       <h1 className="typing-effect text-2xl sm:text-3xl md:text-7xl font-bold tracking-tighter leading-tight text-white drop-shadow-lg">
                        Discover. Connect. Engage.
                        </h1>

                        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 font-light drop-shadow">
                            EventOps Hub is the central portal for all university events. Your next opportunity is just a click away.
                        </p>
                        <Link to="/login" className="mt-10 inline-flex items-center gap-2 bg-teal-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-teal-400 transition-all duration-300 transform hover:scale-105">
                            <FiLogIn /> Get Started
                        </Link>
                    </div>
                </section>

                {/* === 2. About Us / Mission Section === */}
                <AnimatedSection>
                    <div className="py-16 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div className="order-2 md:order-1">
                                    <span className="text-teal-500 text-2xl md:text-4xl font-bold tracking-widest uppercase">Our Mission</span>
                                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-2">Connecting Campuses, Creating Opportunities</h2>
                                    <p className="mt-6 text-gray-600 leading-relaxed">
                                        {siteSetting.description}
                                    </p>
                                    <Link to="/about" className="mt-8 inline-block text-teal-600 font-bold hover:underline">
                                        Learn More About Us &rarr;
                                    </Link>
                                </div>
                                <div className="order-1 md:order-2">
                                    <img 
                                        src={landing} 
                                        alt="Students collaborating" 
                                        className="rounded-lg w-full h-auto border-6 border-teal-600 shadow-[0_0_12px_2px_rgba(20,184,166,0.4)]  hover:shadow-[0_0_16px_3px_rgba(20,184,166,0.5)]"
                                        />

                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* === 3. Features Section === */}
                   <section 
                    className="relative  text-white text-center"
                    style={{ backgroundImage: `url(${siteSetting.siteMainImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
                >
                <AnimatedSection>
                    <div className="pt-16 bg-teal-800 opacity-90 ">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className=" text-2xl md:text-4xl font-bold text-white">Everything You Need in One Place</h2>
                            <p className="mt-4 text-lg text-white max-w-3xl mx-auto">A unified ecosystem designed for the modern academic community.</p>
                            <div className="grid md:grid-cols-3 gap-8 mt-16">
                                <div className="feature-card text-left border-l-4 border-l-teal-500">
                                    <FiSearch className="h-10 w-10 text-teal-500 mb-4" />
                                    <h3 className="text-xl font-bold">Discover Events</h3>
                                    <p className="mt-2 text-gray-600">Explore events from multiple universities with powerful search and filtering.</p>
                                </div>
                                <div className="feature-card text-left border-l-4 border-l-teal-500">
                                    <FiCalendar className="h-10 w-10 text-teal-500 mb-4" />
                                    <h3 className="text-xl font-bold">Seamless Booking</h3>
                                    <p className="mt-2 text-gray-600">Book your spot for any event with a simple, secure process, including payments and invoicing.</p>
                                </div>
                                <div className="feature-card text-left border-l-4 border-l-teal-500">
                                    <FiUsers className="h-10 w-10 text-teal-500 mb-4" />
                                    <h3 className="text-xl font-bold">Powerful Admin Tools</h3>
                                    <p className="mt-2 text-gray-600">A complete dashboard for administrators to create, manage, and track event success.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
</section>
                {/* === 4. Final Call to Action Section === */}
                <section 
                    className="relative py-24 text-gray-200 text-center"
                    style={{ backgroundImage: `url(${siteSetting.siteMainImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
                >
                    
                    <div className="absolute inset-0 bg-teal-800 opacity-90"></div>
                    <div className="relative z-10 container mx-auto px-6">
                        <h2 className="text-4xl font-bold">Ready to Join the Community?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-100">Sign up today and never miss an opportunity to engage, learn, and connect.</p>
                         <Link to="/register" className="mt-8 inline-block bg-white text-teal-600 font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                            Create an Account
                        </Link>
                    </div>
                </section>

                {/* === 5. Contact Section === */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-6">
                         <div className="flex justify-center">
                            <div className="bg-white p-8 rounded-xl border border-teal-100 shadow-lg max-w-2xl w-full text-center">
                                <h3 className="font-bold text-2xl mb-6 text-teal-800 border-b-2 border-teal-500 pb-2 inline-block">Get in Touch</h3>
                                <div className="space-y-4 text-gray-700">
                                   <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
                                       <div className="flex items-center gap-2">
                                            <span className="font-bold text-teal-600">Email:</span> 
                                            <a href={`mailto:${siteSetting.siteEmail}`} className="hover:text-teal-800 transition-colors bg-teal-50 px-3 py-1 rounded-md">{siteSetting.siteEmail}</a>
                                       </div>
                                        <div className="flex items-center gap-2">
                                           <span className="font-bold text-teal-600">Phone:</span>
                                           <a href={`tel:${siteSetting.sitePhone}`} className="hover:text-teal-800 transition-colors bg-teal-50 px-3 py-1 rounded-md">{siteSetting.sitePhone}</a>
                                       </div>
                                   </div>
                                    <p className="text-sm text-gray-500 mt-4">Have questions? We are here to help you 24/7.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default PublicHomePage;