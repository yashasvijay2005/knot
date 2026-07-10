import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventApprovalPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('http://localhost:5000/api/events').then(res => {
      setEvents(res.data.events);
    });
  };

  const updateStatus = (id: string, status: string) => {
    axios.patch(`http://localhost:5000/api/events-approval/${id}/status`, { status }).then(() => {
      fetchEvents();
    });
  };

  const updateVisibility = (id: string, visibility: string) => {
    axios.patch(`http://localhost:5000/api/events-approval/${id}/visibility`, { visibility }).then(() => {
      fetchEvents();
    });
  };

  const statuses = ["PENDING", "APPROVED", "REJECTED"];
  const visibilities = ["PRIVATE", "COLLEGE", "SELECTED_COLLEGES", "PUBLIC"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Approvals & Visibility</h1>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Event Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Visibility</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event: any) => (
            <tr key={event.id}>
              <td className="border p-2">{event.title}</td>
              <td className="border p-2">{event.category?.name}</td>
              <td className="border p-2">
                <select
                  value={event.status}
                  onChange={(e) => updateStatus(event.id, e.target.value)}
                  className="border rounded p-1 w-full"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="border p-2">
                <select
                  value={event.visibility}
                  onChange={(e) => updateVisibility(event.id, e.target.value)}
                  className="border rounded p-1 w-full"
                >
                  {visibilities.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
