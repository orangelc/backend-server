//Requires
var express = require('express');
var mongoose = require('mongoose');

//Initialize
var app = express();
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',( err, res )=>{

    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');    

});

//Routes
app.get('/', (req, res) =>{

res.status(200).json({
    ok: true,
    mensaje: 'Petición realizada correctamente'
});

});

//Listen requests
app.listen(3000,() => {

    console.log('Express Server Puesto 3000: \x1b[32m%s\x1b[0m', 'online');

});