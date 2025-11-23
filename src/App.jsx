import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Lazy load all pages for better code splitting
const Home = lazy(() => import('./pages/Home'));
const Tentang = lazy(() => import('./pages/Tentang'));
const Program = lazy(() => import('./pages/Program'));
const Berita = lazy(() => import('./pages/Berita'));
const Artikel = lazy(() => import('./pages/Artikel'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Kontak = lazy(() => import('./pages/Kontak'));
const Donasi = lazy(() => import('./pages/Donasi'));
const Pendaftaran = lazy(() => import('./pages/Pendaftaran'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'));
const AdminPosters = lazy(() => import('./pages/admin/AdminPosters'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Memuat halaman...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tentang" element={<Tentang />} />
              <Route path="program" element={<Program />} />
              <Route path="berita" element={<Berita />} />
              <Route path="artikel/:id" element={<Artikel />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="kontak" element={<Kontak />} />
              <Route path="donasi" element={<Donasi />} />
              <Route path="pendaftaran" element={<Pendaftaran />} />
            </Route>
            
            {/* Admin Login - No Protection */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes - Nested with persistent sidebar */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/news" replace />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="posters" element={<AdminPosters />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
