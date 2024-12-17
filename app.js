var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const http = require("http");
const mongo = require("mongoose");
const socketIo = require("socket.io");
const twig = require('twig'); // Assurez-vous d'avoir installé twig

// Step 3.1 - Connexion à MongoDB
const mongoconnection = require("./config/database.json");

mongo.connect(mongoconnection.url)
    .then(() => {
        console.log("DataBase Connected Pour la classe 4TWIN4!!");
    })
    .catch((err) => {
        console.log(err);
    });

// Création de l'application Express
var app = express();

// Route pour le chat
app.get("/chat", (req, res) => {
    res.render("chat"); // Charge chat.twig
});

// Route principale
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paysRouter = require('./routes/pays');
var studentsRouter = require('./routes/students');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Définition des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pays', paysRouter);
app.use('/students', studentsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.io
const io = socketIo(server);

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
    console.log("User Connected..");

    // Informer les autres utilisateurs
    socket.broadcast.emit("msg", "A new user has joined the chat");

    // Réception d'un message
    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("msg", data); // Diffuse à tous les clients
    });

    // Déconnexion
    socket.on("disconnect", () => {
        console.log("User Disconnected");
        io.emit("msg", "A user has left the chat");
    });
});

// Lancement du serveur
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

module.exports = app;
