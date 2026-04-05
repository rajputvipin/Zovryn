import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import recordRoutes from './routes/records.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
