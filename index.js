// Import required modules
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan')
const app = express();
require('./config/view-helpers')(app);
const port = 8000;

const db = require('./config/mongoose');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
// const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Setting up the chat server, to be used with Socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
const PORT = 1024;
chatServer.listen(PORT);
console.log(`Chat server is listening on port ${PORT}`);

const cors = require('cors');
app.use(cors());

const path = require('path');

if(env.name == 'development'){
    // Middleware for compiling Sass to CSS
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

app.use(logger(env.morgan.mode, env.morgan.options));

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({extended: true}));

// Serve static files from the 'public' directory
app.use('/public', express.static(__dirname + '/public'));

// Middleware to parse cookies
app.use(cookieParser());


// Serve static files from the 'assets' directory
app.use(express.static(env.asset_path));


// Making the uploads path available for the browser 
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set up EJS for rendering views with layouts
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views');


// Configure and use express-session middleware
app.use(session({
    name: 'codeial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    // store: MongoStore.create({
    //     mongoUrl: "mongodb://localhost/passport_development",
    //     autoRemove: 'disabled'
    // })
}));

// Initialize Passport for authentication
app.use(passport.initialize());

// Use Passport session middleware
app.use(passport.session());

// Custom middleware to set authenticated user in views
app.use(passport.setAuthenticatedUser);

// Flash messages, uses session cookies, hence placed after session middleware
app.use(flash());
app.use(customMware.setFlash);

// Mount routes from './routes' directory
app.use('/', require('./routes'));

// Start the server and listen on the specified port
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
