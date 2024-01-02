import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () => {
        try {
                const connectionInstance = await mongoose.connect(`${process.env.MOSGODB_URI}/${DB_NAME}`);
                console.log("\n Mongoose connection established Host!!: ", connectionInstance.connection.host);
        } catch (error) {
                console.log("Mongoose connection error: ", error);
                process.exit(1);
        }
}

export default connectDB;