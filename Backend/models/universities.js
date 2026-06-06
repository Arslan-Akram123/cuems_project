const {Schema,model}=require("mongoose");

const universitySchema = new Schema({
    name: {
        type: String,
        required: true, 
        unique: true
    },
    shortName: {
        type: String,
        required: true, 
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    logo:{
        type: String,
        required: true
    }
});
const University = model('University', universitySchema);
module.exports = University;