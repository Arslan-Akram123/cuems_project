// src/pages/admin/AdminSettingsPage.jsx
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiSettings } from 'react-icons/fi';

// import Logo from '../../components/Logo';
import { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext/ProfileContext';
import { useLoader } from '../../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
const AdminSettingsPage = () => {
    const { siteSetting, fetchSiteSettingData, setSiteSetting } = useProfile();
    const [siteCloseMessage, setSiteCloseMessage] = useState('');
    // const [message, setMessage] = useState(null);
    // const [messageType, setMessageType] = useState('');
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const {showLoader, hideLoader,isLoading} = useLoader();
    const {showToast} = useToast();
    useEffect(() => {
        fetchSiteSettingData();
    }, []);

    // Sync siteCloseMessage with DB value when siteSetting changes
    useEffect(() => {
        setSiteCloseMessage(siteSetting.siteCloseMessage || '');
    }, [siteSetting.siteCloseMessage]);

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'siteCloseMessage') {
            setSiteCloseMessage(value);
        } else {
            setSiteSetting(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle file input changes
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        setMainImageFile(file);
        if (file) {
            setMainImagePreview(URL.createObjectURL(file));
        } else {
            setMainImagePreview(null);
        }
    };
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoFile(file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoPreview(null);
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        let uploadedUrls = {};

        // Upload images if present
        if (mainImageFile || logoFile) {
            const uploadFormData = new FormData();
            if (mainImageFile) uploadFormData.append('siteMainImage', mainImageFile);
            if (logoFile) uploadFormData.append('siteLogo', logoFile);

            try {
                const uploadResponse = await fetch('http://localhost:8001/upload/multiple', {
                    method: 'POST',
                    credentials: 'include',
                    body: uploadFormData
                });
                if (uploadResponse.ok) {
                    uploadedUrls = await uploadResponse.json();
                } else {
                    throw new Error('Failed to upload images');
                }
            } catch (error) {
                showToast('Failed to upload images', 'error');
                hideLoader();
                return;
            }
        }

        // Now update site settings
        const updateData = {};
        // Add all text fields
        Object.entries(siteSetting).forEach(([key, value]) => {
            if (key !== 'siteMainImage' && key !== 'siteLogo' && key !== 'siteCloseMessage') {
                updateData[key] = value;
            }
        });
        // Add siteCloseMessage separately
        updateData.siteCloseMessage = siteCloseMessage;
        // Add URLs if uploaded
        if (uploadedUrls.siteMainImage) updateData.siteMainImage = uploadedUrls.siteMainImage;
        if (uploadedUrls.siteLogo) updateData.siteLogo = uploadedUrls.siteLogo;

        try {
            const response = await fetch('http://localhost:8001/siteSettings/updateSiteSetting', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Settings updated successfully!', 'success');
                setSiteSetting(result);
            } else {
                showToast(result.message || 'Failed to update settings.', 'error');
            }
        } catch (error) {
            showToast('Network error. Try again.', 'error');
        } finally {
            hideLoader();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiSettings /> Software Settings
                </h1>
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                    <FiChevronLeft /> Back
                </Link>
            </div>

            {/* {message && (
                <div className={`mb-4 p-3 rounded text-center font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )} */}

            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Site Basic Details */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Site Basic Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteEmail" className="block text-sm font-medium text-gray-700">Site Email</label>
                            <input type="text" name="siteEmail" required id="siteEmail" value={siteSetting.siteEmail} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="sitePhone" className="block text-sm font-medium text-gray-700">Site Phone</label>
                            <input type="text" name="sitePhone" required id="sitePhone" value={siteSetting.sitePhone} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="siteAddress" className="block text-sm font-medium text-gray-700">Site Address</label>
                            <input type="text" name="siteAddress" required id="siteAddress" value={siteSetting.siteAddress} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                    </div>
                </div>

                {/* Social Details */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Social Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tiwitterLink" className="block text-sm font-medium text-gray-700">Twitter</label>
                            <input type="text" name="tiwitterLink" required id="tiwitterLink" value={siteSetting.tiwitterLink} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="facebookLink" className="block text-sm font-medium text-gray-700">Facebook</label>
                            <input type="text" name="facebookLink" required id="facebookLink" value={siteSetting.facebookLink} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700">Instagram</label>
                            <input type="text" name="instagramLink" required id="instagramLink" value={siteSetting.instagramLink} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                    </div>
                </div>

                {/* Images & Logos */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Images & Logos</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Main Image</label>
                            <div className="w-full mb-2 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                                {mainImagePreview ? (
                                    <img src={mainImagePreview} alt="Preview Main Site" className="max-h-full max-w-full rounded-md" />
                                ) : siteSetting.siteMainImage ? (
                                    <img src={siteSetting.siteMainImage} alt="Main Site" className="max-h-full max-w-full rounded-md" />
                                ) : (
                                    <span className="text-gray-400">No image</span>
                                )}
                            </div>
                            <input type="file" accept="image/*" className="mt-2 text-sm font-medium text-teal-600 px-2 py-2 border-1 border-teal-500 rounded-md w-full" onChange={handleMainImageChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
                            <div className="w-full mb-2 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview Site Logo" className="max-h-full max-w-full rounded-md" />
                                ) : siteSetting.siteLogo ? (
                                    <img src={siteSetting.siteLogo} alt="Site Logo" className="max-h-full max-w-full rounded-md" />
                                ) : (
                                    // <Logo/>
                                    <span className="text-gray-400">No image</span>
                                )}
                            </div>
                            <input type="file" accept="image/*" className="mt-2 text-sm font-medium text-teal-600 px-2 py-2 border-1 border-teal-500 rounded-md w-full" onChange={handleLogoChange} />
                        </div>
                    </div>
                </div>

                {/* Site Status & Description */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Site Status & Description</h2>
                    <div className="">
                        <div>
                            <label htmlFor="siteCloseMessage" className="block text-sm font-medium text-gray-700">Site Close Message</label>
                            <input
                                type="text"
                                name="siteCloseMessage"
                                id="siteCloseMessage"
                                value={siteCloseMessage}
                                onChange={handleInputChange}
                                className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Site Description</label>
                            <textarea name="description" id="description" required rows={3} className="mt-1 w-full border-teal-500 focus:outline-teal-500 rounded-md px-2 py-2 border-1" value={siteSetting.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <label htmlFor="footerText" className="block text-sm font-medium text-gray-700">Footer Text</label>
                            <input type="text" name="footerText" required id="footerText" value={siteSetting.footerText} onChange={handleInputChange} className="mt-1 w-full border-teal-500 px-2 py-2 border-1 focus:outline-teal-500 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700">
                       {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Updating... </span>):(<span> Update Setting</span>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;