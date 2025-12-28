import mongoose from "mongoose";

async function connectDB(){
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`);
        console.log(`Connected to the MongoDB!! `,connectionInstance.connection.host);
    } catch (error) {
        console.log("Failed to connect with mongoDB ",error);
        process.exit(1);
    }
}
export default connectDB;