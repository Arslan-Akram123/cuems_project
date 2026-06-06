// src/pages/admin/EditUniversityAdminPage.jsx
import { Link, useParams } from 'react-router-dom';
import { FiChevronLeft, FiUser } from 'react-icons/fi';

// Same mock data from the view page
const mockUniAdmins = [
    { id: 1, fullName: 'Dr. Ali Khan', email: 'ali.khan@fast.edu.pk', university: 'Fast University Lahore', walletId: 'wallet_abc123', phoneNumber: '03001234567', address: '123 Main St', city: 'Lahore', province: 'Punjab', postalCode: '54000', country: 'Pakistan' },
    // ... other admins
];

const EditUniversityAdminPage = () => {
    const { adminId } = useParams();
    const adminToEdit = mockUniAdmins.find(a => a.id === parseInt(adminId));

    if (!adminToEdit) return <div>Admin not found</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><FiUser /> Edit University Admin</h1>
                <Link to="/admin/university-admins" className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"><FiChevronLeft /> Back</Link>
            </div>
            {/* Form is identical to Create form, but with defaultValue props */}
            <form className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto space-y-6">
                 {/* Personal Info */}
                <fieldset className="space-y-4">
                    {/* ... fields with defaultValue={adminToEdit.fullName}, etc. ... */}
                </fieldset>
                {/* Address Info */}
                 <fieldset className="space-y-4">
                    {/* ... fields with defaultValue={adminToEdit.address}, etc. ... */}
                </fieldset>
                {/* Assignment */}
                 <fieldset>
                     {/* ... select with defaultValue={adminToEdit.university} ... */}
                </fieldset>
                <div className="text-right">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-teal-700">Update Admin</button>
                </div>
            </form>
        </div>
    );
};

export default EditUniversityAdminPage;