// src/pages/admin/EditEventPage.jsx

import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiUpload, FiEdit } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const FormInput = ({ label, id, type = "text", placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full border-teal-500 rounded-md shadow-sm focus:border-teal-500 py-2 px-2 border-1  focus:outline-teal-500 focus:ring-teal-500"
            {...(type === "number" ? { min: 0 } : {})} // Add min=0 if type is number
        />
    </div>
);

const EditEventPage = () => {
    const { eventId } = useParams();
    console.log(eventId);
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [eventData, setEventData] = useState({
        name: '',
        location: '',
        totalSubscribers: '',
        price: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        category: '',
        reservedSeats: 0,
        bookings: 0,
        description: '',
        status: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // Helper to format date to YYYY-MM-DD
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            // Get YYYY-MM-DD
            return d.toISOString().slice(0, 10);
        };
        fetch(`http://localhost:8001/events/getEvent/${eventId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setEventData({
                    name: data.name || '',
                    location: data.location || '',
                    totalSubscribers: data.totalSubscribers + data.reservedSeats + data.bookings || '',
                    price: data.price || '',
                    startDate: formatDate(data.startDate),
                    endDate: formatDate(data.endDate),
                    startTime: data.startTime || '',
                    endTime: data.endTime || '',
                    category: data.category || '',
                    reservedSeats: data.reservedSeats || 0,
                    bookings: data.bookings || 0,
                    description: data.description || '',
                    status: data.status || '',
                    image: null
                });
                if (data.image) {
                    setImagePreview(data.image);
                }
            })
            .catch(err => {
                showToast('Failed to fetch event data.', 'error');
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:8001/category/getCategories', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEventData(prev => ({ ...prev, image: file }));
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       showLoader();
        const startDate = eventData.startDate ? new Date(eventData.startDate) : null;
        const endDate = eventData.endDate ? new Date(eventData.endDate) : null;
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
        // Validation: end time > start time (if same date)
        if (startDate && endDate && eventData.startTime && eventData.endTime && endDate.getTime() === startDate.getTime()) {
            // Parse times as minutes since midnight
            const [sh, sm] = eventData.startTime.split(':').map(Number);
            const [eh, em] = eventData.endTime.split(':').map(Number);
            const startMinutes = sh * 60 + (sm || 0);
            const endMinutes = eh * 60 + (em || 0);
            if (endMinutes <= startMinutes) {
                showToast('End time must be greater than start time for the same date.', 'error');
                hideLoader();
                return;
            }
        }

        let imageUrl = eventData.image; // Keep existing if no new upload

        // Upload new image if present
        if (eventData.image instanceof File) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', eventData.image);

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

        // Now update event
        const updatePayload = {
            ...eventData,
            image: imageUrl
        };

        try {
            const response = await fetch(`http://localhost:8001/events/updateEvent/${eventId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Event updated successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/events');
                }, 1500);
            } else {
                showToast('Failed to update event.', 'error');
            }
        } catch (error) {
            showToast('Network error. Try again.', 'error');
        }finally{
            hideLoader();
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8001/events/deleteEvent/${eventId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Event deleted successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/events');
                }, 1500);
            } else {
                showToast(result.message || 'Failed to delete event.', 'error');
            }
        } catch (error) {
            showToast('Network error. Try again.', 'error');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiEdit /> Edit Event
                </h1>
                <Link
                    to="/admin/events"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>

           

            <form className="bg-white p-8 rounded-lg shadow-md space-y-8" onSubmit={handleSubmit}>
                {/* Basic Info & Image */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <FormInput label="Name" id="name" value={eventData.name} onChange={handleInputChange} />
                        <FormInput label="Location" id="location" value={eventData.location} onChange={handleInputChange} />
                        <FormInput label="Total Subscribers" id="totalSubscribers" type="number" min="0" value={eventData.totalSubscribers} onChange={handleInputChange} />
                        <FormInput label="Price" id="price" type="number" min="0" value={eventData.price} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500">
                                    <span>Upload an image</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 mx-auto max-h-32 rounded" />
                                )}
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Date and Time Zone</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput label="Start Date" id="startDate" type="date" value={eventData.startDate} onChange={handleInputChange} />
                        <FormInput label="End Date" id="endDate" type="date" value={eventData.endDate} onChange={handleInputChange} />
                        <FormInput label="Start Time" id="startTime" type="time" value={eventData.startTime} onChange={handleInputChange} />
                        <FormInput label="End Time" id="endTime" type="time" value={eventData.endTime} onChange={handleInputChange} />
                    </div>
                </div>

                {/* Category and Description */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select id="category" name="category" value={eventData.category} onChange={handleInputChange} className="w-full border-1 py-2 px-2  focus:outline-teal-500 border-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                        <option value="">Select Category</option>
                        {categories && categories.length > 0 && categories.map(cat => (
                            <option key={cat._id || cat.id || cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" rows={4} className="w-full py-2 px-2 border-1  focus:outline-teal-500 border-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" value={eventData.description} onChange={handleInputChange}></textarea>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600" onClick={handleDelete}>
                       {loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Deleting... </span>):(<span> Delete Event</span>)}
                    </button>
                    <button type="submit" className={`bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 ${eventData.status === "completeds" ? "opacity-50 cursor-not-allowed" : ""}`}

                    >
                        {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update Event</span>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEventPage;