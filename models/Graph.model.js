const mongoose=require("mongoose")
const graph=mongoose.Schema({
        month:{
            type:String,
            required:true,
            trim:true
        },
        year:{
            type:String,
            required:true,
            trim:true
        },
        workingHrs:{
            type:[String],
            required:true
        }
})
const graphmodel = mongoose.Schema({
    roboId:{
        type:String,
        required:true,
        trim:true,
    },
    graph_list:{
        type:[graph],
        required:true,
    }
});
// noinspection JSUnresolvedFunction
graphmodel.set('timestamps', true);
const Graph = mongoose.model('graph',graph);
const GraphModel=mongoose.model('graphmodel',graphmodel)
module.exports = {"Graph":Graph,"GraphModel":GraphModel};