const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');


//
// Mostrar todas las categorias
//
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, '')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                categorias
            })
        })
});
//
// Mostrar una categoria por ID
//
app.get('/categoria/:id', verificaToken, (req, res) => {
    //categoria.findById()
    Categoria.findById(req.params.id)
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});
//
// Crear categoria
//
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//
// Actualiza categoria
//
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//
// Borrar categoria
//
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo admin puede borrar categorias
    //tiene que pedir token

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });
        categoriaDB.remove();
    });
});






module.exports = app;