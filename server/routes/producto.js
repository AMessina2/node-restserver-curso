const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

// ==========================
// Obtener productos
// ==========================

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    Producto.find({}, '')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                producto
            })
        })
})

// ==========================
// Obtener un producto por ID
// ==========================

app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    // paginado
    Producto.findById(req.params.id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoDB
            });
        });
})

// ==========================
// Crear un producto
// ==========================

app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });
})


// ==========================
// Actualizar producto
// ==========================

app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    let bodyProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    }

    Producto.findByIdAndUpdate(id, bodyProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            producto: productoDB
        });
    });
})

// ==========================
// Buscar producto
// ==========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                producto
            })
        })
})

// ==========================
// Borrar producto
// ==========================

app.delete('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let bodyProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, bodyProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            producto: productoDB
        });
    });
})


module.exports = app;