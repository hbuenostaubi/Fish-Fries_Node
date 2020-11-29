const express = require('express');
const hbs = require('express-handlebars')
const path = require('path');
const logger = require('morgan');  ///color cogen colors
const http =require('http')
const session = require('express-session')
const MemoryStore =require('memorystore')(session)
const connectFlash = require('connect-flash')

const mongoose = require('mongoose')
const passport = require('passport')
const {User} =require('./models/user')

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }
).catch(err=>{
    console.log(err)
})


const appsupport=require('./appsupport')
const indexRouter = require('./routes/index')  //when exported is already handled
const reservationRouter = require('./routes/reservations')
const usersRouter = require('./routes/users')

const app =express()
exports.app=app

// view engine setup
app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'hbs');  ///knows to use handlebars w/ hbs
app.engine('hbs', hbs(
{
    extname:'hbs',
    defaultLayout: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
    })
)

app.use(logger('dev'))  //deals w/ morgan
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret_password',
    cookie: { maxAge: 86400000} ,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized:false
}))
app.use(connectFlash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.static(path.join(__dirname, 'public', 'assets')))  ///handles static assets
        //// works with current directory...located in public
app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')))
app.use('/assets/vendor/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery','dist')))
app.use('/assets/vendor/popper.js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist','umd')))
app.use('/assets/vendor/feather-icons', express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')))


//authenticated and Flash not turning purple
app.use(( req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated()
    res.locals.user= req.user ? req.user.toObject() : undefined  ///to have access to virtuals and getters methods in model
    res.locals.flashMessages = req.flash()
    next()
})

//router function list
app.use('/', indexRouter);
app.use('/reservations', reservationRouter);
app.use('/users', usersRouter)

//Error Handlers
app.use(appsupport.basicErrorHandler) //take off parenthesis for basicErrorHandler for callback
app.use(appsupport.handle404) ///callback again as above

const port = appsupport.normalizePort(process.env.PORT || '3000');
exports.port=port
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
exports.server=server
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', appsupport.onError);
server.on('listening', appsupport.onListening);







