import React, { useState, useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';

const AdminWalletPage = () => {
    const [wallet, setWallet] = useState(null);
    const [showTerms, setShowTerms] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const { showLoader, hideLoader, isLoading } = useLoader();
    const { showToast } = useToast();

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        showLoader();
        try {
            const response = await fetch('http://localhost:8001/settings/getSubadminwithWallet', {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setWallet(data.wallet);
            } else {
                showToast(data.error || 'Failed to fetch wallet information', 'error');
            }
        } catch (err) {
            console.error('Error fetching wallet:', err);
            showToast('Network error while fetching wallet', 'error');
        } finally {
            hideLoader();
        }
    };

    const handleCreateWallet = async () => {
        if (!agreed) {
            showToast('Please agree to the terms and conditions', 'error');
            return;
        }
        setShowTerms(false);
        showLoader();
        try {
            const response = await fetch('http://localhost:8001/settings/createSubadminWallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok && data.onboardingUrl) {
                showToast('Redirecting to Stripe for onboarding...', 'success');
                window.location.href = data.onboardingUrl;
            } else {
                showToast(data.error || 'Failed to create wallet', 'error');
            }
        } catch (err) {
            console.error('Error creating wallet:', err);
            showToast('Network error while creating wallet', 'error');
        } finally {
            hideLoader();
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'restricted': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Wallet Management</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Your Wallet Details</h2>
                    {!wallet && !isLoading && (
                        <button
                            onClick={() => setShowTerms(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors duration-150"
                        >
                            Create Wallet
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-10 text-center"><Loader /></div>
                    ) : wallet ? (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Stripe Account ID</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                <tr>
                                    <td className="py-4 px-4 font-mono">{wallet.stripeAccountId}</td>
                                    <td className="py-4 px-4 font-semibold text-teal-600">
                                        ${(wallet.balance || 0).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(wallet.status)}`}>
                                            {wallet.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {new Date(wallet.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No wallet found. You need to create a wallet to receive payouts from tickets sold.</p>
                            <button
                                onClick={() => setShowTerms(true)}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors duration-150"
                            >
                                Get Started - Create Wallet
                            </button>
                        </div>
                    )}
                </div>
                
                {wallet && wallet.status === 'pending' && (
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                        <p className="font-semibold">Complete Onboarding</p>
                        <p className="text-sm mt-1">Your wallet is still pending. Please click the button below to complete your Stripe onboarding process if you haven't finished it.</p>
                        <button 
                            onClick={handleCreateWallet}
                            className="mt-3 text-sm font-medium underline hover:text-blue-800"
                        >
                            Continue Stripe Onboarding &rarr;
                        </button>
                    </div>
                )}
            </div>

            {/* Terms and Conditions Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Terms and Conditions</h3>
                            <div className="prose prose-sm text-gray-600 mb-6">
                                <p>By creating a wallet and connecting your Stripe account, you agree to the following terms:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li className="font-semibold text-teal-700">
                                        A 1% service charge will be applied to each booking for your events.
                                    </li>
                                    <li>Automated payouts are processed through Stripe Connect.</li>
                                    <li>You are responsible for all taxes associated with your ticket sales.</li>
                                   
                                </ul>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <input
                                    id="terms-checkbox"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms-checkbox" className="ml-2 block text-sm text-gray-900">
                                    I agree to the above terms.
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowTerms(false);
                                        setAgreed(false);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateWallet}
                                    disabled={!agreed}
                                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                                        agreed 
                                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Agree & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWalletPage;
