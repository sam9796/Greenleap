const mongoose=require("mongoose")

const roboSchema = mongoose.Schema({
    roboId:{
        type:String,
        required:true,
        trim:true,
    },
    workingHr: {
        type: String,
        required: true,
        trim: true
    },
    motor1: {
        type: String,
        trim: true
    },
    motor2: {
        type: String,
        trim: true
    },
    motor3: {
        type: String,
        trim: true
    },
    battery1: {
        type: String,
        trim: true
    },
    brushes: {
        type: String,
        trim: true
    },
    wheel: {
        type:String,
        trim:true,
        required:true,
    },
    battery2:{
        type:String,
        trim:true,
        required:true,
    }

});
// noinspection JSUnresolvedFunction
roboSchema.set('timestamps', true);
const Robot = mongoose.model('robots', roboSchema);
module.exports = Robot;