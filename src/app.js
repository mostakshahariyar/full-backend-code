import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use((req, res, next) => {
        res.header('Access-Control-Allow-Credentials', true);
        next();
});


// routes 

import userRouter from './routes/user.route.js';



// routes declarations
app.use("/api/v1/users", userRouter);



export { app };