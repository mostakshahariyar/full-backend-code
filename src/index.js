import dotenv from "dotenv"
import { app } from "./app.js";

import connectDB from "./db/index.js";
dotenv.config({
        path: "./env"
})


connectDB()
        .then(() => {
                app.listen(process.env.PORT || 3000, () => {
                        console.log(`server listening on ${process.env.PORT}`);
                })
        })
        .catch((error) => {
                console.log("Mongo db connection failed: " + error.message);
        })






















/*
(async () => {
        try {
                await mongoose.connect(`${process.env.MOSGODB_URI}/${DB_NAME}`)
                app.on('error', () => {
                        console.log("error ", error)
                })
                app.listen(process.env.PORT, () => {
                        console.log(`App is listening on ${process.env.PORT}`)
                })
        }
        catch (err) {
                console.log("errors: " + err)
        }
})()*/