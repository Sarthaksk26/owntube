import dotenv from "dotenv";
import connectDb from "./db/index.js";

import express from "express";

dotenv.config()

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at PORT :  ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!!!", err);
});

const app = express();

