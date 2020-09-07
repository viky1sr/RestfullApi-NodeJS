const mongoose = require('mongoose');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
   name: {
       type: String,
       required: [true,'Please add a name']
   },
    email: {
       type: String,
        required: [true,'Please add a email'],
        unique: [true, 'Email has already been taken'],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    role: {
       type: String,
        enum: ['user','publisher'],
        default: 'user'
    },
    password: {
       type: String,
        required: [true,'Please add a password'],
        minlength: 6,
        match: [
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&-.])[0-9a-zA-Z@$!%*#?&]{8,}$/, 'Your password is so weak'
        ],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
       type: Date,
        default: Date.now()
    }
});

// Encrypt password using bycrpt
UserSchema.pre("save",async function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = await Bcrypt.hashSync(this.password, 10);
    next();
});

//Create Token JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ _id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

UserSchema.methods.matchPassword = async  function (enterPassword) {
    return await Bcrypt.compare(enterPassword, this.password );
}

module.exports = mongoose.model('User', UserSchema);