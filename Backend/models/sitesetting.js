const {Schema, model} = require('mongoose');


const siteSettingSchema = new Schema({
   siteEmail: {
        type: String,
       
   },
    sitePhone: {
        type: String,
       
    },
    siteAddress: {
        type: String,
       
    },
    tiwitterLink: {
        type: String,
       
    },
    facebookLink: {
        type: String,
        
    },
    instagramLink: {
        type: String,
        
    },
    siteMainImage: {
        type: String,
       
    },
    siteLogo: {
        type: String,
       
    },
    description: {
        type: String,
        
    },
    siteCloseMessage: {
        type: String,
       
    },
    footerText: {
        type: String,
        
    }
});
const SiteSetting = model('SiteSetting', siteSettingSchema);
module.exports = SiteSetting;