// src/pages/admin/UniversityAdminFormPage.jsx
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiUserPlus, FiEdit, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';
import { useLoader } from '../../context/LoaderContext';
import { useToast } from '../../context/ToastContext';

const mockUniAdmins = [
    { id: 1, fullName: 'Dr. Ali Khan', email: 'ali.khan@fast.edu.pk', university: 'Fast University Lahore', manage:'...'},
    { id: 2, fullName: 'Aisha Ahmed', email: 'a.ahmed@ucp.edu.pk', university: 'University of Central Punjab', manage:'...' },
];

const FormInput = ({ id, label, type = 'text', required = false, value, onChange, name }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            type={type} 
            id={id} 
            name={name || id}
            required={required} 
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full py-2 px-3 border border-teal-500 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600 sm:text-sm focus:outline-teal-500"
        />
    </div>
);

const UniversityAdminFormPage = () => {
    const { adminId } = useParams(); // Get the ID from the URL
    console.log("Admin ID from URL:", adminId);
    const navigate = useNavigate();
    const isEditMode = Boolean(adminId); // Check if we are in "Edit" mode
    const { showLoader, hideLoader, isLoading } = useLoader();
    const { showToast } = useToast();

    // State for the form data
    const [formData, setFormData] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
          async function fetchAdminData() {
                try {
                    const response = await fetch(`http://localhost:8001/settings/getProfilewithID/${adminId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log(data);
                    setFormData(data);
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                }
            }
            fetchAdminData(); 
        }
        // In Create mode, formData will just be an empty object
    }, [adminId, isEditMode]);

    const handleDeleteConfirm = async () => {
        console.log("Deleting admin:", formData.fullName);
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8001/settings/deleteProfileWithID/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            setIsDeleteModalOpen(false);
            setTimeout(() => {
                    showToast('Admin Deleted successfully', 'success');
                    navigate('/admin/university-admins');
                }, 1000);
        } catch (error) {
            console.error('Error deleting admin:', error);
            showToast(error.message || 'An error occurred while deleting', 'error');
        } finally {
            setIsDeleting(false);
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        try {
            if (isEditMode) {
                console.log("Updating admin:", formData);
                // API call to UPDATE would go here
                // Simulate success for now since API isn't connected for update
                setTimeout(() => {
                    showToast('Admin updated successfully', 'success');
                     navigate('/admin/university-admins');
                }, 1000);
            } else {
                console.log("Creating admin:", formData);
                const response = await fetch("http://localhost:8001/auth/university-admins", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });
                
                const data = await response.json();
                console.log(data);

                if (response.ok && data.onboardingUrl) {
                     showToast('Redirecting to Stripe setup...', 'success');
                     // Redirect to Stripe Onboarding
                     window.location.href = data.onboardingUrl;
                     return; 
                } else if (!response.ok) {
                    throw new Error(data.error || 'Failed to create admin');
                }
            }
        } catch (error) {
            console.error(error);
            showToast(error.message || 'An error occurred', 'error');
        } finally {
            hideLoader();
        }
    };
    async function UpdateSubmitHandler() {
        showLoader();
        try {
            console.log("Updating admin:", formData);
            const response = await fetch(`http://localhost:8001/settings/updateProfileWithID/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log("data:", data);
            setTimeout(() => {
                showToast('Admin updated successfully', 'success');
                 navigate('/admin/university-admins');
            }, 1000);
        } catch (error) {
            console.error(error);
            showToast(error.message || 'An error occurred', 'error');
        } finally {
            hideLoader();
        }
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    {isEditMode ? <FiEdit /> : <FiUserPlus />}
                    {isEditMode ? 'Edit University Admin' : 'Add University Admin'}
                </h1>
                <Link to="/admin/university-admins" className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                    <FiChevronLeft /> Back
                </Link>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto space-y-6">
                {/* Personal Information */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold border-b pb-2 mb-4">Personal & Login Information</legend>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput id="fullName" name="fullName" label="Full Name" required value={formData.fullName} onChange={handleChange} />
                        <FormInput id="email" name="email" label="Email Address" type="email" required value={formData.email} onChange={handleChange} />
                        {/* Only show password field for new users, or in a separate "reset password" flow */}
                        {!isEditMode && (
                            <div className="relative">
                                <FormInput
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-9 text-gray-500 hover:text-teal-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        )}
                        <FormInput id="phoneNumber" name="phoneNumber" label="Phone Number" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                </fieldset>

                {/* Address Information (condensed for brevity, but you'd add all fields) */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold border-b pb-2 mb-4">Address Information</legend>
                    <FormInput id="address" name="address" label="Street Address" value={formData.address} onChange={handleChange} />
                    {/* ... other address fields ... */}
                </fieldset>
                {/* --- DYNAMIC BUTTONS --- */}
                <div className="pt-4 flex justify-end gap-3">
                    {isEditMode ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? <><FaSpinner className="animate-spin" /> Deleting...</> : 'Delete Admin'}
                            </button>
                            <button
                                type="button"
                                onClick={UpdateSubmitHandler}
                                className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? <><FaSpinner className="animate-spin" /> Updating...</> : 'Update Admin'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="submit"
                            className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <><FaSpinner className="animate-spin" /> Creating...</> : 'Create Admin'}
                        </button>
                    )}
                </div>
            </form>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete University Admin"
                message={`Are you sure you want to delete this admin? This action is permanent.`}
            />
        </div>
    );
};

export default UniversityAdminFormPage;