import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPinnedVideos();
  }, []);

  const fetchPinnedVideos = async () => {
    try {
      const videosRef = collection(db, 'videos');
      // Get all videos first, then filter and sort in JS to avoid index requirement
      const querySnapshot = await getDocs(videosRef);
      
      const videosData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(video => video.isPinned === true) // Filter pinned videos
        .sort((a, b) => {
          // Sort by createdAt descending
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        })
        .slice(0, 6); // Limit to 6 videos
      
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching pinned videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url, type) => {
    try {
      if (type === 'youtube') {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      } else if (type === 'shorts') {
        const videoId = url.match(/shorts\/([^?&\s]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      } else if (type === 'reels') {
        const reelId = url.match(/reel\/([^/?]+)/)?.[1];
        return reelId ? `https://www.instagram.com/p/${reelId}/embed` : null;
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat video...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return null; // Don't show section if no pinned videos
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="gradient-text">Video Gallery</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat kegiatan dan momen terbaik kami melalui video
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {videos.map((video, index) => {
            const embedUrl = getEmbedUrl(video.url, video.type);
            
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Video Embed */}
                <div className="aspect-video bg-gray-900 relative overflow-hidden">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <i className="fas fa-video text-4xl text-gray-600"></i>
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    {video.type === 'youtube' && (
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold shadow-lg">
                        <i className="fab fa-youtube mr-1"></i>
                        YouTube
                      </span>
                    )}
                    {video.type === 'shorts' && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-lg">
                        <i className="fas fa-mobile-alt mr-1"></i>
                        Shorts
                      </span>
                    )}
                    {video.type === 'reels' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold shadow-lg">
                        <i className="fab fa-instagram mr-1"></i>
                        Reels
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Lihat Semua Video</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoGallery;
