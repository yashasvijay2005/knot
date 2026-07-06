import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function TalentProfile() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [form, setForm] = useState({ skills: '', bio: '', portfolioLink: '' })
  const [editing, setEditing] = useState(false)

  const fetchProfiles = async () => {
    const res = await api.get('/talent-profiles')
    setProfiles(res.data)
  }

  const fetchMine = async () => {
    if (!user) return
    try {
      const res = await api.get('/talent-profiles/me')
      setForm({
        skills: res.data.skills || '',
        bio: res.data.bio || '',
        portfolioLink: res.data.portfolioLink || ''
      })
    } catch (err) {
      // no profile yet, that's fine
    }
  }

  useEffect(() => { fetchProfiles(); fetchMine() }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.put('/talent-profiles/me', form)
    setEditing(false)
    fetchProfiles()
  }

  return (
    <div className="page">
      <h2>Talent Network</h2>
      <p className="muted">Discover skilled people connected through KNOT events, or showcase your own talent.</p>

      {user && (
        <div className="form-container">
          <h3>My Talent Profile</h3>
          {!editing ? (
            <>
              <p><strong>Skills:</strong> {form.skills || '—'}</p>
              <p><strong>Bio:</strong> {form.bio || '—'}</p>
              <p><strong>Portfolio:</strong> {form.portfolioLink || '—'}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input name="skills" placeholder="Skills (e.g. Dance, Public Speaking)" value={form.skills} onChange={handleChange} />
              <textarea name="bio" placeholder="Short bio" value={form.bio} onChange={handleChange} rows={3} />
              <input name="portfolioLink" placeholder="Portfolio link (optional)" value={form.portfolioLink} onChange={handleChange} />
              <button type="submit">Save Profile</button>
            </form>
          )}
        </div>
      )}

      <h3>Browse Talent</h3>
      <div className="card-grid">
        {profiles.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.fullName}</h3>
            <p><strong>Skills:</strong> {p.skills || '—'}</p>
            <p>{p.bio}</p>
            {p.portfolioLink && <a href={p.portfolioLink} target="_blank" rel="noreferrer">Portfolio</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
