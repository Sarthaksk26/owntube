import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config();


const connectDb = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB connected ! DB_HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
// const connectDb = async () => {
//     const mongoUri = process.env.MONGO_URI;
//     if (!mongoUri) {
//         throw new Error("MONGO_URI is not defined in .env file");
//     }
//     await mongoose.connect(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully!");
// };

export {connectDb};