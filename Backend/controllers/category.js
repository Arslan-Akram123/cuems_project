const { message } = require('statuses');
const Category = require('../models/category');

function validateNameAndDescription(req) {
    const { name, description } = req.body;
    const errors = [];

    // Name validation
    if (!name || name.trim() === '') {
        errors.push({
            field: 'name',
            message: 'Name is required'
        });
    } else {
        const trimmedName = name.trim();
        
        if (trimmedName.length < 2) {
            errors.push({
                field: 'name',
                message: 'Name must be at least 2 characters long'
            });
        } else if (trimmedName.length > 25) {
            errors.push({
                field: 'name',
                message: 'Name cannot exceed 25 characters'
            });
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            errors.push({
                field: 'name',
                message: 'Name can only contain letters and spaces'
            });
        }
    }

    // Description validation
    if (!description || description.trim() === '') {
        errors.push({
            field: 'description',
            message: 'Description is required'
        });
    } else {
        const trimmedDescription = description.trim();
        
        if (trimmedDescription.length < 10) {
            errors.push({
                field: 'description',
                message: 'Description must be at least 10 characters long'
            });
        } else if (trimmedDescription.length > 2000) {
            errors.push({
                field: 'description',
                message: 'Description cannot exceed 2000 characters'
            });
        }
    }

    return errors;
}
async function addCategory(req, res) {
    const { name, description } = req.body;
   const validationErrors = validateNameAndDescription(req);
        
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }
    // if (!name || !description) {
    //     return res.status(400).json({success: false,
    //          type: "error",
    //          message: 'Name and description are required' });
    // }
    const existingCategory = await Category.find();
    if (existingCategory.some(category => category.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({  success: false,
                        type: "error",
                        message: "Category name already exists"});
    }
    
    try {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        const category = new Category({name: trimmedName, description:trimmedDescription });
        await category.save();
        res.status(201).json({success: true,
             type: "success",
             message: "Category added successfully"});
    } catch (err) {
       
        res.status(500).json({
             success: false,
             type: "error",
             message: 'Internal server error' });
    }
}

async function getAllCategories(req, res) {
    try {
        const categories = await Category.find().populate('createdBy', 'fullName');
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCategory(req, res) {
    const { id } = req.params;
    const validationErrors = validateNameAndDescription(req);
        
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function deleteCategory(req, res) {
   
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCategoryById(req, res) {
    const { id } = req.params;
    try {
        const category = await Category.findById(id).populate('createdBy', 'fullName');
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        console.error('Error fetching category by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryById
};