import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventCreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [registrationEnd, setRegistrationEnd] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // Normally fetched from auth context
  const [collegeId, setCollegeId] = useState('');
  const [organizerId, setOrganizerId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/colleges').then(res => {
      const c = res.data.colleges[0];
      if (c) {
        setCollegeId(c.id);
        axios.get(`http://localhost:5000/api/users/${c.id}`).then(uRes => {
          const org = uRes.data.users.find((u: any) => u.role === 'ORGANIZER');
          if (org) setOrganizerId(org.id);
        });
      }
    });

    axios.get('http://localhost:5000/api/categories').then(res => {
      setCategories(res.data.categories);
      if (res.data.categories.length > 0) {
        setCategoryId(res.data.categories[0].id);
      }
    });
  }, []);

  const createEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId || !organizerId) return alert("Missing context");

    axios.post('http://localhost:5000/api/events', {
      title, description, startDate, endDate, registrationEnd,
      maxParticipants, categoryId, organizerId, collegeId
    }).then(() => {
      alert("Event Created Successfully!");
      setTitle(''); setDescription('');
    }).catch(err => alert("Error: " + err.response?.data?.error));
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <form onSubmit={createEvent} className="flex flex-col gap-4">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="border p-2 rounded" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event Description" className="border p-2 rounded" required />

        <div className="flex gap-4">
          <label className="flex flex-col w-full">Start Date<input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" required /></label>
          <label className="flex flex-col w-full">End Date<input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" required /></label>
        </div>

        <label className="flex flex-col w-full">Registration Deadline<input type="datetime-local" value={registrationEnd} onChange={e => setRegistrationEnd(e.target.value)} className="border p-2 rounded" required /></label>

        <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} placeholder="Max Participants" className="border p-2 rounded" required />

        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border p-2 rounded">
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Event</button>
      </form>
    </div>
  );
}
