// src/components/AuthLayout.jsx
// import Logo from './Logo';
import { useProfile } from '../context/ProfileContext/ProfileContext';
const AuthLayout = ({ children, title }) => {
   const { siteSetting } = useProfile();
  return (  
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        
       
        <div className="flex flex-col items-center">
          
         {siteSetting.siteLogo ? (
           <img src={siteSetting.siteLogo} alt="Site Logo" className="h-28 w-48 object-contain" />
         ) : (
           <img src="/uploads/SiteLogo.png" alt="Site Logo" className="h-28 w-48 object-contain" />
         )}
          

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
        </div>

        {children}

      </div>
    </div>
  );
};

export default AuthLayout;