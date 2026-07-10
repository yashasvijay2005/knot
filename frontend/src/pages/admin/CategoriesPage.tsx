import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/categories').then(res => {
      setCategories(res.data.categories);
    });
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/categories', { name, description }).then(() => {
      setName('');
      setDescription('');
      fetchCategories();
    });
  };

  const deleteCategory = (id: string) => {
    axios.delete(`http://localhost:5000/api/categories/${id}`).then(() => {
      fetchCategories();
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Categories</h1>

      <form onSubmit={addCategory} className="mb-8 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((cat: any) => (
          <li key={cat.id} className="flex justify-between border p-4 rounded items-center">
            <div>
              <strong>{cat.name}</strong> <br/>
              <span className="text-sm text-gray-600">{cat.description}</span>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
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
