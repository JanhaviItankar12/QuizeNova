import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ["admin", "teacher", "student"], 
        default: "user" 
    },

    createdAt: { type: Date, default: Date.now }

    //add more details as per user

},{timestamps:true});

export default mongoose.model("User",userSchema);
