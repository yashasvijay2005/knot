import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import venueRoutes from './routes/venueRoutes';
import userRoutes from './routes/userRoutes';
import eventCategoryRoutes from './routes/eventCategoryRoutes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', eventCategoryRoutes);

app.get('/', (req, res) => {
  res.send('Knot API is running');
});
