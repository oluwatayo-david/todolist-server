import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import {uploadImage} from "../services/uploadService.js";




export const signUp =async  function(req, res , next) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {email , password , name} = req.body
        const files = req.files;


        //check for existing user with same email
        const  exisingUser  = await User.findOne({email})
        if (exisingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw  error;
        }

        // for password encyption
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);


        const userData = {
            email:  email ,
            password:  encryptedPassword ,
            name:  name
        }

        if (files && files.profileImage) {
            const imageFile = files.profileImage[0];
            const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);

            userData.profileImage = {
                publicId: imageResult.publicId,
                url: imageResult.url
            };
        }


        const newUsers = await User.create([userData] , {session})

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data:{
                token,
                user: newUsers[0]
            }
        })
    }catch (e) {
        await session.abortTransaction()
        session.endSession()
        next(e)
    }

}

export const signIn = async function(req, res , next) {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) {
            const error = new Error('Email not found');
            error.statusCode = 404;
            throw  error;
        }

        const verifyPassword = await bcrypt.compare(password , user.password)
        if(!verifyPassword) {
            const error = new Error('passwords not correct');
            error.statusCode = 404;
            throw  error;
        }




        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });



        res.status(200).json({
            success: true,
            message: 'User logged in successfully.',
            data:{
                token,
                user
            }
        })
    }catch (e) {
        next(e)
    }
}




/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
export async function logout(req, res) {
    try {

        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }

}


