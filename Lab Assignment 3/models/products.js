const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        default:0,
    },
    stock:{
        type:Number,
        required:true,
        default:1,
    }
    ,
    imagePath: {
        type: String,
        required: false,
        default: ""
    }
});

module.exports = mongoose.model("Product",productSchema);