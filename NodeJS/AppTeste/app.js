// Servidor da aplicacao

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOpUsers = require('./models/mongoUsers.js');
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


// Checks auth cookie and serves login page if user is not authenticated
var checkAuth = function (req, res, next) {
    cookies = req.cookies;
    var key = '';
    if(cookies && cookies.userAuth) key = JSON.parse(req.cookies.userAuth).key;
    if(key == 'secret') return true;
    res.sendFile('static/login.html', {"root": "./"});
    return false;
}

// Before every route that is not registration and login, checks user auth
router.use(function (req, res, next) {
    if(req.path == '/cadastro' || req.path == '/login') next();
    else if(!checkAuth(req, res, next)) {
        return;
    } else {
        next();
    }
});

// Some browsers send OPTIONS before POST and PUT 
router.route('/*') 
 .options(function(req, res) {  // OPTIONS
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
   res.sendStatus(200);
   }
);

// index.html route
router.route('/')
    .get(function(req, res) {  // GET
        var path = 'static/index.html'

        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    }
	);

// Login page routes
router.route('/login')
    // Gets login static page
    .get(function(req, res) {  // GET
        var path = 'static/login.html'
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    })    

    // Route for user trying to login
    .post(function(req,res) {
        var userName = req.body.user;
        var response = '';
        mongoOpUsers.findOne({user: userName}, function(err,data) {
            if(err) res.sendStatus(500);

            // User is not registered
            else if (data == null) {
                response = {"info": "Usuario nao cadastrado!"};
                res.statusCode = 200;
                res.json(response);
            }

            // Found user
            else {
                // If user and password combo checks out
                if(data.password == req.body.password) {
                    res.cookie('userAuth', 
                               JSON.stringify({"key": "secret", "user": userName}), 
                               {'maxAge': 3600000*24*5});
                    response = {}
                    res.statusCode = 200;
                    res.json(response);
                
                // Invalid password
                } else {
                    response = {"info": "Senha incorreta!"};
                    res.statusCode = 200;
                    res.json(response);
                }
            }
        })
	});

// Registration page routes
router.route('/cadastro')
    // Gets registration static page
    .get(function(req, res) {
        var path = 'static/cadastro.html'
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, {"root": "./"});
    })

    // Registrates a new user
    .post(function(req,res) {
        var user = {'user':req.body.user};
        var response = '';
        mongoOpUsers.findOne(user, function(err,data) {
            if(err) res.sendStatus(500);
            // User does not exist - creates new user
            else if (data == null) {
                var newUser = new mongoOpUsers();
                newUser.user = req.body.user;
                newUser.password = req.body.password;
                newUser.nickname = req.body.nickname;
                newUser.name = req.body.name;
                newUser.save(function(err) {
                    if (err) {
                        res.sendStatus(500);
                    } else { 
                        response = {}
                        res.statusCode = 200;
                        res.json(response);
                    }
                })
            // User already exists
            } else {
                response = {"info": "Usuario já existe!"};
                res.statusCode = 200;
                res.json(response);
            }
        }
        )
    }
    );

// Routes to "assuntos" resource, aka forum topics
router.route('/assuntos')

    // Gets all assuntos
    .get(function(req, res) {
        mongoOpAssuntos.find({}, function(err,data) {
            if(err) res.sendStatus(500);
            else {
                response = {"assuntos": data};
                res.statusCode = 200;
                res.json(response);
            }
        })
    })

    // Creates new assunto
    .post(function(req,res) {
        var assunto = {'assunto':req.body.assunto};
        var response = '';
        mongoOpAssuntos.findOne({name: assunto.assunto}, function(err,data) {
            if(err) res.sendStatus(500);
            // Assunto does not exist - create it
            else if (data == null) {
                var newAssunto = new mongoOpAssuntos();
                newAssunto.name = req.body.assunto;
                newAssunto.numberOfPosts = 0;
                newAssunto.save(function(err) {
                    if (err) res.sendStatus(500);
                    else {
                        response = {}
                        res.statusCode = 200;
                        res.json(response);
                    }
                })

            // Assunto already exists
            } else {
                response = {"info": "Assunto já existe!"};
                res.statusCode = 200;
                res.json(response);
            }
        }
        )
    }
    );

