import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, youtube, shorts, reels

  useEffect(() => {
    document.title = 'Gallery Video - GCNI School';
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const videosRef = collection(db, 'videos');
      const q = query(videosRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url, type) => {
    if (type === 'youtube') {
      // Convert YouTube URL to embed URL
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (type === 'shorts') {
      // Convert YouTube Shorts URL to embed URL
      const videoId = url.match(/shorts\/([\w-]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (type === 'reels') {
      // Convert Instagram Reels URL to embed URL
      const reelId = url.match(/reel\/([\w-]+)/)?.[1];
      return reelId ? `https://www.instagram.com/reel/${reelId}/embed` : url;
    }
    return url;
  };

  const filteredVideos = filter === 'all' 
    ? videos 
    : videos.filter(video => video.type === filter);

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
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-20 pt-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              <i className="fas fa-video text-6xl md:text-7xl text-white mb-4"></i>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text-white">Gallery Video</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto">
              Dokumentasi kegiatan dan momen berharga GCNI dalam bentuk video
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-th mr-2"></i>
              Semua Video
            </button>
            <button
              onClick={() => setFilter('youtube')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'youtube'
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fab fa-youtube mr-2"></i>
              YouTube
            </button>
            <button
              onClick={() => setFilter('shorts')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'shorts'
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-mobile-alt mr-2"></i>
              Shorts
            </button>
            <button
              onClick={() => setFilter('reels')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'reels'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fab fa-instagram mr-2"></i>
              Reels
            </button>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <i className="fas fa-video text-6xl text-gray-300 mb-4"></i>
              <p className="text-xl text-gray-500">Belum ada video tersedia</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  variants={scaleIn}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative aspect-video bg-gray-900">
                    <iframe
                      src={getEmbedUrl(video.url, video.type)}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {video.type === 'youtube' && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                          <i className="fab fa-youtube mr-1"></i>
                          YouTube
                        </span>
                      )}
                      {video.type === 'shorts' && (
                        <span className="px-3 py-1 bg-red-100 text-red-500 rounded-full text-xs font-semibold">
                          <i className="fas fa-mobile-alt mr-1"></i>
                          Shorts
                        </span>
                      )}
                      {video.type === 'reels' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full text-xs font-semibold">
                          <i className="fab fa-instagram mr-1"></i>
                          Reels
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {video.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
