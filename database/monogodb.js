import {DB_URI , NODE_ENV} from '../config/env.js'
import mongoose from "mongoose";


if(!DB_URI){
    throw new Error(`MongoDB URI is missing .env.${NODE_ENV}.local`);
}
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI)
        console.log(`Connected to Database in ${NODE_ENV} mode `);
    }catch (e) {
        console.error('something went wrong', e);
        process.exit(1);
    }
}

export  default (connectToDatabase);