import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import exampleRouter from './routes/example';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import paymentRouter from './routes/payment.route';
import connectDB from './utils/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', exampleRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter);

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(Number(port), () => {
  console.log(`Server running on http://localhost:${port}`);
  connectDB()
});
