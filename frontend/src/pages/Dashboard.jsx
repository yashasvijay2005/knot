import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const { user } = useAuth()
  const [myEvents, setMyEvents] = useState([])
  const [myRegistrations, setMyRegistrations] = useState([])

  useEffect(() => {
    if (user?.role === 'ORGANIZER' || user?.role === 'ADMIN') {
      api.get('/events/my').then((res) => setMyEvents(res.data))
    }
    if (user?.role === 'ATTENDEE') {
      api.get('/registrations/my').then((res) => setMyRegistrations(res.data))
    }
  }, [user])

  const handleCancel = async (registrationId) => {
    if (!confirm('Cancel this registration?')) return
    await api.delete(`/registrations/${registrationId}`)
    setMyRegistrations(myRegistrations.filter((r) => r.id !== registrationId))
  }

  return (
    <div className="page">
      <h2>My Dashboard</h2>

      {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
        <>
          <h3>My Events</h3>
          <div className="card-grid">
            {myEvents.length === 0 && <p>You haven't created any events yet.</p>}
            {myEvents.map((ev) => (
              <div className="card" key={ev.id}>
                <h3><Link to={`/events/${ev.id}`}>{ev.title}</Link></h3>
                <p className="muted">{ev.category} • {ev.location}</p>
                <p>{new Date(ev.eventDate).toLocaleString()}</p>
                <p>{ev.registeredCount}{ev.capacity ? ` / ${ev.capacity}` : ''} registered</p>
              </div>
            ))}
          </div>
        </>
      )}

      {user?.role === 'ATTENDEE' && (
        <>
          <h3>My Registrations / Student Dashboard</h3>
          <div className="card-grid">
            {myRegistrations.length === 0 && <p>You haven't registered for any events yet.</p>}
            {myRegistrations.map((r) => (
              <div className="card" key={r.id}>
                <h3><Link to={`/events/${r.eventId}`}>{r.eventTitle}</Link></h3>
                <p className="muted">Registered on {new Date(r.registeredAt).toLocaleDateString()}</p>
                <p>Status: <strong>{r.status}</strong></p>
                <p>Payment: <strong>{r.paymentStatus}</strong></p>

                {r.paymentStatus === 'PENDING' && (
                  <button onClick={async () => {
                    try {
                      await api.post(`/registrations/${r.id}/pay`)
                      alert('Payment completed!')
                      api.get('/registrations/my').then((res) => setMyRegistrations(res.data))
                    } catch (err) {
                      alert('Payment failed')
                    }
                  }}>Pay Now</button>
                )}

                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <QRCodeSVG value={JSON.stringify({ registrationId: r.id, eventId: r.eventId })} size={128} />
                </div>

                {r.status === 'ATTENDED' && (
                  <button onClick={async () => {
                    try {
                      const res = await api.get(`/registrations/${r.id}/certificate`, { responseType: 'blob' })
                      const url = window.URL.createObjectURL(new Blob([res.data]))
                      const link = document.createElement('a')
                      link.href = url
                      link.setAttribute('download', `certificate-${r.eventId}.pdf`)
                      document.body.appendChild(link)
                      link.click()
                      link.parentNode.removeChild(link)
                    } catch (err) {
                      alert('Failed to download certificate')
                    }
                  }}>Download Certificate</button>
                )}

                <button className="danger" onClick={() => handleCancel(r.id)}>Cancel Registration</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
