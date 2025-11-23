import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center">
              <img 
                src="gcni-logo.png" 
                alt="Logo GCNI" 
                className="w-12 h-12 rounded-full mr-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-teal-600 rounded-full items-center justify-center mr-3 hidden">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">GCNI</h1>
                <p className="text-xs text-gray-600">Global Cahaya Nurbuwwah Insani</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Beranda
              </Link>
              <Link to="/tentang" className={`font-medium transition-colors ${location.pathname === '/tentang' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Tentang
              </Link>
              <Link to="/program" className={`font-medium transition-colors ${location.pathname === '/program' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Program
              </Link>
              <Link to="/berita" className={`font-medium transition-colors ${location.pathname === '/berita' || location.pathname.startsWith('/artikel/') ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Berita
              </Link>
              <Link to="/gallery" className={`font-medium transition-colors ${location.pathname === '/gallery' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Gallery
              </Link>
              <Link to="/faq" className={`font-medium transition-colors ${location.pathname === '/faq' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                FAQ
              </Link>
              <Link to="/pendaftaran" className={`font-medium transition-colors ${location.pathname === '/pendaftaran' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Pendaftaran
              </Link>
              <Link to="/kontak" className={`font-medium transition-colors ${location.pathname === '/kontak' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>
                Kontak
              </Link>
              <Link 
                to="/donasi" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Donasi
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={openMobileMenu}
              className="md:hidden text-gray-700 focus:outline-none"
              aria-label="Buka menu"
              title="Buka menu"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[9999] ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Tutup menu"
              title="Tutup menu"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-home mr-3"></i>Beranda
            </Link>
            <Link
              to="/tentang"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/tentang' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-info-circle mr-3"></i>Tentang
            </Link>
            <Link
              to="/program"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/program' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-graduation-cap mr-3"></i>Program
            </Link>
            <Link
              to="/berita"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/berita' || location.pathname.startsWith('/artikel/') ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-newspaper mr-3"></i>Berita
            </Link>
            <Link
              to="/gallery"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/gallery' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-video mr-3"></i>Gallery
            </Link>
            <Link
              to="/faq"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/faq' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-question-circle mr-3"></i>FAQ
            </Link>
            <Link
              to="/kontak"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/kontak' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-envelope mr-3"></i>Kontak
            </Link>
            <Link
              to="/pendaftaran"
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors mb-2 ${location.pathname === '/pendaftaran' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}`}
            >
              <i className="fas fa-user-graduate mr-3"></i>Pendaftaran
            </Link>
            <Link
              to="/donasi"
              onClick={closeMobileMenu}
              className="block py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors mt-4"
            >
              <i className="fas fa-heart mr-3"></i>Donasi
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/90 transition-all duration-300 md:hidden z-[9998] ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      ></div>
    </>
  );
};

export default Header;
