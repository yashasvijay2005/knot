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
import eventRoutes from './routes/eventRoutes';
import eventApprovalRoutes from './routes/eventApprovalRoutes';
import registrationRoutes from './routes/registrationRoutes';
import ticketRoutes from './routes/ticketRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import notificationRoutes from './routes/notificationRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import certificateRoutes from './routes/certificateRoutes';
import campusMapRoutes from './routes/campusMapRoutes';

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
app.use('/api/events', eventRoutes);
app.use('/api/events-approval', eventApprovalRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/campus-map', campusMapRoutes);

app.get('/', (req, res) => {
  res.send('Knot API is running');
});
