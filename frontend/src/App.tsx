import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import VenuesPage from './pages/admin/VenuesPage';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-100 flex gap-4">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/admin/departments" className="text-blue-600">Admin: Departments</Link>
        <Link to="/admin/venues" className="text-blue-600">Admin: Venues</Link>
        <Link to="/admin/users" className="text-blue-600">Admin: Users</Link>
        <Link to="/admin/categories" className="text-blue-600">Admin: Categories</Link>
      </div>
      <Routes>
        <Route path="/" element={<div className="p-8"><h1 className="text-3xl font-bold">Knot Marketing Website</h1></div>} />
        <Route path="/app/*" element={<div className="p-8"><h1 className="text-3xl font-bold">Knot Platform</h1></div>} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/venues" element={<VenuesPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/*" element={<div className="p-8"><h1 className="text-3xl font-bold">Knot Admin Console</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
