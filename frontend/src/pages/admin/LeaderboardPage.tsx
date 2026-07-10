import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaderboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => {
      setEvents(res.data.events);
      if (res.data.events.length > 0) {
        setSelectedEventId(res.data.events[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    axios.get(`http://localhost:5000/api/leaderboard/${selectedEventId}`).then(res => {
      setLeaderboard(res.data.leaderboard);
    });
  }, [selectedEventId]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Event Leaderboards</h1>

      <div className="mb-6 flex items-center gap-4">
        <label className="font-bold">Select Event:</label>
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          {events.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b p-4 text-left font-bold text-gray-700 w-16">Rank</th>
              <th className="border-b p-4 text-left font-bold text-gray-700">Participant ID</th>
              <th className="border-b p-4 text-right font-bold text-gray-700">Average Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr><td colSpan={3} className="text-center p-8 text-gray-500">No scores submitted yet.</td></tr>
            ) : (
              leaderboard.map((row: any, index: number) => (
                <tr key={row.participantId} className="hover:bg-gray-50">
                  <td className="border-b p-4 font-bold text-lg text-gray-500 text-center">#{index + 1}</td>
                  <td className="border-b p-4 font-mono text-sm text-gray-600">{row.participantId}</td>
                  <td className="border-b p-4 text-right text-green-600 font-bold text-lg">{row.averageScore.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
