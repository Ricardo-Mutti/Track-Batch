module.exports = function(){
  var app = {};
  //http://expressjs.com/
  app.express     = require('express');
  // http://www.embeddedjs.com/
  app.ejs = require('ejs');
  //https://nodejs.org/api/path.html
  app.path      = require('path');
  //https://nodejs.org/api/http.html#http_http
  app.http      = require('http');
  //https://github.com/expressjs/morgan
  app.morgan          = require('morgan');
  //Esse é o que deixa eu usar req.body https://github.com/expressjs/body-parser
  app.bodyParser      = require('body-parser');
  //https://github.com/expressjs/method-override
  app.methodOverride  = require('method-override');
  //https://www.npmjs.com/package/bcryptjs
  app.bcrypt = require('bcryptjs');
  //https://github.com/auth0/node-jsonwebtoken
  app.jwt = require('jsonwebtoken');
  //https://github.com/nodemailer/nodemailer
  app.nodeMailer = require('nodemailer');
  //arquivo de criptografia 
  app.crypto = require('crypto');
  // Arquivo de configuracoes
  app.config = require('./config')();
  //https://github.com/tomas/needle
  app.request = require('request');

  //Db
  var db = {};
  db.mongo = require('mongodb').MongoClient;
  db.mongoose = require('mongoose');
  db.mongoose.connect(app.config.mongoURI());
  db.mongoose.connection.on('error', console.error);

   //Schema
  var schema = {};
  schema.account = require(__dirname + '/models/account.js')(db.mongoose);
  schema.user = require(__dirname + '/models/user.js')(db.mongoose);

  //Modulo User
  var user = {};
  user.controllers = {};
  user.controllers.signUp = require(__dirname + '/modules/user/sign-up/sign-up-controller.js')(schema, app.bcrypt, app.jwt, app.config);
  user.controllers.login = require(__dirname + '/modules/user/login/login-controller.js')(schema, app.bcrypt,app.jwt, app.config);
  user.controllers.user = require(__dirname + '/modules/user/user-controller.js')(schema);

  //Rotas
  var routes = {};
  routes.routes = require(__dirname + '/routes/router.js')(app.express, routes);
  routes.v1 = {};
  routes.v1.user = require(__dirname + '/routes/v1/user-route.js')(user);

   return {
    app: app,
    router: routes.routes
  }

}