import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPinnedNews } from '../services/newsService';
import { formatDate, getCategoryColor } from '../data/newsData';

const NewsSection = () => {
  const [pinnedNews, setPinnedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPinnedNews();
  }, []);

  const loadPinnedNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPinnedNews(3);
      
      if (result.success) {
        setPinnedNews(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal memuat berita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Don't render section if no pinned news
  if (!loading && pinnedNews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="gradient-text">Berita Terkini</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Update terbaru kegiatan dan informasi seputar Yayasan GCNI
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Memuat berita...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && pinnedNews.length > 0 && (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {pinnedNews.map((news, index) => (
                <Link
                  key={news.id}
                  to={`/artikel/${news.id}`}
                  className="block"
                >
                  <motion.article
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer h-full"
                    variants={scaleIn}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <div className={`h-48 bg-gradient-to-r from-${getCategoryColor(news.category)}-400 to-${getCategoryColor(news.category)}-600 flex items-center justify-center relative overflow-hidden`}>
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
                      {/* Pin Badge */}
                      <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <i className="fas fa-thumbtack"></i>
                        Pinned
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
            </motion.div>

            {/* View All Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/berita"
                className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-newspaper mr-2"></i>
                Lihat Semua Berita
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
