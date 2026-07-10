import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [collegeId, setCollegeId] = useState('');

  useEffect(() => {
    // For demo purposes we fetch the first college
    axios.get('http://localhost:5000/api/colleges').then(res => {
      const c = res.data.colleges[0];
      if (c) {
        setCollegeId(c.id);
        fetchVenues(c.id);
      }
    });
  }, []);

  const fetchVenues = (id: string) => {
    axios.get(`http://localhost:5000/api/venues/${id}`).then(res => {
      setVenues(res.data.venues);
    });
  };

  const addVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return;
    axios.post('http://localhost:5000/api/venues', { name, capacity: Number(capacity), collegeId }).then(() => {
      setName('');
      setCapacity('');
      fetchVenues(collegeId);
    });
  };

  const deleteVenue = (venueId: string) => {
    axios.delete(`http://localhost:5000/api/venues/${venueId}`).then(() => {
      fetchVenues(collegeId);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Venue Management</h1>

      <form onSubmit={addVenue} className="mb-8 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Venue Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="Capacity"
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Venue
        </button>
      </form>

      <ul className="space-y-2">
        {venues.map((venue: any) => (
          <li key={venue.id} className="flex justify-between border p-4 rounded items-center">
            <span>{venue.name} (Capacity: {venue.capacity})</span>
            <button
              onClick={() => deleteVenue(venue.id)}
              className="text-red-600 font-bold"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
