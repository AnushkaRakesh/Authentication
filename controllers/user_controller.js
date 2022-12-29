const express = require('express');
const passport = require('passport');
//require model
const User = require('../models/user');
//bcrypt
const bcrypt = require('bcryptjs');
//random string
const randomString = require('randomstring');

const sendMailer = require('../nodemailer/sendmail');



//handle registration
module.exports.userRegistration = function(req,res){
      // console.log(req.body);
      const { name , email , password ,password2 } = req.body;
      const errors = [];
      //check required fields
      if(!name || !email || !password || !password2){
          errors.push({msg:'Please fill in all fields'});
      }
      //check password match
      if(password != password2){
          errors.push({msg:'Passwords do not match'});
      }
  
      //check password length
      if(password.length < 6){
          errors.push({msg:'Passwords should be at least 6 characters'});
      }
      if(errors.length > 0){
          res.render('register',{
              errors,
              name,
              email,
              password,
              password2,
              title:'Sign Up'
          })
  
      }else{
          //validation passed
          User.findOne({email:email})
          .then(user => {
              if(user){
                  //user exists
                  errors.push({msg:'Email is already registered'});
                  res.render('register',{
                      errors,
                      name,
                      email,
                      password,
                      password2,
                      title:'Sign Up'
                  });
              }else{
                  const newUser = new User({name,email,password});
                  //Hash password
                  bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password,salt,(err,hash) =>{
                      if(err){
                          throw err;
                      }
                      //set password to hashed
                      newUser.password = hash;
                      //save the user
                      newUser.save()
                      .then(user => {
                       
                          req.flash('success_msg','You are now registered and can log in');
                          res.redirect('/users/login');
  
                      })
                      .catch(err => console.log(err));
  
                  }));
              }
          })
      
      }

}
//handle login
module.exports.logIn = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next);
   
}

//handle logout
module.exports.logOut = (req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login');
}

//change password when user is authenticated
module.exports.changePassword =async (req,res)=>{
    const {current,password,password2} = req.body;
    if(password!=password2){
        req.flash('error_msg','Password do not Match');
        return res.redirect('back'); 
    }
    if(password.length < 6){
        req.flash('error_msg','Passwords should be at least 6 characters');
        return res.redirect('back'); 
    }
    else{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.findByIdAndUpdate(req.user.id,req.body);
        req.flash('success_msg','Password changed successfully');
        return res.redirect('/users/dashboard');
    }
    
}

//password forget
module.exports.forgetPassword = async(req,res)=>{
    return res.render('forget_password');
}


//sent link to reset password
module.exports.resetPasswordLink = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        // console.log(user);
        if(user){
            const token = randomString.generate();
            const updatedUser = await User.updateOne({email:user.email},{$set:{token:token}});
            sendMailer.sendEmail(user,token);
            req.flash('success_msg','Link sent successfully');
            res.redirect('back');

        }else{
            req.flash('error_msg','User not found please enter a valid email');
            res.redirect('back');

        }
    } catch (error) {
            req.flash('error_msg','Enter a valid email');
            res.redirect('back');
    }
}



//reset password 
module.exports.resetPasswordLoad= async(req,res)=>{
    try {
        const token=req.query.token;
        const user=await User.findOne({token:token});
        if(user){
            res.render('reset_password',{
                title:'Reset Password',
                user_id:user.id
            });
        }else{
            res.send('Invalid Token')
        }
    } catch (error) {
        console.log(error);

    }
}


module.exports.resetPassword=async(req,res)=>{
    const {password,password2} = req.body;
    const user_id = req.body.user_id;
    if(password!=password2){
        req.flash('error_msg','Password do not Match');
        return res.redirect('back'); 
    }
    if(password.length < 6){
        req.flash('error_msg','Passwords should be at least 6 characters');
        return res.redirect('back'); 
    }
    else{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.findByIdAndUpdate(user_id,req.body);
        req.flash('success_msg','Password reset successfully');
        return res.redirect('/users/login');
    }
}




