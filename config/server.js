/* Setting the server's environment */

// Settings
const express = require('express'); // express allow the main comunication between frontend and the server by using routes
const bodyParser = require('body-parser'); // body-parser is used to read better the data from a request
const handlebars = require('express-handlebars'); // Handlebars provides the power necessary to let you build semantic templates effectively with no frustration
const path = require('path'); // Native library to manage file paths.
const flash = require('connect-flash'); // Library used to create global variables that are erased after be used.
const session = require('express-session'); // Used to allow every user of this server will be assigned a unique session

// Initialization of server:
const app = express();

// Setting midlewares
app.use(session({
    secret: 'fcasoftware',
    resave: true,
    saveUninitialized: true
}));

// Flash how a midleware allow to create global variables whoose value will be deleted once used  
app.use(flash());

// Creating global flash variables (This will be usefull to show flash messages to the user)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting engine used to create the frontend
app.engine('handlebars', handlebars({  defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

module.exports = app;