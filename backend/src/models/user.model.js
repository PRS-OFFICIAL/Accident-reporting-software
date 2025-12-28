import { name } from "ejs";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const  userSchema = new Schema({
    username:{
        type: String,
        required:[true,"Username is required"]
    },
    email:{
        type: String,
        required:[true,"Email is required"]
    },
    description:{
        type:String,
        required:[true,"Description is required"],
    },
    phoneNumber:{
        type:Number,
        minlength :10,
        maxlength :10,
        required:[true,"Phone number is required"]
    },    
    Incident:{
        type:String,
        required:[true,"Incident is required"],
        enum : ["Medical","Fire","Ilegal"]
    },
    location :{
        type:String,
        required:[true,"location is required"]
    },    
    severity:{
        type:String,
        required:[true,"Severity is required"]
    },
    status:{
        type: Boolean,
        required:[true,"Whether the report is solved ?"]
    },
    image :{
        type:String,
        required:true,
    }
},{timestamps:true});

const User =  mongoose.model("User",userSchema);

export default User;