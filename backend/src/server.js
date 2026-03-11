import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import routes from './routes/index.routes.js';
import { connectDB } from '../config/db.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

export { io };

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);

// Middleware
app.use(express.json());

// API routes
routes(app);

connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server chạy tại port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });
