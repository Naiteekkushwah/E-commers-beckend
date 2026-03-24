const express =require('express')
const router = express.Router()
const {body} = require('express-validator');
const userController = require('../Controller/user-controller');
const auth = require('../middelsware/user-founde');

router.get('/sample', (req, res) => {
    res.send('This is a sample route');
});

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], userController.registerUser);
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], userController.loginuser);
router.get('/profile',auth.userfounde, userController.getUserProfile);
router.post('/Edituser',[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], auth.userfounde, userController.editUser);
router.post('/logout', auth.userfounde, userController.logoutUser);
module.exports = router;