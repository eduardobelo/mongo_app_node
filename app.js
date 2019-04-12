// Carregando Módulos
   const express = require('express');
   const handlebars = require('express-handlebars');
   const bodyParser = require('body-parser');
   const app = express();
   const admin = require('./routes/admin')
   const path = require('path');
   const mongoose = require('mongoose');
   const session = require('express-session');
   const flash = require('connect-flash');

//Configurações
   //Session
   app.use(session({
      secret: 'cursonode',
      resave: false,
      saveUninitialized: true
   }));
   app.use(flash())

   //Middleware
   app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      next()
   });

   //Body Parser
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())
   //Handlebars
   app.engine('handlebars', handlebars({defaultLayout: 'main'}));
   app.set('view engine', 'handlebars');
//Mongoose
   mongoose.Promise = global.Promise;
   mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true}).then( () => {
      console.log('Conectado ao banco Mongo');
   }).catch( (error) => {
      console.log('Erro ao conectar ao banco:'+ error);
   });

   //Public
   app.use(express.static(path.join(__dirname,"public")));

//Rotas
   app.get('/', (req, res) => {
      res.send('Home teste');
   });

   app.use('/admin', admin);

//Outros
const PORT = 8082;
app.listen(PORT, () =>{
   console.log('Servidor rodando! ');
});