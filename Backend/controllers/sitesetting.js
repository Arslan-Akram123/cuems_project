const sitesettingschema = require('../models/sitesetting');
const validator = require('deep-email-validator');
const getSiteSetting = async (req, res) => {
    try {
        const siteSetting = await sitesettingschema.findOne({});
        res.status(200).json(siteSetting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSiteSetting = async (req, res) => {
    const { siteEmail, sitePhone, siteAddress, tiwitterLink, facebookLink, instagramLink, description, siteCloseMessage, footerText, siteMainImage, siteLogo } = req.body;

    if (siteEmail) {
        const allowedDomains = ['mul.edu.pk', 'gmail.com'];
        const emailDomain = siteEmail.split('@')[1].toLowerCase();

        if (allowedDomains.includes(emailDomain) ||
            emailDomain === 'edu.pk' ||
            emailDomain.endsWith('.edu.pk')) {

        } else {
            const result = await validator.validate(siteEmail, {
                validateSMTP: true
            });
            if (!result.valid) {
                return res.status(400).json({
                    message: "Invalid email address"
                });
            }
        }
    }
    // start the site setting validation
    const errors = [];

    // Site Phone validation
    if (sitePhone && sitePhone.trim() !== '') {
        const cleanedPhone = sitePhone.replace(/\D/g, '');

        // Pakistani phone number validation
        const mobileRegex = /^((\+92)|(0092)|(92)|(0))?(3[0-9]{9})$/;
        const landlineRegex = /^((\+92)|(0092)|(92)|(0))?([1-9][0-9]{8})$/;

        if (!mobileRegex.test(cleanedPhone) && !landlineRegex.test(cleanedPhone)) {
            errors.push({
                field: 'sitePhone',
                message: 'Please enter a valid Pakistani phone number. Format: 03XXXXXXXXX or 0XXYYYYYYY'
            });
        } else if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
            errors.push({
                field: 'sitePhone',
                message: 'Phone number must be 10-12 digits long'
            });
        }
    }else{
        errors.push({
            field: 'sitePhone',
            message: 'Phone number is required'
        });
    }

    // Site Address validation
    if (siteAddress && siteAddress.trim() !== '') {
        if (siteAddress.trim().length < 5) {
            errors.push({
                field: 'siteAddress',
                message: 'Address must be at least 5 characters long'
            });
        } else if (siteAddress.trim().length > 500) {
            errors.push({
                field: 'siteAddress',
                message: 'Address cannot exceed 500 characters'
            });
        } else if (!/^[a-zA-Z0-9\s,.'-/#&()]+$/.test(siteAddress)) {
            errors.push({
                field: 'siteAddress',
                message: 'Address contains invalid characters'
            });
        }
    }else{
        errors.push({
            field: 'siteAddress',
            message: 'Address is required'
        });
    }

    // Twitter Link validation
    if (tiwitterLink && tiwitterLink.trim() !== '') {
        const twitterRegex = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/;

        if (!twitterRegex.test(tiwitterLink)) {
            errors.push({
                field: 'tiwitterLink',
                message: 'Please enter a valid Twitter profile URL (e.g., https://twitter.com/username)'
            });
        } else if (tiwitterLink.length > 200) {
            errors.push({
                field: 'tiwitterLink',
                message: 'Twitter link cannot exceed 200 characters'
            });
        }
    }else{
        errors.push({
            field: 'tiwitterLink',
            message: 'Twitter link is required'
        });
    }

    // Facebook Link validation
    if (facebookLink && facebookLink.trim() !== '') {
        const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[a-zA-Z0-9.\-]+\/?$/;

        if (!facebookRegex.test(facebookLink)) {
            errors.push({
                field: 'facebookLink',
                message: 'Please enter a valid Facebook profile URL'
            });
        } else if (facebookLink.length > 200) {
            errors.push({
                field: 'facebookLink',
                message: 'Facebook link cannot exceed 200 characters'
            });
        }
    }else{
        errors.push({
            field: 'facebookLink',
            message: 'Facebook link is required'
        });
    }

    // Instagram Link validation
    if (instagramLink && instagramLink.trim() !== '') {
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;

        if (!instagramRegex.test(instagramLink)) {
            errors.push({
                field: 'instagramLink',
                message: 'Please enter a valid Instagram profile URL'
            });
        } else if (instagramLink.length > 200) {
            errors.push({
                field: 'instagramLink',
                message: 'Instagram link cannot exceed 200 characters'
            });
        }
    }else{
        errors.push({
            field: 'instagramLink',
            message: 'Instagram link is required'
        });
    }

    // Description validation
    if (description && description.trim() !== '') {
        if (description.trim().length < 10) {
            errors.push({
                field: 'description',
                message: 'Description must be at least 10 characters long'
            });
        } else if (description.trim().length > 2000) {
            errors.push({
                field: 'description',
                message: 'Description cannot exceed 2000 characters'
            });
        }
    }else{
        errors.push({
            field: 'description',
            message: 'Description is required'
        });
    }

    // Site Close Message validation
    if (siteCloseMessage && siteCloseMessage.trim() !== '') {
        if (siteCloseMessage.trim().length < 5) {
            errors.push({
                field: 'siteCloseMessage',
                message: 'Close message must be at least 5 characters long'
            });
        } else if (siteCloseMessage.trim().length > 500) {
            errors.push({
                field: 'siteCloseMessage',
                message: 'Close message cannot exceed 500 characters'
            });
        }
    }

    // Footer Text validation
    if (footerText && footerText.trim() !== '') {
        if (footerText.trim().length < 2) {
            errors.push({
                field: 'footerText',
                message: 'Footer text must be at least 2 characters long'
            });
        } else if (footerText.trim().length > 200) {
            errors.push({
                field: 'footerText',
                message: 'Footer text cannot exceed 200 characters'
            });
        } 
    }else{
        errors.push({
            field: 'footerText',
            message: 'Footer text is required'
        });
    }

    // Check if there are any validation errors
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0].message
        });
    }
    // end validation
    try {
        let siteSetting = await sitesettingschema.findOne({});
        // If no site setting exists, create a new one
        if (!siteSetting) {
            const logoFile = req.files?.siteMainImage?.[0];
            const sitelogoFile = req.files?.siteLogo?.[0];
            siteSetting = await sitesettingschema.create({
                siteEmail,
                sitePhone,
                siteAddress,
                tiwitterLink,
                facebookLink,
                instagramLink,
                siteMainImage: siteMainImage || (logoFile ? logoFile.filename : ''),
                siteLogo: siteLogo || (sitelogoFile ? sitelogoFile.filename : ''),
                description,
                siteCloseMessage,
                footerText
            });
            return res.status(200).json(siteSetting);
        }

        // If exists, update the fields
        const logoFile = req.files?.siteMainImage?.[0];
        const sitelogoFile = req.files?.siteLogo?.[0];

        siteSetting.siteEmail = siteEmail || siteSetting.siteEmail;
        siteSetting.sitePhone = sitePhone || siteSetting.sitePhone;
        siteSetting.siteAddress = siteAddress || siteSetting.siteAddress;
        siteSetting.tiwitterLink = tiwitterLink || siteSetting.tiwitterLink;
        siteSetting.facebookLink = facebookLink || siteSetting.facebookLink;
        siteSetting.instagramLink = instagramLink || siteSetting.instagramLink;
        siteSetting.siteMainImage = siteMainImage || (logoFile ? logoFile.filename : siteSetting.siteMainImage);
        siteSetting.siteLogo = siteLogo || (sitelogoFile ? sitelogoFile.filename : siteSetting.siteLogo);
        siteSetting.description = description || siteSetting.description;
        siteSetting.siteCloseMessage = siteCloseMessage || siteSetting.siteCloseMessage;
        siteSetting.footerText = footerText || siteSetting.footerText;
        await siteSetting.save();
        res.status(200).json(siteSetting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSiteSetting,
    updateSiteSetting
}