import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
      const {showToast} = useToast();
    const navigate = useNavigate();
  const {showLoader, hideLoader,isLoading} = useLoader();
    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        try {
            const res = await fetch('http://localhost:8001/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                showToast(data.error || 'Password reset failed', 'error');
                return;
            }

            showToast(data.message, 'success');
            
            setTimeout(() => {
            
                navigate('/login');
            }, 1500);

        } catch (error) {
           
            showToast('An error occurred', 'error');
           
        }finally {
            hideLoader();
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

    };

    return (
        <AuthLayout title="Reset Your Password">

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md ">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                            placeholder="example@gmail.com"
                        />
                       
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-teal-500 py-2 px-4 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        {isLoading?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Reset Password... </span>):"Reset Password"}
                    </button>
                </div>

                <p className="mt-2 text-center text-sm text-gray-600">
                    <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                        Cancel
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