// Route to get all posts from one assunto
router.route('/posts/:assunto')
    .get(function(req, res) {
        mongoOpPosts.find({"assunto":req.params.assunto}, function(err,data) {
            if(err) {
                res.sendStatus(500);
            }
            else {
                response = {"posts": data}
                res.statusCode = 200;
                res.json(response);
            }
        })
    }
    );
 

// Route to create new posts
router.route('/posts')
    // for debug only
    .get(function(req, res) {
        mongoOpPosts.find({}, function(err,data) {
            if(err) {
                //response = {"resultado":"Falha ao acessar BD"}
                //res.statusCode = 500;
                //res.json(response);
                res.sendStatus(500);
            }
            else {
                response = {"posts": data};
                res.json(response);
            }
        })
    })

    // Creates new post
    .post(function(req,res) {
        var postName = req.body.name
        var assuntoName = req.body.assunto
        mongoOpAssuntos.findOne({name: assuntoName}, function(err,assuntoData) {
            if(err) {
                res.sendStatus(500);
            }
            // Posts "assunto" does not exist;
            else if (assuntoData == null) {
                response = {"info": "Assunto nao existe!"}
                res.statusCode = 200;
                res.json(response);
            }
            // If posts "assunto" exists...
            else {
                mongoOpPosts.findOne({assunto: assuntoName, name: postName}, function(err,postData) {
                    if(err) {
                        res.sendStatus(500);
                    }
                    // Creates posts, getting user name from cookie and updating "assuntos" n. of posts
                    else if (postData == null) {
                        var newPost = new mongoOpPosts();
                        cookies = req.cookies;
                        newPost.name = req.body.name;
                        newPost.content = req.body.content;
                        newPost.assunto = req.body.assunto;
                        newPost.numberOfComments = 0;
                        if(cookies && cookies.userAuth) newPost.author = JSON.parse(req.cookies.userAuth).user;
                        newPost.save(function(err) {
                            if (err) {
                                req.sendStatus(500);
                            } else {
                                assuntoData.numberOfPosts = assuntoData.numberOfPosts+1
                                assuntoData.save(function (err) {
                                    if(err) {
                                        req.sendstatus(500);
                                    } else {
                                        response = {}
                                        res.statusCode = 200;
                                        res.json(response);
                                    }
                                });
                            }
                        })
                    // Post is duplicated
                    } else {
                        response = {"info":"Post duplicado!"}
                        res.statusCode = 200;
                        res.json(response);
                    }
                })
            }
        })
    });

// Route to get all comments from a post
router.route('/comentarios/:id')
    .get(function(req, res) {
        mongoOpPosts.find({_id:req.params.id}, function(err, data) {
            if(err) {}
            mongoOpComentarios.find({postId:req.params.id}, function(err,data) {
                if(err) {
                    res.sendStatus(500);
                }
                else {
                    response = {"comments": data}
                    res.statusCode = 200;
                    res.json(response);
                }
            })
        });
    })
 
// Route to create new comments
router.route('/comentarios')
    // for debug only
    .get(function(req, res) {
        mongoOpComentarios.find({}, function(err,data) {
            if(err) {
                res.sendStatus(500);
            }
            else {
                response = {"comments": data};
                res.json(response);
            }
        })
    })

    // Creates new comment
    .post(function(req,res) {
        var postId = req.body.postId
        mongoOpPosts.findOne({_id: postId}, function(err,postData) {
            if(err) {
                res.sendStatus(500);
            }
            // Comments post does not exist
            else if (postData == null) {
                response = {"info": "Post nao existe!"}
                res.statusCode = 200;
                res.json(response);
            }
            // If comments post exist
            else {
                // Creates comment, getting user name from cookie and updating "post" n. of comments
                var newComment = new mongoOpComentarios();
                cookies = req.cookies;
                newComment.content = req.body.content;
                newComment.postId = req.body.postId;
                if(cookies && cookies.userAuth) newComment.author = JSON.parse(req.cookies.userAuth).user;
                newComment.save(function(err) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        postData.numberOfComments = postData.numberOfComments+1
                        postData.save(function (err) {
                            if(err) {
                                res.sendStatus(500);
                            } else {
                                response = {}
                                res.statusCode = 200;
                                res.json(response);
                            }
                        });
                    }
                })
            }
        })
    });
 
