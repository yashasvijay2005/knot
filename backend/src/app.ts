import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);

app.get('/', (req, res) => {
  res.send('Knot API is running');
});
