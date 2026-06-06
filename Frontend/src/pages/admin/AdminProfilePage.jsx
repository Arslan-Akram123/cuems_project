import { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext/ProfileContext';
import { FiUser, FiMapPin, FiPhone, FiEye, FiEyeOff, FiLock, FiUpload, FiCloudLightning } from 'react-icons/fi';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const AdminProfilePage = () => {
  const {showToast} = useToast();
  const {showLoader, hideLoader,isLoading} = useLoader();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  // const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  // const [securityFieldErrors, setSecurityFieldErrors] = useState({});
  const { formData, setFormData } = useProfile();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };





  const handleSecurityChange = (e) => {
    const { id, value } = e.target;
    setSecurityData(prev => ({ ...prev, [id]: value }));
    // setSecurityFieldErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    // setSecurityFieldErrors({});
    // setStatusMessage({ type: '', text: '' });
    showLoader();
    const { currentPassword, newPassword, confirmPassword } = securityData;
    let errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (currentPassword && newPassword && currentPassword === newPassword) errors.newPassword = 'New password must be different from current password';
    if (Object.keys(errors).length > 0) {
      // setSecurityFieldErrors(errors);
      // setStatusMessage({ type: 'error', text: Object.values(errors)[0] });
      showToast(Object.values(errors)[0], 'error');
      hideLoader();
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
          // setSecurityFieldErrors(data.fieldErrors);
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
      hideLoader();
    }
  };



  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
          setLoading(false);
          return;
        }
        imageUrl = uploadData.url;
      } catch (error) {
        showToast('Image upload network error.', 'error');
        setLoading(false);
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
        showToast(result.message || 'Profile updated successfully!', 'success');
      } else {
        showToast(result.error || 'Update failed.', 'error');
      }
    } catch (error) {
      showToast('Network error. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {/* {statusMessage.text && (
        <div className={`mb-6 p-4 rounded-md text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {statusMessage.text}
        </div>
      )} */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiUser /> Admin Profile
        </h1>
        <div className="border border-gray-200 rounded-lg p-1 bg-gray-100">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'general' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'security' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            Security
          </button>
        </div>
      </div>

      {activeTab === 'general' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="fullName"
                  name='fullName'
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600 sm:text-sm focus:outline-teal-500"
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  id="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    id="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="number"
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <div className="mt-1 flex flex-col items-center justify-center px-2 pb-2 border-2 border-gray-300 border-dashed rounded-md h-full">
                <div className=" h-40 w-40 md:h-72 md:w-72 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="h-full w-full object-cover rounded-md" />
                  ) : (
                    <img src={formData.profileImage ? formData.profileImage : '/uploads/image.png'} alt="Default" className="h-full w-full object-cover rounded-md" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  name='profileImage'
                  onChange={handleImageChange}
                  className="text-sm font-medium text-teal-600 bg-gray-50 rounded-md py-2 px-3 cursor-pointer"
                />

              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm sm:text-sm focus:outline-teal-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed focus:outline-teal-500 "
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-right space-x-4 mt-4">
            {/* <button type="button" className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Back</button> */}
            <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700">
              {loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update Profile</span>)}
            </button>
          </div>
        </form>
      )}
      {activeTab === 'security' && (
        <form className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto" onSubmit={handleSecuritySubmit}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiLock /> Change Password
            </h3>

            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="flex items-center border border-teal-500 rounded-md mt-1 px-3">
                <input
                  type={showPassword.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  className="flex-1 py-2 bg-transparent border-none focus:outline-none sm:text-sm"
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
              <div className="flex items-center border border-teal-500 rounded-md mt-1 px-3">
                <input
                  type={showPassword.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                  className="flex-1 py-2 bg-transparent border-none focus:outline-none sm:text-sm"
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
              <div className="flex items-center border border-teal-500 rounded-md mt-1 px-3">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                  className="flex-1 py-2 bg-transparent border-none focus:outline-none sm:text-sm"
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
               {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span> Update Password</span>)}
              </button>
            </div>
          </div>
        </form>

      )}

    </div>
  );
};

export default AdminProfilePage;
