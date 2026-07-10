import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import VenuesPage from './pages/admin/VenuesPage';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import EventApprovalPage from './pages/admin/EventApprovalPage';
import LeaderboardPage from './pages/admin/LeaderboardPage';
import EventCreatePage from './pages/organizer/EventCreatePage';
import RegisterPage from './pages/student/RegisterPage';
import TicketPage from './pages/student/TicketPage';
import ScanPage from './pages/volunteer/ScanPage';
import NotificationsPage from './pages/student/NotificationsPage';
import CertificatesPage from './pages/student/CertificatesPage';
import CampusMapPage from './pages/student/CampusMapPage';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-100 flex gap-4 flex-wrap">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/admin/departments" className="text-blue-600">Admin: Departments</Link>
        <Link to="/admin/venues" className="text-blue-600">Admin: Venues</Link>
        <Link to="/admin/users" className="text-blue-600">Admin: Users</Link>
        <Link to="/admin/categories" className="text-blue-600">Admin: Categories</Link>
        <Link to="/admin/events" className="text-blue-600">Admin: Event Approvals</Link>
        <Link to="/admin/leaderboards" className="text-blue-600">Admin: Leaderboards</Link>
        <Link to="/organizer/events/new" className="text-green-600">Organizer: Create Event</Link>
        <Link to="/student/register" className="text-purple-600">Student: Registrations</Link>
        <Link to="/student/notifications" className="text-purple-600">Student: Notifications</Link>
        <Link to="/student/certificates" className="text-purple-600">Student: Certificates</Link>
        <Link to="/student/campus-map" className="text-purple-600">Student: Campus Map</Link>
        <Link to="/volunteer/scan" className="text-orange-600">Volunteer: Scan QR</Link>
      </div>
      <Routes>
        <Route path="/" element={<div className="p-8"><h1 className="text-3xl font-bold">Knot Marketing Website</h1></div>} />
        <Route path="/app/*" element={<div className="p-8"><h1 className="text-3xl font-bold">Knot Platform</h1></div>} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/venues" element={<VenuesPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/events" element={<EventApprovalPage />} />
        <Route path="/admin/leaderboards" element={<LeaderboardPage />} />
        <Route path="/organizer/events/new" element={<EventCreatePage />} />
        <Route path="/student/register" element={<RegisterPage />} />
        <Route path="/student/ticket/:registrationId" element={<TicketPage />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
        <Route path="/student/certificates" element={<CertificatesPage />} />
        <Route path="/student/campus-map" element={<CampusMapPage />} />
        <Route path="/volunteer/scan" element={<ScanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
