import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState(''); // Normally from context

  useEffect(() => {
    // For demo purposes we fetch the first college
    axios.get('http://localhost:5000/api/colleges').then(res => {
      const c = res.data.colleges[0];
      if (c) {
        setCollegeId(c.id);
        fetchDepartments(c.id);
      }
    });
  }, []);

  const fetchDepartments = (id: string) => {
    axios.get(`http://localhost:5000/api/departments/${id}`).then(res => {
      setDepartments(res.data.departments);
    });
  };

  const addDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return;
    axios.post('http://localhost:5000/api/departments', { name, collegeId }).then(() => {
      setName('');
      fetchDepartments(collegeId);
    });
  };

  const deleteDepartment = (deptId: string) => {
    axios.delete(`http://localhost:5000/api/departments/${deptId}`).then(() => {
      fetchDepartments(collegeId);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Department Management</h1>

      <form onSubmit={addDepartment} className="mb-8 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Department Name"
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Department
        </button>
      </form>

      <ul className="space-y-2">
        {departments.map((dept: any) => (
          <li key={dept.id} className="flex justify-between border p-4 rounded items-center">
            <span>{dept.name}</span>
            <button
              onClick={() => deleteDepartment(dept.id)}
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
