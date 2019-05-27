// Servidor da aplicacao

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOpUSers = require('./models/mongoUsers.js');
var mongoOpAssuntos = require('./models/mongoAssuntos.js');
var mongoOpPosts = require('./models/mongoPosts.js');
var mongoOpComentarios = require('./models/mongoComentarios.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
// app.use('/', express.static(__dirname + '/'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// Serve a pagina de login
function serveLogin(req, res) {
	var path = 'static/login.html'
	res.header('Cache-Control', 'no-cache');
	res.sendFile(path, {"root": "./"});
}

// Verifica a autenticacao e serve a pagina de login caso a autenticacao
// nao seja verificada.
var checkAuth = function (req, res, next) {
	cookies = req.cookies;
	if(!cookies || !cookies.userAuth) serveLogin(req, res)
	else {
		cauth = cookies.userAuth;
		var content = JSON.parse(cauth);
		var key = content.key;
	    var role = content.role;
	    if(key == 'secret') next();
        else serveLogin(req,res);
    }
}

// Antes de toda rota, verificar se o usuario esta cadastrado
router.use(function (req, res, next) {
    if(req.path == '/cadastro' || req.path == '/login') next();
    else checkAuth(req, res, next);
});

// Processamento de requicisoes para cada rota
// HTTP GET, POST, PUT, DELETE

// Alguns navegadores enviam uma requisicao OPTIONS antes de POST e PUT
router.route('/*') 
 .options(function(req, res) {  // OPTIONS
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
   res.sendStatus(200);
   }
);

// index.html
router.route('/')
    .get(function(req, res) {  // GET
        var path = 'static/index.html'
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    }
	);

router.route('/login')
    .get(function(req, res) {  // GET
        var path = 'static/login.html'
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    })    

    .post(function(req,res){
        //
	});

router.route('/cadastro')
    .get(function(req, res) {
        var path = 'static/cadastro.html'
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    }
	);



router.route('/users')
    .get(function(req,res){

    }
    )

    .post(function(req,res){
        var user = {'user':req.body.user};
        mongoOpUsers.findOne(user, function(erro,data){
        if(erro) response = {"resultado":"Falha ao acessar BD"}
        else if (data == null){
            var db = new mongoOpUsers();
            db.user = req.body.user;
            db.password = req.body.password;
            db.nickname = req.body.nickname;
            db.name = req.body.name;
            db.save(function(erro){
            if (erro) response = {"resultado":"Falha ao inserir usuario no banco"};
            else response = {"resultado":"Usuario cadastrado"}
            res.json(response);
            })
        }
        else response = {"resultado":"usuario ja cadastrado !"}
        res.json(response);
        })
    });                    
    
router.route('/users/:id')
    .get(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .post(function(req,res){
	}
	)
    .put(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .delete(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
    );
    
router.route('/assuntos')
    .get(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .post(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
	}
	)
    .put(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .delete(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
    );
 

router.route('/posts')
    .get(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .post(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
	}
	)
    .put(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .delete(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
    );

router.route('/posts/:id')
    .get(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .post(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
	}
	)
    .put(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
	)
    .delete(function(req,res){
        console.log(req.path);
        console.log(JSON.stringify(req.body));
    }
    );
