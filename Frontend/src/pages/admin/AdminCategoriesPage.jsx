// src/pages/admin/AdminCategoriesPage.jsx
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
const AdminCategoriesPage = () => {
    const [mockCategories, setmockCategories] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
      showLoader();
        fetch('http://localhost:8001/category/getCategories',{ credentials: 'include',})
            .then(response => response.json())
            .then(data => {
                setmockCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            }).finally(hideLoader);
    }, []);

    
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Categories</h1>
        <Link 
          to="/admin/categories/create"
          className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-2 sm:px-4 rounded-lg hover:bg-teal-600"
        >
          <FiPlus /> Create New
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Information Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Manage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {isLoading ?<tr><td colSpan="4" className="py-4 px-4 text-center"><Loader /></td></tr>:
              mockCategories.length >0 ? mockCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td className="py-4 px-4">{index + 1}</td>
                  <td className="py-4 px-4 font-semibold">{cat.name}</td>
                  <td className="py-4 px-4">{cat.description}</td>
                <td className="py-4 px-4">
                  <Link 
                      to={`/admin/categories/edit/${cat._id}`}
                      className=" bg-teal-500 text-white flex items-center gap-2 py-1 px-3 rounded-md hover:bg-teal-600">
                      <FiEdit size={14} /> Manage
                  </Link>
                </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;