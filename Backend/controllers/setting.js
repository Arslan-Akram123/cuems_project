const userModel = require('../models/user');
const walletSchema = require('../models/wallet');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcrypt');
const validatePakistanAddress = (req, res) => {
    const { fullName, street, country, city, state, postalCode, phoneNumber } = req.body;
    const errors = [];

    // Full Name validation
    if (!fullName || fullName.trim() === '') {
        errors.push({ field: 'fullName', message: 'Full name is required' });
    } else if (fullName.trim().length < 2 || fullName.trim().length > 100) {
        errors.push({ field: 'fullName', message: 'Full name must be between 2 and 100 characters' });
    } else if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
        errors.push({ field: 'fullName', message: 'Full name can only contain letters, spaces, apostrophes, periods, and hyphens' });
    }
  console.log("validation started");
    // Street Address validation - FIXED THE REGEX
    if (street || street.trim() !== '') {
        console.log("street");
         if (!street || street.trim() === '') {
        errors.push({ field: 'street', message: 'Street address is required' });
    } else if (street.trim().length < 5 || street.trim().length > 200) {
        errors.push({ field: 'street', message: 'Street address must be between 5 and 200 characters' });
    } else if (!/^[a-zA-Z0-9\s,.']+$/.test(street)) {
        errors.push({ field: 'street', message: 'Street address contains invalid characters' });
    }
    }

    // Country validation - Must be Pakistan
   if(country || country.trim()!==''){
    console.log("country");
        if (!country || country.trim() === '') {
        errors.push({ field: 'country', message: 'Country is required' });
    } else {
        const countryLower = country.toLowerCase();
        const validPakistanNames = ['pakistan', 'pk', 'islamic republic of pakistan', 'پاکستان'];
        
        if (!validPakistanNames.includes(countryLower)) {
            errors.push({ field: 'country', message: 'Country must be Pakistan' });
        }
    }
   }

    // City validation - Common Pakistani cities
    const validPakistaniCities = [
        'karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'multan',
        'peshawar', 'quetta', 'sialkot', 'gujranwala', 'hyderabad', 'sukkur',
        'bahawalpur', 'sargodha', 'abbottabad', 'mardan', 'mirpur', 'jhelum'
    ];

    if(city || city.trim()!==''){
        if (!city || city.trim() === '') {
        errors.push({ field: 'city', message: 'City is required' });
    } else if (!validPakistaniCities.includes(city.toLowerCase())) {
        errors.push({ field: 'city', message: 'Please enter a valid Pakistani city' });
    }
    }

    // State/Province validation - Pakistani provinces
    const validPakistaniProvinces = [
        'punjab', 'sindh', 'khyber pakhtunkhwa', 'balochistan', 
        'islamabad capital territory', 'gilgit-baltistan', 'azad kashmir'
    ];

   if(state || state.trim()!==''){
     if (!state || state.trim() === '') {
        errors.push({ field: 'state', message: 'State/Province is required' });
    } else if (!validPakistaniProvinces.includes(state.toLowerCase())) {
        errors.push({ field: 'state', message: 'Please enter a valid Pakistani province' });
    }
   }

    // Postal Code validation - Pakistan specific (5 digits)
   if(postalCode || postalCode.trim()!==''){
        if (!postalCode || postalCode.trim() === '') {
        errors.push({ field: 'postalCode', message: 'Postal code is required' });
    } else if (!/^\d{5}$/.test(postalCode)) {
        errors.push({ field: 'postalCode', message: 'Pakistani postal code must be exactly 5 digits' });
    } else {
        const postalCodeNum = parseInt(postalCode);
        if (postalCodeNum < 10000 || postalCodeNum > 99999) {
            errors.push({ field: 'postalCode', message: 'Postal code must be between 10000 and 99999' });
        }
    }
   }

    // Phone Number validation - Pakistan specific
    if (!phoneNumber || phoneNumber.trim() === '') {
        errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
    } else {
        const cleanedPhone = phoneNumber.replace(/\D/g, '');
        
        // Check if it's a valid Pakistani mobile number
        const mobileRegex = /^((\+92)|(0092)|(92)|(0))?(3[0-9]{9})$/;
        
        // Check if it's a valid Pakistani landline number
        const landlineRegex = /^((\+92)|(0092)|(92)|(0))?([1-9][0-9]{8})$/;
        
        if (!mobileRegex.test(cleanedPhone) && !landlineRegex.test(cleanedPhone)) {
            errors.push({ 
                field: 'phoneNumber', 
                message: 'Please enter a valid Pakistani phone number. Mobile: 03XXXXXXXXX, Landline: 0XXYYYYYYY' 
            });
        } else if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
            errors.push({ 
                field: 'phoneNumber', 
                message: 'Phone number must be 10-12 digits long' 
            });
        }
    }

    return errors;
};






