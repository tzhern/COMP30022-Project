const express = require('express');
const flash = require('connect-flash-plus');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { validateUserCookies } = require('./routes/utility')

require('dotenv').config();
require('./config/db'); // connect to database

// Define routers
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const customerRouter = require('./routes/customerRouter');
const orderRouter = require('./routes/orderRouter');

/* ----------------------Express configuration----------------------- */

const app = express();
app.use(express.json());
app.use(cookieParser());

let allowedOrigins = ['http://localhost:3000', 'https://aiti-crm.netlify.app'];

app.use(cors({
    credentials: true, // add Access-Control-Allow-Credentials to header
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            let msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// setup a session store signing the contents using the secret key
app.use(session({
    secret: process.env.PASSPORT_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000   //30 days
    }
}));

//middleware that's required for passport to operate
app.use(passport.initialize());

// middleware to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());

// we need to add the following line so that we can access the
// body of a POST request as  using JSON like syntax
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------------------------- */

app.use('/', userRouter); //for login signup etc
app.use('/product', validateUserCookies, passport.authenticate('jwt', { session: false }), productRouter);
app.use('/customer', validateUserCookies, passport.authenticate('jwt', { session: false }), customerRouter);
app.use('/order', validateUserCookies, passport.authenticate('jwt', { session: false }), orderRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port + '...');
})

module.exports = app;