import dotenv from 'dotenv';
import express, { Express } from 'express';
import authRoutes from './routes/auth-routes';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app;