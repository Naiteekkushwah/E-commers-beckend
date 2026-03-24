const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
     image: {
        type: String ,  // file का mime type (जैसे 'image/png')
  },
    discount:{
        type:Number,
        default:0
    },
   rating:{
        type:String,
    },

     category: {
    type: String,
    required: true,
    enum: ["women", "men", "kids", "sale", "discount"], // allowed categories
  },
     isNewCollection: Boolean, 
     stock: Number,
}, {
    timestamps: true,
 
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
