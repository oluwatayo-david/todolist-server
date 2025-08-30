
import User from "../model/user.model.js";
import {deleteFile, uploadImage} from "../services/uploadService.js";



export const getAllUsers = async (req , res, next) => {
    try {
        const users =await  User.find()

        if(!users){
            const error = new Error("No users found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully.',
            data: users
        })

    }catch (e) {
        next(e)
    }
}


export const getAUser = async (req , res , next) => {
    try {
        const user = await  User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error("No user found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: user
        })

    }catch (e) {
        next(e)
    }
}

export const updateUser = async (req , res , next) => {
    try {
        const files = req.files;
 const {name , email} = req.body;

 const userData = {
     name: name ,
     email:email
 }
        const user = await  User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error("No user found.");
            error.statusCode = 404;
            throw error;
        }

        if (user.profileImage && user.profileImage.publicId && files && files.profileImage) {
            await deleteFile(user.profileImage.publicId);
        }



        if (files && files.profileImage) {
            const imageFile = files.profileImage[0];
            const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);

            userData.profileImage = {
                publicId: imageResult.publicId,
                url: imageResult.url
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            userData,
            { new: true, runValidators: true }
        )




        res.status(200).json({
            success: true,
            message: 'Users updated  successfully',
            data: updatedUser
        })

    }catch (e) {
        next(e)
    }
}








