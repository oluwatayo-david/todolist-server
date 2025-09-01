import express from 'express';
import cookieParser from "cookie-parser";
import {PORT} from "./config/env.js";
import connectToDatabase from "./database/monogodb.js";
import protectionMiddleware from "./middleware/arcjet.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import taskRoutes from "./routes/task.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(protectionMiddleware);

// Routes come after CORS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('welcome to my server');
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log(`Server started on port: http://localhost:${PORT}`);
    await connectToDatabase();
});