import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter a name"],
        trim: true,
        minLength: 3,
        maxLength: 100
    },



    email:{
        type: String,
        required: [true, "Please enter a valid email"],
        trim: true,
        minLength: 5,
        maxLength: 200,
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        lowercase: true
    },


    password:{
        type: String,
        required: [true, "Please enter a valid password"],
        minLength: 5,

    }
    
  ,
    profileImage: {
        publicId: String,
        url: String,
    }

} ,{timestamps: true} );


const User = mongoose.model("User", userSchema);

export default User;