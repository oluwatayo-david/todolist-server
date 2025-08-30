import {Router} from "express";
import {getAllUsers, getAUser, updateUser} from "../controller/user.controller.js";
import authorize from "../middleware/authorize.middleware.js";
import upload from "../middleware/multer.middleware.js";
const userRoutes = Router();



userRoutes.get("/", authorize,  getAllUsers)


userRoutes.get("/:id", authorize , getAUser)


userRoutes.put('/:id', authorize , upload.fields([
    {name: "profileImage" , maxCount: 1}
]),updateUser)

//  delete a user
userRoutes.delete('/:id', (req, res) => {
    res.send({message: 'DELETE a specific user'});
})


export default userRoutes
