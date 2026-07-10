import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const collegeId = '4a92a461-1670-4e29-82cb-221cd28f9f22'; // Hardcoded demo college

  useEffect(() => {
    axios.get(`http://localhost:5000/api/colleges`).then(res => {
      const c = res.data.colleges[0];
      if (c) {
        axios.get(`http://localhost:5000/api/analytics/${c.id}`).then(aRes => {
          setData(aRes.data);
        });
      }
    });
  }, []);

  if (!data) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-blue-100 p-6 rounded shadow text-center">
          <div className="text-4xl font-bold text-blue-700">{data.summary.totalUsers}</div>
          <div className="text-gray-600 font-semibold mt-2">Total Users</div>
        </div>
        <div className="bg-green-100 p-6 rounded shadow text-center">
          <div className="text-4xl font-bold text-green-700">{data.summary.totalEvents}</div>
          <div className="text-gray-600 font-semibold mt-2">Total Events</div>
        </div>
        <div className="bg-purple-100 p-6 rounded shadow text-center">
          <div className="text-4xl font-bold text-purple-700">{data.summary.totalRegistrations}</div>
          <div className="text-gray-600 font-semibold mt-2">Registrations</div>
        </div>
        <div className="bg-orange-100 p-6 rounded shadow text-center">
          <div className="text-4xl font-bold text-orange-700">{data.summary.totalCheckIns}</div>
          <div className="text-gray-600 font-semibold mt-2">Check-ins</div>
        </div>
      </div>

      <div className="bg-white border rounded shadow p-6 mb-8 h-96">
        <h2 className="text-xl font-bold mb-4">Events by Category</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="events" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
