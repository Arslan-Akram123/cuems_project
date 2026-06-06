const express = require('express');
const { registerUser, loginUser,activationAccount,resetPassword,confirmResetPassword,Logout,universityAdminRegistrationAndWalletAssignment } = require('../controllers/user');
const Router = express.Router();


// make the same post reqest for register and logn user 
Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/reset-password',resetPassword); 
Router.get ('/activate/:id', activationAccount); 
Router.get('/confirm-reset-password/:id', confirmResetPassword);
Router.post('/logout',Logout)
Router.post('/university-admins', universityAdminRegistrationAndWalletAssignment); 

module.exports = Router;