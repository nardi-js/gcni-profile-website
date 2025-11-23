import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUnreadCount } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    // Reload unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    const result = await getUnreadCount();
    if (result.success) {
      setUnreadCount(result.count);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  const navItems = [
    {
      path: '/admin/news',
      icon: 'fa-newspaper',
      label: 'Kelola Berita',
      badge: null
    },
    {
      path: '/admin/messages',
      icon: 'fa-envelope',
      label: 'Pesan Kontak',
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      path: '/admin/videos',
      icon: 'fa-video',
      label: 'Kelola Video',
      badge: null
    },
    {
      path: '/admin/posters',
      icon: 'fa-images',
      label: 'Kelola Poster',
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            <i className="fas fa-shield-alt text-teal-600 mr-2"></i>
            Admin GCNI
          </h1>
        </div>
        <Link to="/" className="text-teal-600 hover:text-teal-700">
          <i className="fas fa-home text-xl"></i>
        </Link>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r w-64 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-teal-600 overflow-hidden">
              <img 
                src="/logo-gcni.png" 
                alt="GCNI Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full hidden items-center justify-center">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin GCNI</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all ${
                isActive(item.path)
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`fas ${item.icon} text-lg`}></i>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          {/* User Info */}
          {user && (
            <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-teal-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.displayName || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-all"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>

          {/* Back to Website */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold transition-all"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <Outlet />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sign-out-alt text-3xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-gray-600">
                Apakah Anda yakin ingin keluar dari admin panel?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
