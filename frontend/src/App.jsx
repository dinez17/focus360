import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/routes/ProtectedRoute';

import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public pages (placeholders for now — built out in 14B/14C)
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Services from '@/pages/public/Services';
import Products from '@/pages/public/Products';
import ProductDetail from '@/pages/public/ProductDetail';
import Projects from '@/pages/public/Projects';
import ProjectDetail from '@/pages/public/ProjectDetail';
import Gallery from '@/pages/public/Gallery';
import Testimonials from '@/pages/public/Testimonials';
import Contact from '@/pages/public/Contact';
import PrivacyPolicy from '@/pages/public/PrivacyPolicy';

// Admin pages (placeholders for now — built out in 14D)
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ManageProducts from '@/pages/admin/ManageProducts';
import ManageCategories from '@/pages/admin/ManageCategories';
import ManageServices from '@/pages/admin/ManageServices';
import ManageProjects from '@/pages/admin/ManageProjects';
import ManageGallery from '@/pages/admin/ManageGallery';
import ManageTestimonials from '@/pages/admin/ManageTestimonials';
import ManageLeads from '@/pages/admin/ManageLeads';
import ManageSettings from '@/pages/admin/ManageSettings';
import ChangePassword from '@/pages/admin/ChangePassword';
import ManageCustomers from '@/pages/admin/ManageCustomers';
import ManageStaff from '@/pages/admin/ManageStaff';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Route>

            {/* Admin Auth (no sidebar layout) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="leads" element={<ManageLeads />} />
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="staff" element={<ManageStaff />} />
              <Route path="settings" element={<ManageSettings />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;