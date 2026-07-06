import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([])
  const [error, setError] = useState('')

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get('/events/pending')
      setPendingEvents(res.data)
    } catch (err) {
      setError('Failed to fetch pending events')
    }
  }

  useEffect(() => {
    fetchPendingEvents()
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/events/${id}/approve`)
      fetchPendingEvents()
    } catch (err) {
      alert('Failed to approve event')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this event?')) return
    try {
      await api.patch(`/events/${id}/reject`)
      fetchPendingEvents()
    } catch (err) {
      alert('Failed to reject event')
    }
  }

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <p>Manage pending events.</p>

      {error && <p className="error">{error}</p>}

      <h3>Pending Events</h3>
      {pendingEvents.length === 0 ? (
        <p>No pending events to review.</p>
      ) : (
        <ul className="event-list">
          {pendingEvents.map(ev => (
            <li key={ev.id} className="event-card">
              <h4>{ev.title}</h4>
              <p>{ev.description}</p>
              <p>Organizer: {ev.organizerName}</p>
              <p>Price: ${ev.price?.toFixed(2) || '0.00'}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleApprove(ev.id)}>Approve</button>
                <button className="danger" onClick={() => handleReject(ev.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
