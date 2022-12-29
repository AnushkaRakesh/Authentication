//require express
const express = require('express');
const logger = require('morgan');

//express layouts -- npm i express-layouts
const expressLayouts = require('express-ejs-layouts');


//flash
const flash = require('connect-flash');

//db
const db = require('./config/mongoose');

//express session
const session = require('express-session');

//passport
const passport = require('passport');
const passportConfig = require('./config/passport');
//google auth
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//connect mongo
const MongoStore = require('connect-mongo');

//cookie parser
const cookie = require('cookie-parser');

//port number
const port =5500;

//use express
const app = express();
require('./config/passport')(passport);

// app.use(logger(env.morgan.mode,env.morgan.options));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//body parser
app.use(express.urlencoded({extended:flash}));
app.use(cookie());


if(process.env.NODE_ENV == 'production'){
  app.use(express.static('client/build'));
}

const path = require('path');

//express session middleware
app.use(session({
    name:'Authentication',
   secret:'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:10000*60*60
    },
    store: MongoStore.create(
        {
          mongoUrl: db._connectionString,
          autoRemove: 'disabled',
        },
        function (err) {
          console.log.log(err || 'connect mongo setup ok')
        }
      ),
}));


// use passport session
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//global vars
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//routes
app.use('/',require('./routes/index'));


//configure express server
app.listen(port,(err) =>{
    if(err){
        console.log('Error in express server');
    }
    
    console.log(`Successfully running on port : ${port}`);
})