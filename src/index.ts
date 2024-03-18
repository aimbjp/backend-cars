import dotenv from 'dotenv';
import express, { Express } from 'express';
import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;