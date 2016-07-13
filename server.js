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
  app.config = require('./config')(app.nodeMailer);
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
  schema.post = require(__dirname + '/models/post.js')(db.mongoose);
  schema.likes = require(__dirname + '/models/likes.js')(db.mongoose);
  schema.comentario = require(__dirname + '/models/comentario.js')(db.mongoose);
  schema.user = require(__dirname + '/models/user.js')(db.mongoose);
  schema.categories = require(__dirname + '/models/categories.js')(db.mongoose);
  schema.notifications = require(__dirname + '/models/notifications.js')(db.mongoose);
  schema.notifications_list = require(__dirname + '/models/notifications-list.js')(db.mongoose);

  //Modulo Notificações
  var notifications = {};
  notifications.controllers = {};
  notifications.controllers.notifications = require(__dirname + '/modules/notifications/notifications-controller.js')(schema);


  //Modulo User
  var user = {};
  user.controllers = {};
  user.controllers.signUp = require(__dirname + '/modules/user/sign-up/sign-up-controller.js')(schema, app.bcrypt, app.jwt, app.config);
  user.controllers.login = require(__dirname + '/modules/user/login/login-controller.js')(schema, app.bcrypt, app.jwt, app.config);
  user.controllers.user = require(__dirname + '/modules/user/user-controller.js')(schema, db.mongoose, notifications, app.config, app.request);

  //Modulo Autenticacao
  var autenticacao = {};
  autenticacao.controllers = {};
  autenticacao.controllers.autenticacao = require(__dirname + 
    '/modules/autenticacao/autenticacao-controller.js')(app.jwt, app.config);

  //Modulo Likes
  var likes = {};
  likes.controllers = {};
  likes.controllers.likes = require(__dirname + '/modules/likes/likes-controller.js')(schema);

  //Modulo Token
  var token = {};
  token.controllers = {};
  token.controllers.token = require(__dirname + '/modules/token/edit-token-controller.js')(schema, app.config, app.request);

  //Modulo Categoria
  var categorie = {};
  categorie.controllers = {};
  categorie.controllers.categorie = require(__dirname + '/modules/categorie/categorie-controller.js')(schema);


  //Modulo Password
  var password = {};
  password.controllers = {};
  password.controllers.password = require(__dirname + '/modules/password/password-controller.js')(schema, db.mongoose, app.bcrypt, app.crypto, app.config);

  // Modulo VideoFeed
  var videoFeed = {};
  videoFeed.controllers = {};
  videoFeed.controllers.videoFeed = require(__dirname + '/modules/video-feed/video-feed-controller.js')(schema, db.mongoose);
 
  // Modulo UserFeed
  var userFeed = {};
  userFeed.controllers = {};
  userFeed.controllers.userFeed = require(__dirname + '/modules/feed_user/feed-user-controller.js')(schema);

  //Modulo Comentarios
  var comentario = {};
  comentario.controllers = {};
  comentario.controllers.comentario = require(__dirname + '/modules/comentario/comentario-controller.js')(schema, db.mongoose, app.config, app.request);

  //Rotas
  var routes = {};
  routes.routes = require(__dirname + '/routes/router.js')(app.express, routes, autenticacao);
  routes.v1_auth = {};
  routes.v1_no_auth = {};
  routes.v1_auth_admin = {};

  //Rotas v1_auth_admin
  routes.v1_auth_admin.admin = require(__dirname + '/routes/v1-auth-admin/admin-route.js')(videoFeed, categorie);

  //Rotas v1_auth
  routes.v1_auth.feed = require(__dirname + '/routes/v1-auth/feed-route.js')(videoFeed);
  routes.v1_auth.likes = require(__dirname + '/routes/v1-auth/likes-route.js')(likes);
  routes.v1_auth.comentario = require(__dirname + '/routes/v1-auth/comentario-route.js')(comentario);
  routes.v1_auth.userFeed = require(__dirname + '/routes/v1-auth/feed-user-route.js')(userFeed);
  routes.v1_auth.user = require(__dirname + '/routes/v1-auth/user-route.js')(user);
  routes.v1_auth.password = require(__dirname + '/routes/v1-auth/password-route.js')(password);
  routes.v1_auth.categorie = require(__dirname + '/routes/v1-auth/categorie-route.js')(categorie);
  routes.v1_auth.notifications = require(__dirname + '/routes/v1-auth/notifications-route.js')(notifications);
  routes.v1_auth.token = require(__dirname + '/routes/v1-auth/token-route.js')(token);

  //Rotas v1_no_auth
  routes.v1_no_auth.signUp = require(__dirname + '/routes/v1-no-auth/sign-up-route.js')(user);
  routes.v1_no_auth.login = require(__dirname + '/routes/v1-no-auth/login-route.js')(user);
  routes.v1_no_auth.password = require(__dirname + '/routes/v1-no-auth/password-route.js')(password);

  // FrontEnd
  routes.frontEnd = {};
  routes.frontEnd.views = require(__dirname + '/routes/v1-no-auth/views.js')();

  return {
    app: app,
    router: routes.routes
  }

}
