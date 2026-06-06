
const { Schema, model}=require('mongoose');
const categorySchema = new Schema({ 
    name: {
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
});
const Category = model('Category', categorySchema);
module.exports = Category;