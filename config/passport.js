const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//load user model
const User = require('../models/user');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password,done) =>{
            //Match User
            User.findOne({email:email})
            .then(user => {
                if(!user){
                    return done(null,false,{message : 'That email is not registered'});
                }

                //Match password
                bcrypt.compare(password,user.password, (err,isMatch) =>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user);
                        req.flash('success_msg','You are log in successfully')
                    }else{
                        return done(null,false,{message : 'Password incorrect'});
                    }

                })
            })
            .catch(err => console.log(err));
        })
    );
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id); 
    // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


}