// src/pages/admin/CreateCategoryPage.jsx
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiTag } from 'react-icons/fi';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const CreateCategoryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const {showLoader, hideLoader,isLoading} = useLoader();
    const {showToast} = useToast();
  const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showLoader();
        fetch('http://localhost:8001/category/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                showToast(data.message || 'Category created successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/categories');
                }, 1500);
            } else {
                showToast(data.message || 'Failed to create category.', 'error');
            }
        })
        .catch(error => {
            showToast(error ||'Network error. Try again.', 'error');
        }).finally(() => {
            hideLoader();
        });
    };
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FiTag /> Create Category
            </h1>
            <Link
                to="/admin/categories"
                className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
            >
                <FiChevronLeft /> Back
            </Link>
        </div>
        
        <form className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Enter Information</h2>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" id="name" name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                     placeholder="Enter Category Name" className="w-full border-1 py-2 px-2 border-teal-500 rounded-md  focus:outline-teal-500 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea id="description" name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                     rows={4} placeholder="Enter your Description here..." className="w-full border-1 py-2 px-2 border-teal-500  focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
                </div>
                <div className="text-right">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700">
                        {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Adding... </span>):(<span>Add Category</span>)}
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default CreateCategoryPage;