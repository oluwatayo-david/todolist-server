import mongoose from 'mongoose';
import Task from '../model/task.model.js'
import {deleteFile, uploadImage} from "../services/uploadService.js";

export const createTask = async function(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, details, startDate, endDate } = req.body;
        const userId = req.user._id;


        const taskData = {
            name,
            details,
            user: userId
        };

        if (startDate) taskData.startDate = new Date(startDate);
        if (endDate) taskData.endDate = new Date(endDate);


            if ( req.files && req.files.taskImage) {
                const imageFile = req.files.taskImage[0];
                const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);

                taskData.taskImage = {
                    publicId: imageResult.publicId,
                    url: imageResult.url
                };
            }


        const data = await Task.create([taskData], { session });

        await session.commitTransaction();
        session.endSession();



        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data
        });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        next(e);
    }
};

export const getTasks = async function(req, res, next) {
    try {
        const userId = req.user._id;
        const data = await Task.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data
        });
    } catch (e) {
        next(e);
    }
};



export const getTaskById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const data = await Task.findOne({ _id: id, user: userId });

        if (!data) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }



        res.status(200).json({
            success: true,
            message: 'Task retrieved successfully.',
            data
        });
    } catch (e) {
        next(e);
    }
};


export const updateTask = async function(req, res, next) {


    try {
        const { id } = req.params;
         const userId = req.user._id;


        const taskData = {
            ...req.body
        };




            if (req.files &&  req.files.taskImage) {
                const imageFile = req.files.taskImage[0];
                const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);

                taskData.taskImage = {
                    publicId: imageResult.publicId,
                    url: imageResult.url
                };

        }


        const data = await Task.findOneAndUpdate(
            { _id: id, user: userId },
            taskData,
            { new: true, runValidators: true }
        );


        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data
        });
    } catch (e) {

        next(e);
    }

}


export const deleteTask =  async function(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const task = await Task.findOne({ _id: id, user: userId });

        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.taskImage && task.taskImage.publicId) {
            await deleteFile(task.taskImage.publicId);
        }


        const data = await Task.findByIdAndDelete({ _id: id } , { new: true, runValidators: true });





        res.status(201).json({
            success: true,
            message: 'Task deleted successfully.',
            data
        });
    } catch (e) {

        next(e);
    }
}