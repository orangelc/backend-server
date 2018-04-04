var express = require("express");

var app = express();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/congif").SEED;

var mdAutenticacion = require("../middlewares/autenticacion");

var Hospital = require("../models/hospital");

//==================================================
// Obtener todos los usuarios
//==================================================

app.get("/", (req, res) => {
  Hospital.find({}).exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      hospitales: hospitales
    });
  });
});

//==================================================
// Actualizar usuario
//==================================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id: " + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    hospital.nombre = body.nombre;
    hospital.img = body.email;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

//==================================================
// Crear un nuevo hospital
//==================================================

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear hospital",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

//==================================================
// Borrar un usuario por el id
//==================================================
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un hospital con ese id",
        errors: { message: "No existe un hospital con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;
