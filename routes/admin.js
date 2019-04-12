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
    res.render('admin/categoria')
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
});

router.post('/categorias/cadastrada', (req, res) => {

    var erros = []
    console.log(req.body.nome +' teste');
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
            console.log('cadastrado');
            /*req.flash('success_msg','Categoria criada com sucesso!')
            res.redirect('/admin/categorias');*/
        }).catch((error) =>{
            console.log('erro cadastrado');
            /*req.flash('error_msg','Houve um erro ao salvar a categoria, tente novamente!')
            res.redirect('/admin/categorias');*/
        });
    }
});

module.exports = router;