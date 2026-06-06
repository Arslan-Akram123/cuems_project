// src/pages/admin/EditCategoryPage.jsx
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiTag } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const EditCategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const {showLoader, hideLoader,isLoading} = useLoader();
    const {showToast} = useToast();
    const [loading, setLoading] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState({
        name: '',
        description: ''
    });

   useEffect(() => {
        fetch(`http://localhost:8001/category/getCategory/${categoryId}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                setCategoryToEdit(data);
            })
            .catch(error => {
                console.error('Error fetching category:', error);
            });
    }, []); 

    const HandleSubmit = (e) => {
        e.preventDefault();
        showLoader();
        fetch(`http://localhost:8001/category/updateCategory/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(categoryToEdit)
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                showToast(data.message || 'Category updated successfully!', 'success');
                setTimeout(() => {
                    navigate('/admin/categories');
                }, 1500);
            } else {
                showToast(data.message || 'Failed to update category.', 'error');
            }
        })
        .catch(error => {
            showToast('Network error. Try again.', 'error');
        }).finally(() => {
            hideLoader();
        })
    }
    
    async function deleteCategory(id) {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:8001/category/deleteCategory/${id}`, { 
            method: 'DELETE', 
            credentials: 'include' 
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message || 'Category deleted successfully!', 'success');
            setTimeout(() => {
                navigate('/admin/categories');
            }, 1500);
        } else {
            showToast(data.message || 'Failed to delete category.', 'error');
        }
    } catch (error) {
        showToast(`Network error. Try again. ${error.message}`, 'error');
    }finally {
        setLoading(false);
    }
}
    

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiTag /> Edit Category
                </h1>
                <Link
                    to="/admin/categories"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>
            
            <form className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto" onSubmit={HandleSubmit}>
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Edit Information</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="name" name="name" 
                        value={categoryToEdit.name}
                        onChange={(e) => setCategoryToEdit({ ...categoryToEdit, name: e.target.value })}
                        required
                         className="w-full py-2 px-2 border-1 border-teal-500 rounded-md  focus:outline-teal-500 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" rows={4} 
                        value={categoryToEdit.description}
                        onChange={(e) => setCategoryToEdit({ ...categoryToEdit, description: e.target.value })}
                        required
                         className="w-full border-1 border-teal-500  focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-2"></textarea>
                    </div>
                    <div className=" flex justify-end gap-3">
                        <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">
                            {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span>Update Category</span>)}
                        </button>
                        <button type="button" onClick={() => deleteCategory(categoryId)} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                            {loading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Deleting... </span>):(<span>Delete Category</span>)}
                        </button>
                    </div>
                </div>
            </form>
           
        </div>
    );
};

export default EditCategoryPage;