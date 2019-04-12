const express = require('express');
const router = express.Router();
mongoose = require('mongoose')
require('../model/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
});

router.get('/posts', (req, res) => {
    res.render('admin/posts')
});

router.get('/categorias', (req, res) => {
    Categoria.find().then( (categorias) => {
        res.render('admin/categoria', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg','houve um erro ao listar as categorias')
        res.redirect('/admin')
    });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
});

router.post('/categorias/cadastrada', (req, res) => {

    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido ou vazio'}) 
    }
    if (req.body.nome && req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria muito pequeno'})
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido ou vazio'})
    }
    
    if (erros.length > 0){
        res.render('admin/addcategoria', {erros: erros});
    }else{    
        const cadastrado = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        /* 
            const cadastrado = req.body 
        */
        new Categoria(cadastrado).save().then(() => {
            req.flash('success_msg','Categoria criada com sucesso!')
            res.redirect('/admin/categorias');
        }).catch((error) =>{
            req.flash('error_msg','Houve um erro ao salvar a categoria, tente novamente!')
            res.redirect('/admin');
        });
    }
});

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categorias) => {
        res.render('admin/editcategorias', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg','Está categoria não existe')
        res.redirect('/admin/categorias');
    })
    
});

router.post('/categorias/edit', (req, res) => {
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido ou vazio'}) 
    }
    if (req.body.nome && req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria muito pequeno'})
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido ou vazio'})
    }
    
    if (erros.length > 0){
        res.render('admin/addcategoria', {erros: erros});
    }else{ 
        Categoria.findOne({_id:req.body.id}).then((categorias) => {
            categorias.nome = req.body.nome;
            categorias.slug = req.body.slug;
            categorias.save().then(() => {
                req.flash('success_msg','Categoria atualizada com sucesso!')
                res.redirect('/admin/categorias');
            }).catch((error) => {
                req.flash('error_msg','Houve um erro interno ao editar a categoria')
                res.redirect('/admin/categorias');
            })
        }).catch((error) => {
            req.flash('error_msg','Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias');
        })
    }
    
});
module.exports = router;