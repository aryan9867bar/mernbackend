require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');


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
    tokens : [{
        token:{
            type:String,
            required:true,
        }
    }]
});
clientSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this .tokens.concat({token:token}) 
        await this.save();
        return token;
    } catch (error){
         res.send("the error part" + error);   
         console.log("the error part" + error);
    }
};

clientSchema.pre("save",async function(next) {
    if(this.isModified("Password")){
        // console.log(`the current password is ${this.Password}`);
        this.Password = await bcrypt.hash(this.Password,10);
        // console.log(`the current password is ${this.Password}`);
        this.ConfirmPassword = await bcrypt.hash(this.Password,10);
    }
    next();
});


const Register = new mongoose.model('Register', clientSchema);

module.exports = Register;