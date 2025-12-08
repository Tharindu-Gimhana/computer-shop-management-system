import mongoose from "mongoose";


const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type:String,
        required:true
    },

    lastname:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        default:"customer"
    },

    isblocked:{
        type:Boolean,
        default:false
    },

    isemailverified:{
        type:Boolean,
        default:false
    },

    image:{
        type:String,
        required:true,
        default:"./profile.png"
    }
})

const User=mongoose.model("user" , userschema)
export default User;
