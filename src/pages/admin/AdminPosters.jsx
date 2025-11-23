import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPosters = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPoster, setEditingPoster] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

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
      alert('Gagal memuat poster');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      alert('Judul dan URL gambar wajib diisi!');
      return;
    }

    // Validate URL format
    try {
      new URL(formData.imageUrl);
    } catch (error) {
      alert('URL gambar tidak valid!');
      return;
    }

    try {
      if (editingPoster) {
        // Update existing poster
        const posterRef = doc(db, 'posters', editingPoster.id);
        await updateDoc(posterRef, {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          updatedAt: serverTimestamp()
        });
        alert('Poster berhasil diupdate!');
      } else {
        // Add new poster
        await addDoc(collection(db, 'posters'), {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          order: posters.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert('Poster berhasil ditambahkan!');
      }
      
      setFormData({ title: '', description: '', imageUrl: '' });
      setShowForm(false);
      setEditingPoster(null);
      fetchPosters();
    } catch (error) {
      console.error('Error saving poster:', error);
      alert('Gagal menyimpan poster: ' + error.message);
    }
  };

  const handleEdit = (poster) => {
    setEditingPoster(poster);
    setFormData({
      title: poster.title,
      description: poster.description || '',
      imageUrl: poster.imageUrl
    });
    setShowForm(true);
  };

  const handleDelete = async (poster) => {
    if (!window.confirm('Yakin ingin menghapus poster ini?')) return;

    try {
      await deleteDoc(doc(db, 'posters', poster.id));
      alert('Poster berhasil dihapus!');
      fetchPosters();
    } catch (error) {
      console.error('Error deleting poster:', error);
      alert('Gagal menghapus poster');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPoster(null);
    setFormData({ title: '', description: '', imageUrl: '' });
  };

  const moveOrder = async (posterId, direction) => {
    const currentIndex = posters.findIndex(p => p.id === posterId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= posters.length) return;

    try {
      const currentPoster = posters[currentIndex];
      const swapPoster = posters[newIndex];

      await updateDoc(doc(db, 'posters', currentPoster.id), { order: newIndex });
      await updateDoc(doc(db, 'posters', swapPoster.id), { order: currentIndex });

      fetchPosters();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Gagal mengubah urutan');
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
                <i className="fas fa-images text-emerald-600 mr-3"></i>
                Kelola Poster Slideshow
              </h1>
              <p className="text-gray-600">Manage poster untuk slideshow di halaman utama</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
              {showForm ? 'Tutup Form' : 'Tambah Poster'}
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
                {editingPoster ? 'Edit Poster' : 'Tambah Poster Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Gambar Poster (Cloudinary) *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://res.cloudinary.com/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-info-circle mr-1"></i>
                    Paste URL gambar dari Cloudinary
                  </p>
                  
                  {/* Preview */}
                  {formData.imageUrl && (
                    <div className="mt-4 border-2 border-gray-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <p className="text-sm text-red-500 mt-2 hidden text-center">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        URL gambar tidak valid atau tidak dapat dimuat
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Poster *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Contoh: Event GCNI 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows="3"
                    placeholder="Deskripsi singkat tentang poster ini"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    <i className="fas fa-save mr-2"></i>
                    {editingPoster ? 'Update Poster' : 'Simpan Poster'}
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

        {/* Posters List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Poster ({posters.length})
          </h2>
          
          {posters.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">Belum ada poster</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-semibold">
                        Urutan #{index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveOrder(poster.id, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                          title="Pindah ke atas"
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button
                          onClick={() => moveOrder(poster.id, 'down')}
                          disabled={index === posters.length - 1}
                          className="p-2 text-gray-600 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                          title="Pindah ke bawah"
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {poster.title}
                    </h3>
                    {poster.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {poster.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(poster)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(poster)}
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

export default AdminPosters;
