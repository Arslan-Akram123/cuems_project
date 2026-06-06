// src/pages/admin/AdminUniversitiesPage.jsx
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
const AdminUniversitiesPage = () => {
    const [mockUniversities, setMockUniversities] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/universities/getUniversities',{credentials: 'include'})
            .then(response => response.json())
            .then(data => setMockUniversities(data))
            .catch(error => console.error('Error fetching universities:', error)).finally(hideLoader);
    }, []);
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Universities</h1>
                <Link 
                    to="/admin/universities/create" // Changed from "#" to the correct path
                    className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600"
                >
                    <FiPlus /> Add New
                </Link>
            </div>
      
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4"> Universities Information</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Descriptions</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Short Name</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {isLoading ? <tr><td colSpan="6" className="py-4 px-4 text-center"><Loader /></td></tr>:
                            mockUniversities.length > 0 ? mockUniversities.map((uni, index) => (
                                <tr key={uni._id}>
                                    <td className="py-4 px-4">{index + 1}</td>
                                    <td className="py-4 px-4 font-semibold">{uni.name}</td>
                                    <td className="py-4 px-4 max-w-sm truncate">{uni.description}</td>
                                    <td className="py-4 px-4 font-mono">{uni.shortName}</td>
                                    <td className="py-4 px-4">
                                        <img src={uni.logo} alt={uni.name} className="h-12 w-12 object-contain rounded-md" />
                                    </td>
                                   <td className="py-4 px-4">
                                    <Link 
                                        to={`/admin/universities/edit/${uni._id}`}
                                        className="bg-teal-600 text-white flex items-center gap-2 py-1 px-3 rounded-md hover:bg-teal-700">
                                        <FiEdit size={14} /> Manage
                                     </Link>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="6" className="py-4 px-4 text-center">No Universities found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUniversitiesPage;