import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiUpload, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { jwtDecode } from 'jwt-decode';

const getAuth = () => {
    const localtoken = localStorage.getItem('token');
    if (!localtoken) return { role: null };
    try {
        const decoded = jwtDecode(localtoken);
        return { role: decoded.role };
    } catch {
        return { role: null };
    }
};

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { role } = getAuth();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        totalSubscribers: '',
        price: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        category: '',
        description: '',
    });
   const {showLoader, hideLoader,isLoading} = useLoader();
   const {showToast} = useToast();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [mockCategories, setmockCategories] = useState([]);
    const [walletStatus, setWalletStatus] = useState(null);

    useEffect(() => {
        const fetchWalletStatus = async () => {
            try {
                const response = await fetch('http://localhost:8001/settings/getSubadminwithWallet', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setWalletStatus(data.wallet ? data.wallet.status : 'missing');
                } else {
                    setWalletStatus('missing');
                }
            } catch (err) {
                console.error('Error fetching wallet status:', err);
                setWalletStatus('error');
            }
        };
        fetchWalletStatus();
        fetch('http://localhost:8001/category/getCategories', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setmockCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();

        // Validation: start date >= current date AND end date >= start date
        const startDate = formData.startDate ? new Date(formData.startDate) : null;
        const endDate = formData.endDate ? new Date(formData.endDate) : null;
        const currentDate = new Date();

        // Reset time part for accurate date comparison (optional)
        currentDate.setHours(0, 0, 0, 0);
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(0, 0, 0, 0);

        if (startDate && startDate < currentDate) {
            showToast('Start date must be equal to or greater than today.', 'error');
            hideLoader();
            return;
        }

        if (startDate && endDate && endDate < startDate) {
            showToast('End date must be equal to or greater than start date.', 'error');
            hideLoader();
            return;
        }

        if (startDate && endDate && formData.startTime && formData.endTime && endDate.getTime() === startDate.getTime()) {

            const [sh, sm] = formData.startTime.split(':').map(Number);
            const [eh, em] = formData.endTime.split(':').map(Number);
            const startMinutes = sh * 60 + (sm || 0);
            const endMinutes = eh * 60 + (em || 0);
            if (endMinutes <= startMinutes) {
                showToast('End time must be greater than start time for the same date.', 'error');
                hideLoader();
                return;
            }
        }

        let imageUrl = null;

        // Upload image if present
        if (imageFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', imageFile);

            try {
                const uploadResponse = await fetch('http://localhost:8001/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: uploadFormData
                });
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    imageUrl = uploadResult.url;
                } else {
                    throw new Error('Failed to upload image');
                }
            } catch (error) {
                showToast('Failed to upload image', 'error');
                hideLoader();
                return;
            }
        }

        // Now create event
        const eventPayload = {
            ...formData,
            image: imageUrl
        };

        try {
            const response = await fetch('http://localhost:8001/events/createEvent', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventPayload),
            });
            if (response.ok) {
                showToast('Event created successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/events');
                }, 1500);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                showToast(errorData.error || 'Failed to create event.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast('Something went wrong.', 'error');
        }finally{
            hideLoader();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiPlus /> Create Event
                </h1>
                <Link to="/admin/events" className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    <FiChevronLeft /> Back
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
                {role === 'subAdmin' && walletStatus !== 'active' && walletStatus !== null && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
                        <div className="flex items-center gap-4">
                            <FiAlertTriangle className="text-red-500 text-3xl flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-red-800">Wallet Action Required</h3>
                                <p className="text-red-700">
                                    {walletStatus === 'missing' 
                                        ? "You haven't created a wallet yet. You must have an active wallet to create and sell event tickets." 
                                        : "Your wallet is currently pending or restricted. Please complete your Stripe onboarding to activate it."}
                                </p>
                                <Link 
                                    to="/admin/wallet" 
                                    className="inline-block mt-3 bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
                                >
                                    Go to Wallet Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`grid md:grid-cols-3 gap-8 ${role === 'subAdmin' && walletStatus !== 'active' && walletStatus !== null ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="md:col-span-2 space-y-6">
                        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                        <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
                        <InputField label="Total Subscribers" name="totalSubscribers" type="number" min="0" value={formData.totalSubscribers} onChange={handleChange} />
                        <InputField label="Price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500">
                                    <span>Upload an image</span>
                                    <input id="file-upload" type="file" required accept="image/*" className="sr-only" onChange={handleImageChange} />
                                </label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 mx-auto max-h-32 rounded" />
                                )}
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`space-y-8 ${role === 'subAdmin' && walletStatus !== 'active' && walletStatus !== null ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Date and Time</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                            <InputField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                            <InputField label="Start Time" name="startTime" type="time" value={formData.startTime} onChange={handleChange} />
                            <InputField label="End Time" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            required
                            onChange={handleChange}
                            className="w-full border-teal-500 py-2 px-2 rounded-md shadow-sm border-1 focus:outline-teal-500 focus:border-teal-500 focus:ring-teal-500"
                        >
                            <option value="">Select Category</option>
                            {mockCategories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            required
                            onChange={handleChange}
                            className="w-full border-1 py-2 px-2 border-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:outline-teal-500 focus:ring-teal-500"
                            placeholder="Write a brief description..."
                        ></textarea>
                    </div>

                    <div className="text-right">
                        <button 
                            type="submit" 
                            disabled={role === 'subAdmin' && walletStatus !== 'active'}
                            className={`bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors ${role === 'subAdmin' && walletStatus !== 'active' ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                           {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Saving... </span>):(<span> Save Event</span>)}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const InputField = ({ label, name, type = "text", value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            required
            onChange={onChange}
            className="w-full border-teal-500 focus:outline-teal-500 px-2 py-2 border-1 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            {...(type === "number" ? { min: 0 } : {})}
        />
    </div>
);

export default CreateEventPage;
