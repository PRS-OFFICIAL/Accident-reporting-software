import { mongoose, Schema } from "mongoose";
const adminSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name of the officer is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    designation :{
        type:String,
        required : true,
    },
    branch :{
        type:String,
        required :true
    }
},{timestamps:true})

const Admin =  mongoose.model("Admin",adminSchema);
export default Admin;