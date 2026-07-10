import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [collegeId, setCollegeId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Dynamic fetching of ID for demo purposes
    axios.get('http://localhost:5000/api/colleges').then(res => {
      const c = res.data.colleges[0];
      if (c) {
        setCollegeId(c.id);
        axios.get(`http://localhost:5000/api/users/${c.id}`).then(uRes => {
          const student = uRes.data.users.find((u: any) => u.role === 'STUDENT' || u.role === 'ORGANIZER');
          if (student) {
            setUserId(student.id);
            fetchEvents(c.id);
            fetchRegistrations(student.id);
          }
        });
      }
    });
  }, []);

  const fetchEvents = (cId: string) => {
    axios.get(`http://localhost:5000/api/events?collegeId=${cId}`).then(res => {
      const activeEvents = res.data.events.filter((e: any) => e.status === 'APPROVED');
      setEvents(activeEvents);
    });
  };

  const fetchRegistrations = (uId: string) => {
    axios.get(`http://localhost:5000/api/registrations/user/${uId}`).then(res => {
      setRegistrations(res.data.registrations);
    });
  };

  const registerIndividual = (eventId: string) => {
    if (!userId) return;
    axios.post('http://localhost:5000/api/registrations/individual', { eventId, userId })
      .then(() => {
        alert("Successfully registered!");
        fetchRegistrations(userId);
      })
      .catch(err => {
        if (err.response?.status === 409) {
          alert("Smart Clash Detected: " + err.response.data.error);
        } else {
          alert("Error: " + err.response?.data?.error);
        }
      });
  };

  const isRegistered = (eventId: string) => {
    return registrations.some((r: any) => r.eventId === eventId);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Available Events (Student Dashboard)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event: any) => (
          <div key={event.id} className="border p-4 rounded shadow-sm bg-white">
            <h2 className="font-bold text-xl">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <p className="text-sm"><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
            <p className="text-sm mb-4"><strong>Type:</strong> {event.category?.name}</p>

            {isRegistered(event.id) ? (
              <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded inline-block mt-2">Registered</span>
            ) : (
              <button
                onClick={() => registerIndividual(event.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2 hover:bg-blue-700"
              >
                Register Now
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">My Registrations</h2>
      <ul className="space-y-2">
        {registrations.map((reg: any) => (
          <li key={reg.id} className="border p-4 rounded bg-white flex justify-between">
            <span>{reg.event?.title}</span>
            <span className={`font-bold ${reg.status === 'WAITLISTED' ? 'text-yellow-600' : 'text-green-600'}`}>
              {reg.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
