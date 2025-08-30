import {Router} from "express";
import authorize from "../middleware/authorize.middleware.js";
import {createTask, deleteTask, getTaskById, getTasks, updateTask} from "../controller/task.contoller.js";
import upload from "../middleware/multer.middleware.js";
const taskRoutes = Router();



taskRoutes.post("/", authorize , upload.fields([
    {name: "taskImage" , maxCount: 1}
]), createTask)


taskRoutes.get("/", authorize , getTasks)

taskRoutes.get("/:id", authorize , getTaskById)

taskRoutes.put('/:id', authorize , updateTask)


taskRoutes.delete('/:id', authorize , deleteTask)



export default taskRoutes
