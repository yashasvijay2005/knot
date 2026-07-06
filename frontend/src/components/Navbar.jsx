import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">KNOT</Link>
      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/talent">Talent</Link>
        {user && user.role === 'ORGANIZER' && <Link to="/create-event">Create Event</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span className="nav-user">Hi, {user.fullName}</span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
