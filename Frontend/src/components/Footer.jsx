
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { useProfile } from '../context/ProfileContext/ProfileContext';
const Footer = () => {
     const { siteSetting } = useProfile();
    
    const FooterLink = ({ to, children }) => (
        <Link to={to} className="text-gray-400 hover:text-teal-500 transition-colors text-sm md:text-base">
            {children}
        </Link>
    );

    return (
        <footer className="bg-gray-800 text-white pt-12 pb-8 px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
              
                <div className="flex justify-center flex-wrap gap-4 md:gap-32">
                   

                    
                    <div className=" min-w-[150px] flex flex-col justify-center items-center gap-1">
                        <h3 className="font-bold text-lg mb-4 text-gray-200">FAQs</h3>
                        <ul className="space-y-3">
                            <li className='text-center'><FooterLink to="/faq/general">General</FooterLink></li>
                            <li className='text-center'><FooterLink to="/support">Support</FooterLink></li>
                        </ul>
                    </div>

                    
                    <div className="min-w-[150px] flex flex-col justify-center items-center gap-1">
                        <h3 className="font-bold text-lg mb-4 text-gray-200">Company</h3>
                        <ul className="space-y-3">
                            <li className='text-center'><FooterLink to="/about">About</FooterLink></li>
                            <li className='text-center'><FooterLink to="/terms">Terms</FooterLink></li>
                        </ul>
                    </div>

                  
                    <div className="min-w-[150px] flex flex-col justify-center items-center gap-1">
                        <h3 className="font-bold text-lg mb-4 text-gray-200">More</h3>
                        <ul className="space-y-3">
                            <li className='text-center'><FooterLink to="/contact">Contact Us</FooterLink></li>
                            <li className='text-center'><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                        </ul>
                    </div>

                   
                </div>

               
                <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-gray-400 text-sm text-center sm:text-left order-2 sm:order-1 mt-4 sm:mt-0">
                        {siteSetting.footerText}
                    </p>
                    <div className="flex gap-6 order-1 sm:order-2">
                        <a href={siteSetting.instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors text-xl">
                            <FiInstagram />
                        </a>
                        <a href={siteSetting.facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors text-xl">
                            <FiFacebook />
                        </a>
                        <a href={siteSetting.tiwitterLink} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-sky-400 transition-colors text-xl">
                            <FiTwitter />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;