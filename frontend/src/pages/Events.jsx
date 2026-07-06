import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Events() {
  const [events, setEvents] = useState([])
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = {}
      if (keyword) params.keyword = keyword
      if (category) params.category = category
      const res = await api.get('/events', { params })
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/registrations/${eventId}`)
      alert('Registered successfully!')
      fetchEvents()
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="page">
      <h2>Discover Events</h2>
      <form className="search-bar" onSubmit={handleSearch}>
        <input placeholder="Search by title..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <input placeholder="Filter by category..." value={category} onChange={(e) => setCategory(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {loading ? <p>Loading events...</p> : (
        <div className="card-grid">
          {events.length === 0 && <p>No events found.</p>}
          {events.map((ev) => (
            <div className="card" key={ev.id}>
              <h3><Link to={`/events/${ev.id}`}>{ev.title}</Link></h3>
              <p className="muted">{ev.category} • {ev.location}</p>
              <p>{new Date(ev.eventDate).toLocaleString()}</p>
              <p>{ev.registeredCount}{ev.capacity ? ` / ${ev.capacity}` : ''} registered</p>
              <p className="muted">by {ev.organizerName}</p>
              {user && user.role === 'ATTENDEE' && (
                <button onClick={() => handleRegister(ev.id)}>Register</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
