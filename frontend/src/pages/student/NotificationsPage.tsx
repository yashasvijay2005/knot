import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = 'ea0b6b26-0b85-444e-b10d-b2a64c48ec31'; // Hardcoded for demo

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axios.get(`http://localhost:5000/api/notifications/user/${userId}`).then(res => {
      setNotifications(res.data.notifications);
    });
  };

  const markAsRead = (id: string) => {
    axios.patch(`http://localhost:5000/api/notifications/${id}/read`).then(() => {
      fetchNotifications();
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">My Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif: any) => (
            <li key={notif.id} className={`p-4 rounded border ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{notif.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
