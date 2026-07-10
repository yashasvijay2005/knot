import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [collegeId, setCollegeId] = useState('');

  useEffect(() => {
    // For demo purposes we fetch the first college
    axios.get('http://localhost:5000/api/colleges').then(res => {
      const c = res.data.colleges[0];
      if (c) {
        setCollegeId(c.id);
        fetchUsers(c.id);
      }
    });
  }, []);

  const fetchUsers = (id: string) => {
    axios.get(`http://localhost:5000/api/users/${id}`).then(res => {
      setUsers(res.data.users);
    });
  };

  const updateRole = (userId: string, role: string) => {
    axios.patch(`http://localhost:5000/api/users/${userId}/role`, { role }).then(() => {
      fetchUsers(collegeId);
    });
  };

  const deleteUser = (userId: string) => {
    axios.delete(`http://localhost:5000/api/users/${userId}`).then(() => {
      fetchUsers(collegeId);
    });
  };

  const roles = ["STUDENT", "VOLUNTEER", "ORGANIZER", "JUDGE", "COLLEGE_ADMIN", "SUPER_ADMIN"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td className="border p-2">{user.firstName} {user.lastName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 font-bold"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
