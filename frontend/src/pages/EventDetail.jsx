import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchEvent = async () => {
    const res = await api.get(`/events/${id}`)
    setEvent(res.data)
  }

  const fetchRegistrations = async () => {
    if (!user) return
    try {
      const res = await api.get(`/registrations/event/${id}`)
      setRegistrations(res.data)
    } catch (err) {
      // not authorized, ignore
    }
  }

  useEffect(() => { fetchEvent(); fetchRegistrations() }, [id, user])

  const handleRegister = async () => {
    try {
      const res = await api.post(`/registrations/${id}`)

      if (event.price > 0) {
        if (confirm(`This event costs $${event.price}. Proceed to mock payment?`)) {
            await api.post(`/registrations/${res.data.id}/pay`)
            alert('Registered and paid successfully!')
        } else {
            alert('Registration created but payment is pending.')
        }
      } else {
        alert('Registered successfully!')
      }

      fetchEvent()
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      navigate('/events')
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (!event) return <p className="page">Loading...</p>

  const isOwner = user && user.userId === event.organizerId

  return (
    <div className="page">
      <h2>{event.title}</h2>
      <p className="muted">{event.category} • {event.location}</p>
      <p>{new Date(event.eventDate).toLocaleString()}</p>
      <p>{event.description}</p>
      <p>Price: ${event.price ? event.price.toFixed(2) : '0.00'}</p>
      <p>{event.registeredCount}{event.capacity ? ` / ${event.capacity}` : ''} registered</p>
      <p className="muted">Organized by {event.organizerName}</p>

      {user && user.role === 'ATTENDEE' && (
        <button onClick={handleRegister}>Register for this event</button>
      )}

      {isOwner && (
        <div className="owner-actions">
          <button onClick={() => navigate(`/edit-event/${event.id}`)}>Edit Event</button>
          <button className="danger" onClick={handleDelete}>Delete Event</button>
          <h3>Registrants ({registrations.length})</h3>
          <ul>
            {registrations.map((r) => (
              <li key={r.id} style={{ marginBottom: '10px' }}>
                {r.userName} — {r.userEmail} (Status: {r.status}, Payment: {r.paymentStatus})
                {r.status === 'REGISTERED' && (
                  <button
                    style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '0.8rem' }}
                    onClick={async () => {
                      try {
                        await api.patch(`/registrations/${r.id}/check-in`)
                        alert('User checked in!')
                        fetchRegistrations()
                      } catch (err) {
                        alert(err.response?.data?.message || 'Check-in failed')
                      }
                    }}
                  >
                    Check-in User
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
