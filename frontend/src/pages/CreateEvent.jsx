import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function CreateEvent() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', eventDate: '', capacity: '', price: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then((res) => {
        const ev = res.data
        setForm({
          title: ev.title,
          description: ev.description || '',
          category: ev.category || '',
          location: ev.location || '',
          eventDate: ev.eventDate ? ev.eventDate.slice(0, 16) : '',
          capacity: ev.capacity || '',
          price: ev.price || ''
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
        price: form.price ? Number(form.price) : 0
    }
    try {
      if (isEdit) {
        await api.put(`/events/${id}`, payload)
      } else {
        await api.post('/events', payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event')
    }
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={4} />
        <input name="category" placeholder="Category (e.g. Music, Tech, Dance)" value={form.category} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <label>Event Date &amp; Time</label>
        <input name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
        <input name="capacity" type="number" placeholder="Capacity (optional)" value={form.capacity} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price ($)" value={form.price} onChange={handleChange} />
        <button type="submit">{isEdit ? 'Update Event' : 'Create Event'}</button>
      </form>
    </div>
  )
}
