//require express
const express = require('express');
const { append } = require('express/lib/response');
const passport = require('passport');

const {ensureAuthenticated}  = require('../config/auth');
//require controller
const userController = require('../controllers/user_controller');
//require model
const User = require('../models/user');
//bcrypt
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');

//require router
const router = express.Router();


//Login Page
router.get('/login',(req,res) =>{
    if(req.isAuthenticated()){
        return res.redirect('/users/dashboard');
    }
    res.render('login',{
        title:'Login'
    });
});
//Register Page
router.get('/register',(req,res) =>{
    if(req.isAuthenticated()){
        return res.redirect('/users/dashboard');
    }
    res.render('register',{
        title:'Sign Up'
    });
});

//change password page when user is authenticated
router.get('/changePassword',ensureAuthenticated,(req,res) =>{

    res.render('changePassword',{
        title:'Change Password'
    });
});

//forget password
router.get('/forget-password',(req,res)=>{
    res.render('forget_password',{
        title:'Forget Password'
    });
})

//reset password
router.get('/reset-password',userController.resetPasswordLoad);



//Register Handle
router.post('/register',userController.userRegistration);

//login handle
router.post('/login',userController.logIn);
    
//logout handle
router.get('/logout',userController.logOut);

//change password
router.post('/changePassword',ensureAuthenticated,userController.changePassword);

//forget password
router.get('/forget-password',userController.forgetPassword);
router.post('/resetPassword',userController.resetPasswordLink);

router.post('/reset-password',userController.resetPassword);


//google authentication
router.get('/auth/google',passport.authenticate('google',{scope:['email','profile']}));

router.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect:'/users/login',

}),function(req,res){
    req.flash('success_msg','You are log in successfully')
    return res.redirect('/users/dashboard');
});




//export router
module.exports = router;
