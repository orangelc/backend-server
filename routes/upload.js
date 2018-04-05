var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// default options
app.use(fileUpload());

app.put("/:tipo/:id", (req, res) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  //Tipos validos de colecciones
  var tiposValidos = ["usuarios", "hospitales", "medicos"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Tipo de colección no es válida",
      errors: { message: "Tipo de colección no es válida" }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono nada",
      errors: { message: "Debe de seleccionar una imagen" }
    });
  }

  //Obtener nombre del archivo
  var archivo = req.files.imagen;
  var tokensArchivo = req.files.imagen.name.split(".");
  var extension = tokensArchivo[tokensArchivo.length - 1];

  //Extensiones de imagenes validas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extensión no valida",
      errors: {
        message: "Las extensiones válidas son: " + extensionesValidas.join(", ")
      }
    });
  }

  //Cambiar el nombre del archivo antes de guardar
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //Mover el archivo del temporal a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover archivo",
        errors: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  switch (tipo) {
    case "usuarios":
      Usuario.findById(id, (err, usuario) => {
        if (!usuario) {
          return res.status(400).json({
            ok: true,
            mensaje: "El usuario no existe",
            errors: { message: "El usuario no existe" }
          });
        }

        var pathViejo = "./uploads/usuarios/" + usuario.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlink(pathViejo);
        }

        usuario.img = nombreArchivo;
        usuario.password = ":)";

        usuario.save((err, usuarioActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizada",
            usuario: usuarioActualizado
          });
        });
      });

      break;

    case "medicos":
      Medico.findById(id, (err, medico) => {

        // if (!medico) {
        //   return res.status(400).json({
        //     ok: true,
        //     mensaje: "El médico no existe",
        //     errors: { message: "El médico no existe" }
        //   });
        // }

        var pathViejo = "./uploads/medicos/" + medico.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlink(pathViejo);
        }

        medico.img = nombreArchivo;

        medico.save((err, medicoActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de medico actualizada",
            medico: medicoActualizado
          });
        });
      });

      break;
    case "hospitales":
      Hospital.findById(id, (err, hospital) => {
        if (!hospital) {
          return res.status(400).json({
            ok: true,
            mensaje: "El hospital no existe",
            errors: { message: "El hospital no existe" }
          });
        }

        var pathViejo = "./uploads/hospitales/" + hospital.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlink(pathViejo);
        }

        hospital.img = nombreArchivo;

        hospital.save((err, hospitalActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de hospital actualizada",
            hospital: hospitalActualizado
          });
        });
      });

      break;
  }
}

module.exports = app;
