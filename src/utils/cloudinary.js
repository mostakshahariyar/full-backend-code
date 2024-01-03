import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
        try {
                if (!localFilePath) return null;
                // upload the file cloudinary
                const respond = await cloudinary.uploader.upload(localFilePath,
                        {
                                resource_type: "auto"
                        })
                // file has been successfully uploaded
                console.log("file successfully uploaded on cloudinary", respond.url);
                return respond;
        } catch (error) {
                fs.unlinkSync(localFilePath); //remove temporary file

                return null;
        }
}

export { uploadOnCloudinary };