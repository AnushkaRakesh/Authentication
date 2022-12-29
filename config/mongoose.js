//require the library
const mongoose = require('mongoose');


// connect to the database
mongoose.connect("mongodb://127.0.0.1:27017/user-auth"); 


// acquire the connection to check if it is successfull
const db=mongoose.connection;

//error
db.on('error',console.error.bind(console,'error connection to db'));

//successful
db.once('open',function(){
    console.log('successfull connected to the database');
});

module.exports = db;
