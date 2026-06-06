// src/pages/admin/EditUniversityPage.jsx
import { Link, useParams } from 'react-router-dom';
import { FiChevronLeft, FiHome } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const EditUniversityPage = () => {
    const { universityId } = useParams();
    const [universityToEdit, setUniversityToEdit] = useState({
        name: '',
        shortName: '',
        description: '',
        logo: null
    });
    const navigate = useNavigate();
    const {showLoader, hideLoader,isLoading} = useLoader();
    const {showToast} = useToast();
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUniversityToEdit({ ...universityToEdit, [name]: value });
    };
    const handleLogoChange = (e) => {
        setUniversityToEdit({ ...universityToEdit, logo: e.target.files[0] });
    };
    useEffect(() => {
        fetch(`http://localhost:8001/universities/getUniversity/${universityId}`,{credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                setUniversityToEdit(data);
            })
            .catch((error) => {
                console.error('Error fetching university data:', error);
            });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        let logoUrl = universityToEdit.logo; // Keep existing if no new upload

        // Upload new logo if present
        if (universityToEdit.logo instanceof File) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', universityToEdit.logo);

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

        // Now update university
        const updatePayload = {
            name: universityToEdit.name,
            shortName: universityToEdit.shortName,
            description: universityToEdit.description,
            logo: logoUrl
        };

        try {
            const response = await fetch(`http://localhost:8001/universities/updateUniversity/${universityId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });
            const result = await response.json();
            if (response.ok) {
                showToast(result.message || 'University updated successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/universities');
                }, 1500);
            } else {
                showToast(result.error || 'Failed to update university.', 'error');
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
            const response = await fetch(`http://localhost:8001/universities/deleteUniversity/${universityId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                showToast(result.message || 'University deleted successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/universities');
                }, 1500);
            } else {
                showToast(result.message || 'Failed to delete university.', 'error');
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
                    <FiHome /> Edit University
                </h1>
                <Link
                    to="/admin/universities"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>

           

            <form className="bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                    <input type="text" id="name"
                    name='name'
                     value={universityToEdit.name}
                     onChange={handleInputChange}
                      className="w-full px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label htmlFor="shortName" className="block text-sm font-medium text-gray-700 mb-1">Short Name (e.g., 'mul', 'ucp')</label>
                    <input type="text" id="shortName"
                    name='shortName'
                     value={universityToEdit.shortName}
                     onChange={handleInputChange}
                      className="w-full px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 rounded-md shadow-sm"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name='description' rows={4} value={universityToEdit.description}
                     onChange={handleInputChange} className="w-full px-2 py-2 border-1  focus:outline-teal-500 border-teal-500 rounded-md shadow-sm"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Logo</label>
                    <img src={universityToEdit.logo} alt="Current Logo" className="h-20 w-20 object-contain rounded-md bg-gray-100 p-1"/>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mt-4">Upload New Logo</label>
                    <input type="file" accept="image/*" id="logo" name='logo'
                     onChange={handleLogoChange}
                     className="mt-1 border-1 border-teal-500 rounded-2xl block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700  focus:outline-teal-500 hover:file:bg-teal-100"/>
                </div>
                <div className="flex justify-end gap-3">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700">
                        {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update University</span>)}
                    </button>
                     <button type="button" onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-red-700">
                        {loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Deleting... </span>):(<span>Delete University</span>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUniversityPage;