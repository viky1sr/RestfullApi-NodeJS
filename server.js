const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser')

const connectDB = require('./config/db')
const errorHandlers = require('./middleware/error')

connectDB();

dotenv.config({path: './config/config.env'});

const app = express();
app.use(session({
    secret: 'positronx',
    saveUninitialized: false,
    resave: false
}));

app.use(cookieParser())

// Body parser
app.use(express.json());

<!-- Dev login middleware -->
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File Upload
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

<!-- Router file -->
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const { body } = require('express-validator');

<!-- Mount routers -->
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);

// Error Handle
app.use(errorHandlers);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close Server and Exite
    server.close(() => process.exit(1));
})