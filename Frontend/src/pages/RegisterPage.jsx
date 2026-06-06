import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthLayout from '../components/AuthLayout';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
 const {showLoader, hideLoader,isLoading} = useLoader();
   const {showToast} = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await fetch('http://localhost:8001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Set specific errors
        const errorText = data.error || 'Registration failed';
        const lowerError = errorText.toLowerCase();

        if (lowerError.includes('email')) {
          showToast(errorText, 'error');
        } else if (lowerError.includes('password')) {
          showToast(errorText, 'error');
        } else if (lowerError.includes('full name')) {
          showToast(errorText, 'error');
        } 
        else {
          showToast(errorText, 'error');
        }

        return;
      }
      showToast(data.message, 'success');
      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      console.error('Client-side error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      hideLoader();
    }
  };

  return (
    <AuthLayout title="Register">

      <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 border-0">
          <div className="flex flex-col gap-1">
            <label htmlFor="Full-name" className="sr-only">Full Name</label>
            <input
              id="Full-name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
              placeholder="Full Name"
            />
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
              placeholder="example@gmail.com"
            />
          </div>


          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 sm:text-sm"
              placeholder="********"
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-teal-500 py-2 px-4 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
           {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Registering... </span>):(<span>Register</span>)}
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
