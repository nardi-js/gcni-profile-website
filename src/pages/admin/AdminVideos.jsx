import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'youtube',
    isPinned: false
  });

  useEffect(() => {
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
      alert('Gagal memuat video');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      alert('Judul dan URL wajib diisi!');
      return;
    }

    try {
      if (editingVideo) {
        // Update existing video
        const videoRef = doc(db, 'videos', editingVideo.id);
        await updateDoc(videoRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        alert('Video berhasil diupdate!');
      } else {
        // Add new video
        await addDoc(collection(db, 'videos'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert('Video berhasil ditambahkan!');
      }
      
      setFormData({ title: '', description: '', url: '', type: 'youtube', isPinned: false });
      setShowForm(false);
      setEditingVideo(null);
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Gagal menyimpan video');
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      url: video.url,
      type: video.type,
      isPinned: video.isPinned || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus video ini?')) return;

    try {
      await deleteDoc(doc(db, 'videos', id));
      alert('Video berhasil dihapus!');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Gagal menghapus video');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVideo(null);
    setFormData({ title: '', description: '', url: '', type: 'youtube', isPinned: false });
  };

  const togglePin = async (video) => {
    try {
      const videoRef = doc(db, 'videos', video.id);
      await updateDoc(videoRef, {
        isPinned: !video.isPinned,
        updatedAt: serverTimestamp()
      });
      fetchVideos();
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Gagal mengubah status pin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <i className="fas fa-video text-emerald-600 mr-3"></i>
                Kelola Video Gallery
              </h1>
              <p className="text-gray-600">Manage YouTube, Shorts, dan Instagram Reels</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
              {showForm ? 'Tutup Form' : 'Tambah Video'}
            </button>
          </div>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingVideo ? 'Edit Video' : 'Tambah Video Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Video *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'youtube' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.type === 'youtube'
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className="fab fa-youtube text-2xl mb-2"></i>
                      <p className="font-semibold">YouTube</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'shorts' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.type === 'shorts'
                          ? 'border-red-500 bg-red-50 text-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className="fas fa-mobile-alt text-2xl mb-2"></i>
                      <p className="font-semibold">Shorts</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'reels' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.type === 'reels'
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className="fab fa-instagram text-2xl mb-2"></i>
                      <p className="font-semibold">Reels</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Video *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan judul video"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Video *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-info-circle mr-1"></i>
                    Paste URL lengkap dari YouTube, Shorts, atau Instagram Reels
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows="4"
                    placeholder="Deskripsi singkat tentang video ini"
                  />
                </div>

                {/* PIN Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label htmlFor="isPinned" className="flex items-center gap-2 cursor-pointer">
                    <i className="fas fa-thumbtack text-yellow-600 text-lg"></i>
                    <div>
                      <p className="font-semibold text-gray-900">Pin ke Home Page</p>
                      <p className="text-xs text-gray-600">Video yang di-pin akan muncul di halaman utama</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    <i className="fas fa-save mr-2"></i>
                    {editingVideo ? 'Update Video' : 'Simpan Video'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Videos List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Video ({videos.length})
          </h2>
          
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-video text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">Belum ada video</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
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
                        {video.isPinned && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-semibold">
                            <i className="fas fa-thumbtack mr-1"></i>
                            Pinned
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => togglePin(video)}
                        className={`p-2 rounded-lg transition-colors ${
                          video.isPinned
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={video.isPinned ? 'Unpin dari Home' : 'Pin ke Home'}
                      >
                        <i className="fas fa-thumbtack"></i>
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mb-4 truncate">
                      {video.url}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Hapus
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVideos;
