import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';

export default function TicketPage() {
  const { registrationId } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [qrPayload, setQrPayload] = useState<string>('');

  useEffect(() => {
    if (!registrationId) return;
    axios.get(`http://localhost:5000/api/tickets/${registrationId}`).then(res => {
      setTicket(res.data.registration);
      setQrPayload(res.data.qrPayload);
    }).catch(err => alert("Error: " + err.response?.data?.error));
  }, [registrationId]);

  if (!ticket) return <div className="p-8">Loading Ticket...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-start">
      <div className="bg-white border rounded shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Event Ticket</h1>
        <h2 className="text-xl text-blue-600 mb-6">{ticket.event.title}</h2>

        <div className="flex justify-center mb-6">
          <QRCodeSVG value={qrPayload} size={200} />
        </div>

        <div className="text-left bg-gray-100 p-4 rounded text-sm">
          <p><strong>Name:</strong> {ticket.user?.firstName} {ticket.user?.lastName}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Start:</strong> {new Date(ticket.event.startDate).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
