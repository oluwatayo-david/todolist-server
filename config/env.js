import {config} from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

export  const {PORT, NODE_ENV , DB_URI , JWT_EXPIRES_IN  , JWT_SECRET  , ARCJET_ENV , ARCJET_KEY , CLOUDINARY_API_KEY , CLOUDINARY_CLOUD_NAME , CLOUDINARY_API_SECRET} = process.env;