// src/pages/admin/CreateUniversityPage.jsx
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiHome } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const CreateUniversityPage = () => {
    const [universityData, setUniversityData] = useState({
        name: '',
        description: '',
        shortName: '',
        logo: null,
    });
   const {showLoader, hideLoader,isLoading} = useLoader();
   const {showToast} = useToast();
    const navigate = useNavigate();


    // Separate handler for file input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUniversityData({ ...universityData, [name]: value });
    };

    const handleFileChange = (e) => {
        setUniversityData({ ...universityData, logo: e.target.files[0] });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
       showLoader();
        let logoUrl = null;

        // Upload logo if present
        if (universityData.logo) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', universityData.logo);

            try {
                const uploadResponse = await fetch('http://localhost:8001/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: uploadFormData
                });
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    logoUrl = uploadResult.url;
                } else {
                    throw new Error('Failed to upload logo');
                }
            } catch (error) {
                showToast('Failed to upload logo', 'error');
                hideLoader();
                return;
            }
        }

        // Now create university
        const universityPayload = {
            name: universityData.name,
            description: universityData.description,
            shortName: universityData.shortName,
            logo: logoUrl
        };

        try {
            const response = await fetch('http://localhost:8001/universities/addUniversity', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(universityPayload),
            });

            const result = await response.json();
            if (response.ok) {
                showToast('University created successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/universities');
                }, 1500);
            } else {
                showToast(result.error || 'Failed to create university.', 'error');
            }
        } catch (error) {
            console.error('Error creating university:', error);
            showToast('Network error. Try again.', 'error');
        }finally{
            hideLoader();
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiHome /> Add New University
                </h1>
                <Link
                    to="/admin/universities"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>
            <form className="bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name='name'
                        value={universityData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., University of Example"
                        className="w-full rounded-md shadow-sm px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 "
                    />
                </div>
                 <div>
                    <label htmlFor="shortName" className="block text-sm font-medium text-gray-700 mb-1">Short Name (e.g., 'mul', 'ucp')</label>
                    <input 
                        type="text" 
                        id="shortName"
                        name='shortName'
                        value={universityData.shortName}
                        onChange={handleInputChange} 
                        required
                        placeholder="A short, unique, lowercase ID"
                        className="w-full  rounded-md shadow-sm px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 "
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        id="description" 
                        name='description'
                        value={universityData.description}
                        onChange={handleInputChange}
                        required
                        rows={4} 
                        placeholder="A brief description of the university..."
                        className="w-full  rounded-md shadow-sm px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 "
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">University Logo</label>
                    <input
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full border-1 border-teal-500 rounded-md file:border-1 file:border-teal-500 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                </div>
                <div className="text-right">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700">
                       {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Adding... </span>):(<span> Add University</span>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUniversityPage;