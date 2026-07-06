import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Dashboard from './pages/Dashboard'
import TalentProfile from './pages/TalentProfile'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/talent" element={<TalentProfile />} />
        <Route path="/create-event" element={
          <PrivateRoute roles={['ORGANIZER', 'ADMIN']}><CreateEvent /></PrivateRoute>
        } />
        <Route path="/edit-event/:id" element={
          <PrivateRoute roles={['ORGANIZER', 'ADMIN']}><CreateEvent /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>
        } />
      </Routes>
    </>
  )
}
