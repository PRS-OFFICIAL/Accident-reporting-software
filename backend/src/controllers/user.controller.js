import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadCloudinary from "../utils/cloudinary.js";

const getUser = asyncHandler(async(req, res) => {
    const{username,email} = req.body;
    const user = await User.findOne({$and :[{username:username},{email:email}]}).select("-email");
    return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"));    
})
const status= asyncHandler(async(req, res) => {
    const{status} = req.body;
    const user = await User.findOne({status:{$eq:false}}).select("-email");
    return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"));    
})
const createUser = asyncHandler(async (req, res) => {
    const { username,email,description, phoneNumber, Incident, location, severity, status } = req.body;
    if (!(username && description && phoneNumber && Incident && location && severity)) {
        throw new ApiError(404, "All fields are required");
    }
    const imageToUpload = await uploadCloudinary(req.file.buffer);
     console.log(imageToUpload);
    if(!imageToUpload){
        throw new ApiError(500,"Image upload failed");
    }    
    const user =   await User.create({
        username,
        email,
        description,
        phoneNumber,
        Incident,
        location,
        severity,
        status,
        image : imageToUpload.secure_url 
    })
    await user.save();
    const createUser = await User.findById(user._id).select("-email");
    if(!createUser){
        throw new ApiError(400,"Something went wrong while adding in the database")
    }
    return res.status(200).json( new ApiResponse(200,createUser,"User was added to into the database"));
})
const deleteUser = asyncHandler(async (req, res) => {
   const deleteUser = await User.findByIdAndDelete(req._id);
   if(!deleteUser){
    throw new ApiError(404,"The user do not exist");
   }
})

const updateStatus = asyncHandler(async (req, res) => {
    const {username,email,status } = req.body;
    const updateFields = await User.findOneAndUpdate({$and :[{username:username},{email:email}]},{
        status
    },{
        new:true
    }).select("-email");
    if(!updateFields){
        throw new ApiError(404,"Failed to update the status")
    }
    return res.status(200).json(new ApiResponse(200,updateFields,"Fields were updated"));    
})

const updateUser = asyncHandler(async (req, res) => {
    const {username, email, description, phoneNumber, Incident, location, severity, status } = req.body;
    const updateFields = await User.findOneAndUpdate({$and :[{username:username},{email:email}]},{
        username, description, phoneNumber, Incident, location, severity, status
    },{
        new:true
    }).select("-email");
    if(!updateFields){
        throw new ApiError(404,"Failed to update the fields")
    }
    return res.status(200).json(new ApiResponse(200,updateFields,"Fields were updated"));    
})
export default { getUser, createUser, deleteUser, updateUser ,updateStatus,status}