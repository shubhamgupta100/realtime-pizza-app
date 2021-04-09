const env = require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const db = require('./app/config/mongoose');

const session = require('express-session');

const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport');
const Emitter = require('events');


// Database connection
// session config
// Session store

let mongoStore = new MongoDbStore({
    mongooseConnection: db,
    collection: 'sessions'
})

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
const passportInit =require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
// Assets 

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Global Middleware
app.use((req,res,next) =>{
    res.locals.session = req.session;
    res.locals.user = req.user
    next();

})
// set Template engine

app.use(expressLayout);
app.set('view engine','ejs');
app.set('views' , path.join(__dirname, '/resourses/views'));

// Route should come after view engine block

app.use('/', require('./routes/web'));
// require('./routes/web')(app)





const server = app.listen(PORT , () =>{
    console.log(`Listening on port:${PORT}`);
})



const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
