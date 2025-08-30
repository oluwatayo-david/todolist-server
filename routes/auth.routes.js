import {Router} from 'express';
import {logout, signIn, signUp} from "../controller/auth.controller.js";
import upload from "../middleware/multer.middleware.js";

const authRouter = Router();


authRouter.post('/sign-up', upload.fields([
    {name: "profileImage" , maxCount: 1}
]), signUp)



authRouter.post('/sign-in',signIn)


authRouter.post('/log-out', logout)

export default authRouter