const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const connectDB = require('./config/db')
const errorHandlers = require('./middleware/error')

connectDB();

dotenv.config({path: './config/config.env'});

const app = express();

// Body parser
app.use(express.json());

<!-- Dev loggin middleware -->
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

<!-- Router file -->
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

<!-- Mount routers -->
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);

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