// src/pages/admin/AdminCommentsPage.jsx
import { FiSearch, FiStar } from 'react-icons/fi';
import { useState, useEffect, use } from 'react';
import { useLoader } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';
const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
        <FiStar
            key={index}
            className={`inline-block h-4 w-4 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
        />
    ));
};

const AdminCommentsPage = () => {
    const {showToast} = useToast();
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredComments, setFilteredComments] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();
    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/comments/getAllComments', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            setComments(Array.isArray(data) ? data : []);
            setFilteredComments(Array.isArray(data) ? data : []);
          })
          .catch(() => {
            setComments([]);
            setFilteredComments([]);
          })
          .finally(hideLoader);
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredComments(comments);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredComments(
                comments.filter(item =>
                    (item.event?.name?.toLowerCase().includes(term) || "") ||
                    (item.user?.fullName?.toLowerCase().includes(term) || "")
                )
            );
        }
    }, [searchTerm, comments]);


    const handleDeleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            fetch(`http://localhost:8001/comments/deleteComment/${commentId}`,
                { method: 'DELETE',
                 credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Comment deleted successfully") {
                        showToast("Comment deleted successfully!", 'success');
                        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
                        setFilteredComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
                    }
                })
                .catch(err => {
                    showToast("Error deleting comment!", 'error');
                    console.error(err)
                });
        }
    };
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">New Comments</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="sm:text-xl font-semibold text-gray-700 hidden sm:block">Information Comments</h2>
                <div className="relative w-full sm:w-1/3">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by event or user..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            {/* Comments Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ratings-5/5</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                      {isLoading ?(
                        <tr>
                            <td colSpan="7" className="text-center py-6 text-gray-500"><Loader/></td>

                        </tr>
                            ):(
                                  filteredComments.length > 0 ? (
                            filteredComments.map((item, index) => (
                                <tr key={item?._id}>
                                    <td className="py-4 px-4">{index + 1}</td>
                                    <td className="py-4 px-4 max-w-xs truncate">{item?.comment}</td>
                                    <td className="py-4 px-4">{item.user?.fullName}</td>
                                    <td className="py-4 px-4">{item.event?.name}</td>
                                    <td className="py-4 px-4">{renderStars(item?.rating)}</td>
                                    <td className="py-4 px-4">{item.createdAt ? new Date(item?.createdAt).toLocaleDateString() : ''}</td>
                                    <td className="py-4 px-4">
                                        <button 
                                        onClick={() => handleDeleteComment(item?._id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 px-4 text-center text-red-500 font-semibold">No comment found</td>
                            </tr>
                        )
                            )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {/* <div className="flex justify-between items-center mt-4 text-sm">
                <p className="text-gray-600">Showing 1 to {comments.length} of {comments.length} entries</p>
                <div className="flex items-center">
                    <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">«</button>
                    <button className="px-3 py-1 border rounded-md bg-teal-500 text-white mx-1">1</button>
                    <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">»</button>
                </div>
            </div> */}
        </div>
    </div>
  );
};

export default AdminCommentsPage;