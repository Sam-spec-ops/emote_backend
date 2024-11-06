// require('dotenv').config();
const verifytoken=require('./middleware/jwtVerification');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// Socket IO
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);

const SECRET_KEY = 'process.env.SECRET_KEY';
const jwt = require('jsonwebtoken');
// io.use((socket, next)=>{
//   const token = socket.handshake.query.token;
//   if (!token) {
//     return next(new Error('No token provided'));
//   }
//   jwt.verify(token, SECRET_KEY, (err, decoded)=>{
//     if(err) {
//       return next(new Error('Token verification error'));
//     }
//     socket.user = decoded;
//     next();
//   });
// });

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('sendmessage', (data)=>{
      console.log(data);
      socket.emit('recievemessage',{text:data.text, time: data.time, isDelivered: true, isSent: true, SocketID: socket.id});
  });
  socket.on('disconnect', ()=>{
    console.log(`User disconnect ${socket.id}`)
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
