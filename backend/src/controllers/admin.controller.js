import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import generateToken from "../middleware/generateToken.js";

const createAdmin = asyncHandler(async(req,res)=>{    
    const { name,designation,branch} = req.body;
    if (!(name &&designation && branch)) {
        throw new ApiError(404, "All fields are required");
    }

    const admin =   await Admin.create({
        name,
        designation,
        branch
    })
    await admin.save();
    const createAdmin = await Admin.findById(admin._id);
    if(!createAdmin){
        throw new ApiError(400,"Something went wrong while adding in the database")
    }
    return res.status(200).json( new ApiResponse(200,createAdmin,"Admin was added to into the database"));
})

const getAdmin = asyncHandler(async (req, res) => {
    const {name,email} = req.body;
    const admin = await Admin.findOne({$and :[{name:name},{email:email}]}).select("-email");
    return res.status(200).json(new ApiResponse(200,admin,"Admin fetched successfully"));    
});
const deleteAdmin = asyncHandler(async (req, res) => {
    const {name,email} = req.body;
    const deleteAdmin = await Admin.findOneAndDelete({$and:{name:name,email:email}});
    if(!deleteAdmin){
     throw new ApiError(404,"The admin do not exist");
    }
});
const updateAdmin = asyncHandler(async (req,res)=>{
    const {name,email,branch} = req.body;
    const updateFields = await Admin.findOneAndUpdate({$and :[{name:name},{email:email}]},{
        name, email, designation, branch
    },{
        new:true
    }).select("-email");
    if(!updateFields){
        throw new ApiError(404,"Failed to update the admin fields")
    }
    return res.status(200).json(new ApiResponse(200,updateFields,"successfully admin details updated"));    
})
 const signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, confirmPassword ,designation,branch} = req.body;  // destructure the request body to get user details

    if (!name || !email || !password || !confirmPassword|| !designation || !branch) {
      throw new ApiError(400,"All fields are required");
    }
    if (password !== confirmPassword) {
      throw new ApiError(400,"All passwords are not same");
    }
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
        throw new ApiError(400,"Admin already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ name, email, password: hashedPassword, designation, branch });
    await newAdmin.save();
    const addedAdmin = await Admin.findById(newAdmin._id);
    if(!addedAdmin){
        throw new ApiError(400,"Something went wrong while adding in the database")
    }
    console.log("Added Admin: ", addedAdmin);
    const token = await generateToken(addedAdmin._id);
    return res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json(new ApiResponse(201,addedAdmin,"Admin created successfully"));
  } catch (error) {
    console.error("Error during signup:", error);
   throw new ApiError(500,error.message || "Internal server error");
  }
});
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      new ApiError(400,"User(Admin) not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400,"Invalid credentials");
    }
    const token = generateToken(user._id);
    res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (error) {
    console.error("Error during login:", error);
    throw new ApiError(500,"Internal server error");
  }
});
const logout = (req, res) => {
  try {
    return res
      .clearCookie("token")
      .status(202)
      .json({ message: "Logout was successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    throw new ApiError(500,"Internal server error");
  }
};
export default{getAdmin,createAdmin,deleteAdmin,updateAdmin,signup,logout,login}