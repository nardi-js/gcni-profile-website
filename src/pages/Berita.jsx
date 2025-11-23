import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllNews, getNewsByCategory } from '../services/newsService';
import { formatDate, getCategoryColor } from '../data/newsData';
import { fadeInUp, staggerItem, cardHover } from '../utils/animations';

const Berita = () => {
  const [filteredNews, setFilteredNews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Berita & Kegiatan GCNI School';
    loadNews('all');
  }, []);

  const loadNews = async (category = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (category === 'all') {
        result = await getAllNews();
      } else {
        // Capitalize first letter untuk match dengan Firestore data
        const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);
        result = await getNewsByCategory(categoryCapitalized);
      }

      if (result.success) {
        setFilteredNews(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Gagal memuat berita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = (category) => {
    setActiveFilter(category);
    loadNews(category);
  };

  const categories = [
    { value: 'all', label: 'Semua Berita' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'prestasi', label: 'Prestasi' },
    { value: 'program', label: 'Program' },
    { value: 'pendaftaran', label: 'Pendaftaran' },
    { value: 'beasiswa', label: 'Beasiswa' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div 
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <motion.i 
              className="fas fa-newspaper text-5xl text-white"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.i>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Berita & Artikel</span>
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan prestasi Yayasan GCNI
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => filterNews(category.value)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeFilter === category.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-6xl text-teal-600 mb-4"></i>
              <p className="text-gray-600 text-lg">Memuat berita...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => loadNews(activeFilter)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <i className="fas fa-redo mr-2"></i>
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredNews.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">Tidak ada berita untuk kategori ini</p>
            </div>
          )}

          {/* News Grid */}
          {!loading && !error && filteredNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news, index) => (
                <Link
                  key={news.id}
                  to={`/artikel/${news.id}`}
                  className="block"
                >
                  <motion.article
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer h-full"
                    {...staggerItem(index)}
                    {...cardHover}
                  >
                    <div className={`h-40 sm:h-48 bg-gradient-to-r from-${getCategoryColor(news.category)}-400 to-${getCategoryColor(news.category)}-600 flex items-center justify-center relative overflow-hidden`}>
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r from-${getCategoryColor(news.category)}-400 to-${getCategoryColor(news.category)}-600 hidden items-center justify-center`}>
                        <i className="fas fa-newspaper text-6xl text-white"></i>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>{formatDate(news.date)}</span>
                        <span className="mx-2">•</span>
                        <span className={`bg-${getCategoryColor(news.category)}-100 text-${getCategoryColor(news.category)}-800 px-2 py-1 rounded-full text-xs`}>
                          {news.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      <div className={`inline-flex items-center text-${getCategoryColor(news.category)}-600 hover:text-${getCategoryColor(news.category)}-700 font-semibold group`}>
                        <i className="fas fa-arrow-right mr-2 group-hover:translate-x-1 transition-transform"></i>
                        Baca Selengkapnya
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ikuti Terus Perkembangan GCNI
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Jangan lewatkan berita terbaru dan informasi penting seputar kegiatan Yayasan GCNI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-envelope mr-2"></i>
              Berlangganan Newsletter
            </Link>
            <Link
              to="/program"
              className="inline-flex items-center justify-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-graduation-cap mr-2"></i>
              Lihat Program Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Berita;
