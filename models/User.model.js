const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim:true
    },
    password:{
        type:String,
        required: true,
        trim:true,
    },
    Admin:{
        type:Boolean,
        required:true,
        trim:true,
    },
    Phone:{
        type:String,
        required:true,
        trim:true,
    },
    Designation:{
        type:String,
        required:true,
        trim:true,
    },
    Sites:[{
        type:String,
        required:true,
        trim:true,
    }]

});
const User = mongoose.model('user',userSchema);
module.exports = User;