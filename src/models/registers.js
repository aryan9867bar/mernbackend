const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema({
    FirstName : {
        type:String,
        required:true,
        minLength:3,
    },
    MiddleName : {
        type:String,
        minLength:3,
    },
    LastName : {
        type:String,
        required:true,
        minLength:3,
    },
    Gender : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        required:true,
        unique:[true,"E-mail id already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid Email");
            } 
        }
    },
    phone : {
        type:Number,
        required:true,
        min:10,
        unique:true,
    },
    address : {
        type:String,
        required:true,
    },
    Password : {
        type:String,
        required:true,
    },
    ConfirmPassword : {
        type:String,
        required:true,
    },

});

const Register = new mongoose.model('Register', clientSchema);

module.exports = Register;