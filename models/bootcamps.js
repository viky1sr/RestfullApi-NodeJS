const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../partial/geocoder')

const bootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: 255
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxLength: 255
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxLength: [13,'Phone number cant be longer than 13 characters'],
        minLength: [8,'Phone number min 8 characters']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required : [true , 'Please add an address']
    },
    location: {
        // https://mongoosejs.com/docs/geojson.html
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formatAddress: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'System Analyst',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1,'Rating must be at least 1'],
        max: [10,'Rating must cant be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'default.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default:false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Create bootcamp slug from the name
bootcampSchema.pre('save', function (next) {
   this.slug = slugify(this.name+'_'+ this.email, { lower: true });
   next();
});

//Geocoder & create location field
bootcampSchema.pre('save',async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formatAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,

    }
    // Do not save address in DB
    this.address = undefined;
    next();
})

module.exports = mongoose.model('Bootcamp', bootcampSchema)