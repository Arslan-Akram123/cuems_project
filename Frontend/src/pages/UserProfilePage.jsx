// src/pages/UserProfilePage.jsx

import { FiUser, FiLock, FiEye, FiEyeOff, FiChevronLeft } from 'react-icons/fi';
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProfile } from '../context/ProfileContext/ProfileContext';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
const UserProfilePage = () => {
    const {showToast} = useToast();
    const [loading, setLoading] = useState(false);
  const {showLoader, hideLoader,isLoading} = useLoader();
    const [activeTab, setActiveTab] = useState('general');
    // const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [previewImage, setPreviewImage] = useState(null);
    const { formData, setFormData } = useProfile();
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [securityFieldErrors, setSecurityFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };



    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            console.log('formData after image change:', { ...formData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        let imageUrl = null;
        if (formData.profileImage) {
            const data = new FormData();
            data.append('image', formData.profileImage);
            try {
                const uploadRes = await fetch('http://localhost:8001/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: data
                });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    showToast('Image upload failed.', 'error');
                    hideLoader();
                    return;
                }
                imageUrl = uploadData.url;
            } catch (error) {
                showToast('Image upload network error.', 'error');
                hideLoader();
                return;
            }
        }
        const data = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profileImage') {
                if (imageUrl) {
                    data[key] = imageUrl;
                }
            } else {
                data[key] = value;
            }
        });
        try {
            const response = await fetch('http://localhost:8001/settings/addProfileData', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Profile updated successfully!', 'success');
            } else {
                showToast(result.error || 'Update failed.', 'error');
            }
        } catch (error) {
            showToast('Network error. Try again.', 'error');
        } finally {
            hideLoader();
        }
    };

    const handleSecurityChange = (e) => {
        const { id, value } = e.target;
        setSecurityData(prev => ({ ...prev, [id]: value }));
        // setSecurityFieldErrors(prev => ({ ...prev, [id]: '' }));
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // setSecurityFieldErrors({});
        // setStatusMessage({ type: '', text: '' });
        const { currentPassword, newPassword, confirmPassword } = securityData;
        let errors = {};
        if (!currentPassword) errors.currentPassword = 'Current password is required';
        if (!newPassword) errors.newPassword = 'New password is required';
        if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
        if (newPassword && confirmPassword && newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (currentPassword && newPassword && currentPassword === newPassword) errors.newPassword = 'New password must be different from current password';
        if (Object.keys(errors).length > 0) {
            // setSecurityFieldErrors(errors);
            showToast(Object.values(errors)[0], 'error');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8001/settings/change-password', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.fieldErrors) {
                  // setSecurityFieldErrors(data.fieldErrors)
                  showToast(Object.values(data.fieldErrors)[0], 'error');
                }
                // setStatusMessage({ type: 'error', text: data.error || 'Password change failed' });
                showToast(data.error || 'Password change failed', 'error');
            } else {
                // setStatusMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
                showToast(data.message || 'Password changed successfully!', 'success');
                setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
            // setTimeout(() => setStatusMessage({ type: '', text: '' }), 2500);
        } catch (err) {
            // setStatusMessage({ type: 'error', text: 'Network error. Try again.' });
            showToast('Network error. Try again.', 'error');
            // setTimeout(() => setStatusMessage({ type: '', text: '' }), 2500);
        }finally{
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="min-w-[2xl] max-w-4xl mx-auto">
                    <div className='flex justify-end mb-6'>
                        <Link
                            to="/home"
                            className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                        >
                            <FiChevronLeft /> Back
                        </Link>
                    </div>
                    {/* {statusMessage.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {statusMessage.text}
                        </div>
                    )} */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <div className="border border-gray-200 rounded-lg p-1 bg-gray-100">
                            <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'general' ? 'bg-white shadow' : 'text-gray-600'}`}>General</button>
                            <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'security' ? 'bg-white shadow' : 'text-gray-600'}`}>Security</button>
                        </div>
                    </div>
                    {activeTab === 'general' && (
                        <form className="bg-white p-8 rounded-lg shadow-md space-y-8" onSubmit={handleSubmit}>
                            <div className="grid lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FiUser /> General Information</h3>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text"
                                        required
                                         id="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full py-2 px-2 border-1 border-teal-500 rounded-md shadow-sm focus:ring-teal-600 focus:outline-teal-500 focus:border-teal-600 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" id="email" value={formData.email} disabled onChange={handleChange} className="mt-1 block w-full py-2 px-2 border-1 border-teal-500 rounded-md shadow-sm bg-gray-100 focus:ring-teal-600 focus:outline-teal-500 focus:border-teal-600 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                        <input type="text"
                                        required
                                         id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full py-2 px-2 border-1 border-teal-500 rounded-md shadow-sm focus:ring-teal-600 focus:outline-teal-500 focus:border-teal-600 sm:text-sm" />
                                    </div>
                                    <div>
                                         <label htmlFor='profileImage' className="block text-sm font-medium text-gray-700">Profile Image</label>
                                       <input type="file" accept="image/*" id="profileImage" name="profileImage"
                                         onChange={handleImageChange} className="mt-1 block w-full py-2 px-2 border-1 border-teal-500 rounded-md shadow-sm focus:ring-teal-600 focus:outline-teal-500 focus:border-teal-600 sm:text-sm cursor-pointer" />
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mt-5 ">Profile Picture</label>
                                    <div className="mt-6 flex flex-col items-center justify-center px-2  border-gray-300 border-dashed rounded-md h-68 w-68">
                                        <div className="h-68 w-68 rounded-md bg-gray-100 mb-4 flex items-center justify-center text-gray-400">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="h-full w-full object-cover rounded-md" />
                                            ) : (
                                                <img src={formData.profileImage ? formData.profileImage : '/image.png'} alt="Default" className="h-full w-full object-cover rounded-md" />
                                            )}
                                        </div>
                                        {/* <input type="file" accept="image/*" id="profileImage" name="profileImage"
                                         onChange={handleImageChange} className="text-sm font-medium text-teal-600 bg-gray-50 rounded-md py-2  cursor-pointer" /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700">
                                  {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update Profile</span>)}
                                </button>
                            </div>
                        </form>
                    )}
                    {activeTab === 'security' && (
                       <form className="bg-white p-8 rounded-lg shadow-md space-y-8" onSubmit={handleSecuritySubmit}>
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <FiLock /> Change Password
    </h3>

    {/* Current Password */}
    <div>
      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
      <div className="flex items-center border border-teal-500 rounded-md mt-1 px-2">
        <input
          type={showPassword.current ? "text" : "password"}
          id="currentPassword"
          name="currentPassword"
          value={securityData.currentPassword}
          required
          onChange={handleSecurityChange}
          className="flex-1 py-2 px-1 bg-transparent border-none focus:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("current")}
          className="text-gray-500 hover:text-gray-700"
        >
          {showPassword.current ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {/* {securityFieldErrors.currentPassword && (
        <p className="mt-1 text-sm text-red-600">{securityFieldErrors.currentPassword}</p>
      )} */}
    </div>

    {/* New Password */}
    <div>
      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
      <div className="flex items-center border border-teal-500 rounded-md mt-1 px-2">
        <input
          type={showPassword.new ? "text" : "password"}
          id="newPassword"
          name="newPassword"
          value={securityData.newPassword}
          required
          onChange={handleSecurityChange}
          className="flex-1 py-2 px-1 bg-transparent border-none focus:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("new")}
          className="text-gray-500 hover:text-gray-700"
        >
          {showPassword.new ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {/* {securityFieldErrors.newPassword && (
        <p className="mt-1 text-sm text-red-600">{securityFieldErrors.newPassword}</p>
      )} */}
    </div>

    {/* Confirm Password */}
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
      <div className="flex items-center border border-teal-500 rounded-md mt-1 px-2">
        <input
          type={showPassword.confirm ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={securityData.confirmPassword}
          required
          onChange={handleSecurityChange}
          className="flex-1 py-2 px-1 bg-transparent border-none focus:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("confirm")}
          className="text-gray-500 hover:text-gray-700"
        >
          {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {/* {securityFieldErrors.confirmPassword && (
        <p className="mt-1 text-sm text-red-600">{securityFieldErrors.confirmPassword}</p>
      )} */}
    </div>

    <div className="text-right pt-4">
      <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700">
        {loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update Password</span>)}
      </button>
    </div>
  </div>
</form>

                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default UserProfilePage;