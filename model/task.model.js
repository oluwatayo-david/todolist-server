import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    details: {
        type: String,
        required: [true, 'Details is required'],
        trim: true,
        minLength: 2,
    },

    startDate: {
        type: Date,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        }
    },


    endDate: {
        type: Date,
        validate: {
            validator: (value) => value >= new Date(),
            message: 'end date must be in the future',
        }
    },


    taskImage: {
        publicId: String,
        url: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });


// Auto-calculate renewal date if missing.
taskSchema.pre('save', function (next) {
    if(!this.startDate) {
        this.startDate= new Date();
    }

    next();
});



const task = mongoose.model("Task", taskSchema);

export default task;
