import dotenv from "dotenv"

import connectDB from "./db/index.js";
dotenv.config({
        path: "./env"
})


connectDB();





















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