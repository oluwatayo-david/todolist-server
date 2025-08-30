import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";


const authorize = async (req , res , next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }



        if(!token) {
            res.status(401).json({ message:"unauthorized"});

        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId)

        if(!user){
            res.status(401).json({ message:"Unauthorized"});
        }



        req.user = user

        next();

    }catch (e) {
        res.status(401).json({ message:"unauthorized", error: e});
    }


}

export default authorize;