//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Initialize
var app = express();


//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',( err, res )=>{

    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');    

});

//Import Routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');


//Routes
app.use('/usuario',usuarioRoutes);
app.use('/',appRoutes);

//Listen requests
app.listen(3000,() => {

    console.log('Express Server Puesto 3000: \x1b[32m%s\x1b[0m', 'online');

});