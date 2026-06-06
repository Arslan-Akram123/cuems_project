const express = require('express');
const Router = express.Router();
const { addCategory, getAllCategories, updateCategory, deleteCategory,getCategoryById } = require('../controllers/category');

Router.post('/addCategory', addCategory);
Router.get('/getCategories', getAllCategories);
Router.get('/getCategory/:id', getCategoryById);
Router.put('/updateCategory/:id', updateCategory);
Router.delete('/deleteCategory/:id', deleteCategory);

module.exports = Router;