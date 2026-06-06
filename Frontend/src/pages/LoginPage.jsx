// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa'
import {useToast} from '../context/ToastContext';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const {showToast} = useToast();
  const {showLoader, hideLoader,isLoading} = useLoader();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
showLoader();
  try {
    const res = await fetch('http://localhost:8001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await res.json(); 

    if (!res.ok) {
      const errorMsg = data.error?.toLowerCase() || '';

      if (errorMsg.includes('email') || errorMsg.includes('user')) {
        showToast(data.error, 'error');
      } else if (errorMsg.includes('password')) {
        showToast(data.error, 'error');
      } else if (errorMsg.includes('activate')) {
        showToast(data.error, 'error');
      } else {
        showToast(data.error || 'Login failed', 'error');
      }
      return;
    }

   
    localStorage.setItem('token', data.token);
    showToast(data.message, 'success');
    try {
      const localtoken = localStorage.getItem('token');
      const decoded = jwtDecode(localtoken);
      const redirectPath = decoded.role === 'Admin' || decoded.role === 'subAdmin' ? '/admin/dashboard' : '/home';

      setTimeout(() => navigate(redirectPath), 1500);
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      showToast(
        'Login succeeded but failed to redirect based on role.',
        'error'
      );
    }
  } catch (err) {
    console.error('Client error:', err);
    showToast(err.message, 'error');
  }finally{
    hideLoader();
  }
};


  return (
    <AuthLayout title="Login">

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 border-0">
         <div className="flex flex-col gap-1">
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


    <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
  <label htmlFor="password" className="sr-only">Password</label>
  
  <input
    id="password"
    name="password"
    type={showPassword ? 'text' : 'password'}
    value={formData.password}
    onChange={handleChange}
    required
    className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-500 sm:text-sm"
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

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-500">
            Forgot Your Password?
          </Link>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-teal-500 py-2 px-4 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            {isLoading ? (<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Login... </span>) : 'Login'}
           
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
