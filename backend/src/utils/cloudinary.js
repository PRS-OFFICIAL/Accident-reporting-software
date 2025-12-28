import dotenv from 'dotenv';
dotenv.config({path: '.env',debug:true});
import cloudinary from 'cloudinary';
import { ApiError } from './ApiError.js';
import asyncHandler from './asyncHandler.js';

cloudinary.config({
  cloud_name: 'dfdpwwhhg',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadCloudinary = asyncHandler(async (localFilePath) => {
//     if (!localFilePath) {
//         console.error("No file path provided for Cloudinary upload.");
//         throw new ApiError(400, "No file path provided for upload");
//     }
//     const options={
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true,
//         resource_type:"auto"
//     }
//   try {
//     const result = await cloudinary.v2.uploader.upload_stream(localFilePath, {
//       folder: "incident_reports",...options      
//     });
//     console.log(result);
//     console.log("Cloudinary upload result:", result.url);
//     return result;
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);
//     return null;
//   }
// });
const uploadCloudinary = async (imageData) => {
    return await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
        if (error) {
            return reject(error);
        }
        return resolve(uploadResult);
    }).end(imageData);
})
};
export default uploadCloudinary;