async function addProfileData(req, res) {
    
    
    
    const { fullName,street,country,city,state,postalCode,phoneNumber,profileImage, email} = req.body;
     
    const finduser = await userModel.findById(req.user.id);

    if (!finduser) {
        return res.status(404).json({ error: 'User not found' });
    }
    const validationErrors = validatePakistanAddress(req, res);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: validationErrors[0].message
        });
    }




    // const profileImage = req.file ? req.file.filename : finduser.profileImageURL;
    
    finduser.fullName = fullName;
    finduser.address = street;
    finduser.country = country;
    finduser.city = city;
    finduser.province = state;
    finduser.postalCode = postalCode;
    finduser.phoneNumber = phoneNumber;
    finduser.email = email;
    finduser.profileImageURL = profileImage || finduser.profileImageURL; 
    try {
        const updatedUser = await finduser.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getProfileData(req, res) {
    
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function ChangePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
     console.log('Change password request received for user ID:', req.user.id);

    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                fieldErrors: { currentPassword: 'Current password is incorrect' },
                error: 'Current password is incorrect.'
            });
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if(newPassword.includes(' ')){
            return res.status(400).json({
                fieldErrors: { newPassword: 'Password should not contain spaces.' },
                error: 'Password should not contain spaces.'
            });
        }
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                fieldErrors: { newPassword: 'Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.' },
                error: 'Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.'
            });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.error('Change password error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

  async function updateProfileStatus(req, res) {
     const {userId,  role } = req.body;
    
    console.log('Update profile status request received for user ID:', userId);
    console.log('Role:', role);
   
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = role;
        await user.save();
        return res.status(200).json({ message: 'Profile status updated successfully!' });
    } catch (err) {
        console.error('Update profile status error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
 async function getAllUsers(req, res) {
    console.log('Get all users request received');
    try {
        const users = await userModel.find();
        const filteredonlyUsers = users.filter(user => user.email !=='arslanakramsoftwareengineer@gmail.com');
        console.log('Filtered Users:', filteredonlyUsers);
        res.status(200).json(filteredonlyUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllSubAdminsWithWallet(req, res) {
    console.log('Get all users request received');
    try {
        const walletswithSubAdmins = await walletSchema.find()
        .select('stripeAccountId status balance user') 
        .populate({
            path: 'user',
            select: '_id fullName email' 
        });
        console.log('Wallets with Sub Admins:', walletswithSubAdmins);
        res.status(200).json(walletswithSubAdmins);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getProfilewithID(req, res) {
    const { userId } = req.params;
    console.log('Get profile with ID request received for user ID:', userId);
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function updateProfileWithID(req, res) {
    const { userId } = req.params;
     const { fullName, email, password, phoneNumber, address } = req.body;
    console.log('Update profile with ID request received for user ID:', userId);
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        await user.save();
        return res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function deleteProfileWithID(req, res) {
    const { userId } = req.params;
    console.log('Request to delete user, wallet, and stripe account for ID:', userId);

    try {
        // 1. Find the User
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Find the associated Wallet
        const wallet = await walletSchema.findOne({ user: userId });

        if (wallet) {
            // 3. Delete the Stripe Connected Account if ID exists
            if (wallet.stripeAccountId) {
                try {
                    await stripe.accounts.del(wallet.stripeAccountId);
                    console.log(`Stripe Account ${wallet.stripeAccountId} deleted.`);
                } catch (stripeErr) {
                    // We catch the error but continue deleting from local DB 
                    // in case the account was already deleted manually in Dashboard
                    console.error('Stripe Deletion Error:', stripeErr.message);
                }
            }

            // 4. Delete Wallet from Database
            await walletSchema.deleteOne({ _id: wallet._id });
            console.log('Wallet deleted from DB');
        }

        // 5. Delete User from Database
        await userModel.findByIdAndDelete(userId);
        console.log('User deleted from DB');

        return res.status(200).json({ message: 'User, Wallet, and Stripe account deleted successfully!' });

    } catch (err) {
        console.error('Global Error deleting profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports={
    addProfileData,
    getProfileData,
    ChangePassword,
    updateProfileStatus,
    getProfilewithID,
    getAllUsers,
    getAllSubAdminsWithWallet,
    updateProfileWithID,
    deleteProfileWithID
}