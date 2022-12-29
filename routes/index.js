//require express
const express = require('express');
const { title } = require('process');

//require router 
const router = express.Router();

const {ensureAuthenticated}  = require('../config/auth');

router.get('/',(req,res) =>{
    res.render('welcome',{
        title:'User Authentication'
    });

});
router.use('/users',require('./users'));

router.get('/users/dashboard',ensureAuthenticated,function(req,res){
    console.log(req.user);
    res.render('dashboard',{
        user:req.user.name,
        title:'Profile'
    });
});

//export router
module.exports = router;
