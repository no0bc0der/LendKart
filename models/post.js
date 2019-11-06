var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    imagePath : {type:String,required:true},
    title : {type:String,required:true},
    price : {type:Number,required:true},
    basis : {type:String,required:true},
    name : {type:String,required:true}
});

module.exports = mongoose.model('Post', schema);
