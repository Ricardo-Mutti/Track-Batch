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
  schema.machine = require(__dirname + '/models/machine.js')(db.mongoose);
  schema.po = require(__dirname + '/models/po.js')(db.mongoose);
  schema.batch = require(__dirname + '/models/batch.js')(db.mongoose);
  schema.product = require(__dirname + '/models/product.js')(db.mongoose);

  //Modulo authenticate
  var authenticate = {};
  authenticate.controllers = {};
  authenticate.controllers.authenticate = require(__dirname + '/modules/authenticate/authenticate-controller.js')(app.jwt, app.config);

  //Modulo User
  var user = {};
  user.controllers = {};
  user.controllers.signUp = require(__dirname + '/modules/user/sign-up/sign-up-controller.js')(schema, app.bcrypt, app.jwt, app.config);
  user.controllers.login = require(__dirname + '/modules/user/login/login-controller.js')(schema, app.bcrypt,app.jwt, app.config);
  user.controllers.user = require(__dirname + '/modules/user/user-controller.js')(schema);

  //Modulo machine
  var machine = {};
  machine.controllers = {};
  machine.controllers = require(__dirname + '/modules/machine/machine-controller.js')(schema);

  //Modulo PO
  var PO = {};
  PO.controllers = {};
  PO.controllers = require(__dirname + '/modules/PO/po-controller.js')(schema);

  //Modulo Product
  var product = {};
  product.controllers = {};
  product.controllers = require(__dirname + '/modules/product/product-controller.js')(schema);

  //Rotas
  var routes = {};
  routes.routes = require(__dirname + '/routes/router.js')(app.express, routes, authenticate);
  routes.v1_auth = {};
  routes.v1_no_auth = {};

  //Rotas v1-no-auth
  routes.v1_no_auth.account = require(__dirname + '/routes/v1-no-auth/account-route.js')(user);

  //Rotas v1-auth  
  routes.v1_auth.user = require(__dirname + '/routes/v1-auth/user-route.js')(user);
  routes.v1_auth.machine = require(__dirname + '/routes/v1-auth/machine-route.js')(machine);
  routes.v1_auth.po = require(__dirname + '/routes/v1-auth/po-route.js')(PO);
  routes.v1_auth.product = require(__dirname + '/routes/v1-auth/product-route.js')(product);

   return {
    app: app,
    router: routes.routes
  }

}