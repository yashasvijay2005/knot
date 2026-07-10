import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeedbackPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const userId = 'ea0b6b26-0b85-444e-b10d-b2a64c48ec31'; // Hardcoded for demo

  useEffect(() => {
    // Only fetch events that the user is confirmed for (or assume any active event)
    axios.get('http://localhost:5000/api/events').then(res => {
      setEvents(res.data.events);
      if (res.data.events.length > 0) {
        setSelectedEventId(res.data.events[0].id);
      }
    });
  }, []);

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/feedback', {
      eventId: selectedEventId,
      userId,
      rating,
      comment
    }).then(res => {
      alert(`Feedback Submitted! AI Sentiment: ${res.data.feedback.sentiment}`);
      setComment('');
    }).catch(err => alert("Error: " + err.response?.data?.error));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Event Feedback</h1>

      <form onSubmit={submitFeedback} className="bg-white p-6 rounded shadow border">
        <div className="mb-4">
          <label className="block font-bold mb-2">Select Event:</label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {events.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Rating (1-5):</label>
          <select
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">Comment:</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="border p-2 rounded w-full h-32"
            placeholder="Tell us what you thought about the event..."
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
