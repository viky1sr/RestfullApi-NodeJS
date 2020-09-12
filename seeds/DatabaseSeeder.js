const fs = require('fs');
const mongoose = require('mongoose');

// Load env var
require('dotenv').config({ path: './config/config.env' });

// Load Models
const Bootcamp = require('../models/bootcamps')
const Courses = require('../models/course')
const Users = require('../models/users')

// connect to DB
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

// Read JSON file location
const bootcampsJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../storage/data/bootcamps.json`, 'utf-8')
);
const coursesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../storage/data/courses.json`, 'utf-8')
);

// import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcampsJSON);
        await Courses.create(coursesJSON);

        console.log('Data imported...')
        process.exit();
    } catch (e) {
        console.error(e);
    }
}

// Delete data DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Courses.deleteMany();
        await Users.deleteMany();

        console.log('Data destroyed...')
        process.exit();
    } catch (e) {
        console.error(e);
    }
}

if(process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] === '-d') {
    deleteData();
}