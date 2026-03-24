const User = require('../models/user-models');
const { validationResult } = require('express-validator');
const cookie = require('cookie-parser');
(cookie())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const axios = require('axios');



module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token);
        res.status(200).json({ message: "User registered successfully", token, user });
  
};
module.exports.loginuser = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   
}
module.exports.getUserProfile = async (req, res) => {
   const user = req.user;
  res.status(200).json({ message: "Profile fetched successfully", user });
};
module.exports.logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};
module.exports.editUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, password } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

