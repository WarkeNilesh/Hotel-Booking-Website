import express from "express";
const app = express()

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import cookieParser from "cookie-parser";


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongoDB");
    } catch (error) {
        console.log(error);
    }

};


//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoute);
app.use("/api/rooms",roomsRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/users",usersRoute);

mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDB disconnected")
});

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
});

app.listen(3000, () => {
    connect()
    console.log("connected to backend");
})