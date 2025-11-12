import mongoose from "mongoose";

const productschema = new mongoose.Schema({
    productid :{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },

    model:{
        type:String,
        required:true,
        default:"no model"
    },
    
    altnames:{
        type:[String], //we defined the type like this is an array since there are many alt names 
        default:[] //we can have multiple names since we have an array
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    labelledprice:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true,
        default:"no brand"
    },
    stock:{
        type:Number,
        required:true,
        default: 0
    },
    isavailable:{
        type:Boolean,
        default:true
    }
}
)

const Product=mongoose.model("product" , productschema)

export default Product;

