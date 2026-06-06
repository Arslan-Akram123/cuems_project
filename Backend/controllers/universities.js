const universitySchema= require('../models/universities');

function validateFields(req) {
    const { name, description, shortName } = req.body;
    const errors = [];

    // Name validation - only text (letters and spaces)
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
        } else if (trimmedName.length > 100) {
            errors.push({
                field: 'name',
                message: 'Name cannot exceed 100 characters'
            });
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            errors.push({
                field: 'name',
                message: 'Name can only contain letters and spaces'
            });
        }
    }

    // Short Name validation
    if (!shortName || shortName.trim() === '') {
        errors.push({
            field: 'shortName',
            message: 'Short name is required'
        });
    } else {
        const trimmedShortName = shortName.trim();
        
        if (trimmedShortName.length < 2) {
            errors.push({
                field: 'shortName',
                message: 'Short name must be at least 2 characters long'
            });
        } else if (trimmedShortName.length > 10) {
            errors.push({
                field: 'shortName',
                message: 'Short name cannot exceed 10 characters'
            });
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedShortName)) {
            errors.push({
                field: 'shortName',
                message: 'Short name can only contain letters and spaces'
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

async function getAllUniversities(req, res) {
    try {
        const universities = await universitySchema.find();
        res.status(200).json(universities);
    } catch (err) {
        console.error('Error fetching universities:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUniversityById(req, res) {
    const { id } = req.params;
    try {
        const university = await universitySchema.findById(id);
        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }
        res.status(200).json(university);
    } catch (err) {
        console.error('Error fetching university by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addUniversity(req, res) {
      const validationErrors = validateFields(req);
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }
    const { name, description,shortName, logo } = req.body;
  
    const alluniversites= await universitySchema.find();
      const existingUniversity = alluniversites.find(university => university.name.toLowerCase() === name.toLowerCase() || university.shortName.toLowerCase() === shortName.toLowerCase());
      if (existingUniversity) {
        return res.status(400).json({ error: 'University with the same name or short name already exists' });
      }
    try {
        const university = new universitySchema({ name, description,shortName,logo });
        await university.save();
        res.status(201).json({ message: 'University added successfully' });
    } catch (err) {
        console.error('Error adding university:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function updateUniversity(req, res) {
    const { id } = req.params;
    const { name, description,shortName, logo } = req.body;
      const validationErrors = validateFields(req);
        
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }

    const alluniecceptthisid= await universitySchema.find({_id:{$ne:id}});
      const existingUniversity = alluniecceptthisid.find(university => university.name.toLowerCase() === name.toLowerCase() || university.shortName.toLowerCase() === shortName.toLowerCase());
      if (existingUniversity) {
        return res.status(400).json({ error: 'University with the same name or short name already exists' });
      }
    const specificUniversity = await universitySchema.findById(id);
    if (!specificUniversity) {
        return res.status(404).json({ error: 'University not found' });
    }
    try {
        const updatedLogo = logo || specificUniversity.logo;
        const updatedUniversity = await universitySchema.findByIdAndUpdate(id, { name, description,shortName, logo: updatedLogo }, { new: true });
        res.status(200).json(updatedUniversity);
    } catch (err) {
        console.error('Error updating university:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    
}


async function deleteUniversity(req, res) {
    const { id } = req.params;
    try {
        const university = await universitySchema.findByIdAndDelete(id);
        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }
        res.status(200).json({ message: 'University deleted successfully' });
    } catch (err) {
        console.error('Error deleting university:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { getAllUniversities, getUniversityById, addUniversity, updateUniversity, deleteUniversity };