const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    number: {
        type: String,
        trim: true
    },
    capacity: {
        type: String,
        trim: true
    },
    GPSx: {
        type: String,
        trim: true
    },
    GPSy: {
        type: String,
        trim: true
    },
    robots: [{
        type:String,
        trim:true,
        required:true,
    }]
});
// noinspection JSUnresolvedFunction
clientSchema.set('timestamps', true);
const Client = mongoose.model('clients', clientSchema);
module.exports = Client;