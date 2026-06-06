// src/pages/admin/AdminNoticesPage.jsx
import { FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const AdminNoticesPage = () => {
    const [notice, setNotice] = useState({
        title: '',
        description: ''
    });
    const {showToast} = useToast();
    const {showLoader, hideLoader,isLoading} = useLoader();
    const handleNoticeSubmit = (e) => {
        e.preventDefault();
        showLoader();
        fetch('http://localhost:8001/notices/addNotice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(notice)
        }).then(response => {
            if (response.ok) {
                console.log(response.json());
                showToast('Notice added successfully.', 'success');
                setNotice({ title: '', description: '' });
            } else {
                const responseData = response.json();
                responseData.then(data => {
                     showToast(data.message || 'Error adding notice.', 'error');
                });
               
            }
        }).catch(() => {
            showToast('Network error. Try again.', 'error');
        }).finally(() => {
            hideLoader();
        });
    };
   
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiBell /> Create Notice
                </h1>
                
            </div>
            <form className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto" onSubmit={handleNoticeSubmit}>
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Enter Information</h2>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="title" name="title"
                            value={notice.title}
                            onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                            required
                            placeholder="Enter Notice Title" className="w-full px-2 py-2 border-1 border-teal-500 rounded-md shadow-sm  focus:outline-teal-500 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description"
                            value={notice.description}
                            onChange={(e) => setNotice({ ...notice, description: e.target.value })}
                            required
                            rows={6} placeholder="Enter your Description here..." className="w-full border-teal-500 px-2 py-2 border-1 rounded-md shadow-sm focus:border-teal-500 focus:outline-teal-500 focus:ring-teal-500"></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700">
                           {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Sending... </span>):(<span> Send Notice</span>)}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminNoticesPage;