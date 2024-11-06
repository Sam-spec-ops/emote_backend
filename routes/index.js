var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const verifytoken=require('../middleware/jwtVerification');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Auth routes
router.post('/auth/register', UserController.userRegistration);
router.post('/auth/login', UserController.userLogin);
router.post('/auth/sendotp', verifytoken, UserController.sendEmail);
router.post('/auth/validateotp', verifytoken, UserController.validateOtp);

// Update routes
router.post('/user/updatepassword', verifytoken, UserController.updatePassword);
router.post('/user/updateuserdata', verifytoken, UserController.updateUserData);

// Message routes

module.exports = router;
