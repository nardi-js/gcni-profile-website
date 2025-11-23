import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const PosterSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const postersRef = collection(db, 'posters');
      const q = query(postersRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const postersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosters(postersData);
    } catch (error) {
      console.error('Error fetching posters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === posters.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [posters.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? posters.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === posters.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Memuat poster...</p>
          </div>
        </div>
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">Belum ada poster tersedia</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Main Slideshow Container */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div 
              className="relative w-full h-full group cursor-pointer"
              onClick={() => setFullscreenImage(posters[currentIndex])}
            >
              <img
                src={posters[currentIndex].imageUrl}
                alt={posters[currentIndex].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Fullscreen Icon - Shows on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-expand text-3xl text-gray-900"></i>
                </div>
              </div>
            </div>
            
            {/* Poster Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <motion.h3 
                className="text-2xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {posters[currentIndex].title}
              </motion.h3>
              {posters[currentIndex].description && (
                <motion.p 
                  className="text-sm md:text-base text-gray-200 line-clamp-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {posters[currentIndex].description}
                  {posters[currentIndex].description.length > 80 && (
                    <span className="ml-2 text-yellow-400 font-semibold cursor-pointer">...more</span>
                  )}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left text-xl"></i>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right text-xl"></i>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {posters.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-3 bg-emerald-600'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4 text-gray-600 font-medium">
        <span className="text-emerald-600 font-bold">{currentIndex + 1}</span> / {posters.length}
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setFullscreenImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setFullscreenImage(null)}
            >
              <i className="fas fa-times text-3xl"></i>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image with overlay */}
              <img
                src={fullscreenImage.imageUrl}
                alt={fullscreenImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Info - Overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 md:p-8 rounded-b-lg">
                <h3 className="text-white text-xl md:text-3xl font-bold mb-2">
                  {fullscreenImage.title}
                </h3>
                {fullscreenImage.description && (
                  <p className="text-gray-200 text-sm md:text-lg leading-relaxed">
                    {fullscreenImage.description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs md:text-sm opacity-75">
              <i className="fas fa-mouse-pointer mr-2"></i>
              Klik di luar gambar atau tombol X untuk menutup
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PosterSlideshow;
