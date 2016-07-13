var server = require(__dirname + '/server.js')();

var app = server.app.express();

app.use(server.app.express.static(server.app.path.join(__dirname, 'views')));
app.use(server.app.morgan('dev'));
app.engine('html', server.app.ejs.renderFile);
app.set('view engine', 'ejs');
app.use(server.app.bodyParser.urlencoded({ extended: false }));
app.use(server.app.bodyParser.json());
app.use(server.app.methodOverride());

server.router(app);

// verify connection configuration
var transporter = server.app.config.transporter();
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Email connection live');
   }
});

return server.app.http.createServer(app).listen(process.env.PORT || 8080, function() {
    console.log("Server is on, listening on: 8080");
});
