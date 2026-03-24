const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
      cart:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Product",
           
       }
    ],
    
     like:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Product",
       }
    ],
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}
module.exports = User;
