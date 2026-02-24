import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ marginTop: '80px' }} />
      <Router>
        <div className="min-h-screen bg-gray-50" style={{ backgroundImage: `url('/images/HPimg2.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <Navbar />
          <main className="container mx-auto pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/donor-dashboard"
                element={
                  <PrivateRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ngo-dashboard"
                element={
                  <PrivateRoute allowedRoles={['ngo']}>
                    <NGODashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/volunteer-dashboard"
                element={
                  <PrivateRoute allowedRoles={['volunteer']}>
                    <VolunteerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
