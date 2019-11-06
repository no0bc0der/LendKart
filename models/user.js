var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type:String, required :true},
    password: {type:String, required: true},
    // fname: {type:String, required: true },
    // lname: {type:String, required: true },
    // an: {type:Number, required: true}
    
});

userSchema.methods.encryptPassword= function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);
