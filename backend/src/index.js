import dotenv from 'dotenv';
dotenv.config({path: '.env',debug:true});
import mongoose from "mongoose";
import connectDB from "./db/connectDB.js";
import { createServer, METHODS, Server } from "http";
import cors from "cors";
import app from "./app.js";
import path from "path";
import { debug } from 'console';

connectDB()
.then(()=>{
    const port = process.env.PORT||2000;
    app.listen(port,()=>{
        console.log(`Server is listening at the port ${port}`)
    })
})
.catch((err)=>{
    console.log("Could not connect to the sever ",err);
})
