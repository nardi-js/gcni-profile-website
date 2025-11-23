import { useState, useEffect } from 'react';
import { createNews, getAllNews, updateNews, deleteNews } from '../../services/newsService';

const AdminNews = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    category: 'Pendaftaran',
    date: '',
    author: 'Admin GCNI',
    image: '',
    content: '',
    tags: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Pendaftaran', 'Prestasi', 'Kegiatan', 'Program', 'Beasiswa', 'Pengumuman'];

  // Load news on component mount
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const result = await getAllNews();
    if (result.success) {
      setNewsList(result.data);
    } else {
      console.error('Failed to load news:', result.error);
      // Don't show alert on initial load, just log the error
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      
      if (editMode) {
        // Update existing news
        result = await updateNews(editId, formData);
      } else {
        // Create new news
        result = await createNews(formData);
      }

      if (result.success) {
        alert(result.message);
        resetForm();
        loadNews(); // Reload data
      } else {
        alert(result.message + '\nError: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (news) => {
    setFormData({
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      category: news.category,
      date: news.date,
      author: news.author,
      image: news.image,
      content: news.content || '',
      tags: Array.isArray(news.tags) ? news.tags.join(', ') : news.tags || ''
    });
    setEditMode(true);
    setEditId(news.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      setLoading(true);
      const result = await deleteNews(id);
      
      if (result.success) {
        alert(result.message);
        loadNews(); // Reload data
      } else {
        alert(result.message + '\nError: ' + result.error);
      }
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      category: 'Pendaftaran',
      date: '',
      author: 'Admin GCNI',
      image: '',
      content: '',
      tags: ''
    });
    setEditMode(false);
    setEditId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  <i className="fas fa-newspaper text-teal-600 mr-2"></i>
                  Kelola Berita
                </h1>
                <p className="text-gray-600 mt-1">Manajemen konten berita GCNI</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                <i className={`fas ${isFormOpen ? 'fa-times' : 'fa-plus'}`}></i>
                {isFormOpen ? 'Tutup Form' : 'Tambah Berita'}
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {isFormOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i className="fas fa-edit text-teal-600"></i>
              {editMode ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Contoh: Pembukaan Pendaftaran Santri Baru 2024/2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug (URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="pembukaan-pendaftaran-santri-baru-2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category, Date, Author */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Admin GCNI"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Gambar <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                {formData.image && (
                  <div className="mt-3">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full sm:w-64 h-auto rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EGambar Tidak Valid%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Row 4: Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ringkasan (Excerpt) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Ringkasan singkat berita (1-2 kalimat)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              {/* Row 5: Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Konten (HTML) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="12"
                  placeholder="Tulis konten berita dalam format HTML..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm resize-none"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Gunakan tag HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;
                </p>
              </div>

              {/* Row 6: Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags <span className="text-gray-400">(pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="pendaftaran, santri baru, 2024, IEBS, tahfizh"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 ${submitting ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {editMode ? 'Update Berita' : 'Simpan Berita'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-list text-teal-600"></i>
              Daftar Berita
            </h2>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
              {newsList.length} Berita
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-teal-600 mb-4"></i>
              <p className="text-gray-600">Memuat data berita...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && newsList.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-300">
                <i className="fas fa-newspaper text-7xl text-gray-300 mb-6"></i>
                <p className="text-gray-600 text-xl font-semibold mb-3">Belum ada berita</p>
                <p className="text-gray-400 text-sm mb-8">Klik tombol di atas untuk membuat berita pertama</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                >
                  <i className="fas fa-plus"></i>
                  Buat Berita Baru
                </button>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-yellow-800">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <strong>Penting:</strong> Pastikan Firestore Rules sudah diatur di Firebase Console:
                </p>
                <code className="block mt-2 text-xs bg-white p-2 rounded border text-left">
                  rules_version = '2';<br/>
                  service cloud.firestore {'{'}<br/>
                  &nbsp;&nbsp;match /databases/(database)/documents {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;match /news/{'{'}{'{'}newsId{'}'}{'}'}  {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if true;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                  &nbsp;&nbsp;{'}'}<br/>
                  {'}'}
                </code>
              </div>
            </div>
          )}

          {/* Table - Desktop */}
          {!loading && newsList.length > 0 && (
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gambar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Judul & Info
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {newsList.map((news) => (
                    <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-md">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {news.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {news.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(Array.isArray(news.tags) ? news.tags : []).map((tag, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          news.category === 'Pendaftaran' ? 'bg-blue-100 text-blue-800' :
                          news.category === 'Prestasi' ? 'bg-green-100 text-green-800' :
                          news.category === 'Kegiatan' ? 'bg-teal-100 text-teal-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {news.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <i className="fas fa-calendar text-gray-400 text-xs"></i>
                          {new Date(news.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <i className="fas fa-user text-gray-400"></i>
                          {news.author}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(news)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(news.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cards - Mobile */}
          {!loading && newsList.length > 0 && (
            <div className="lg:hidden space-y-4">
              {newsList.map((news) => (
              <div key={news.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4 mb-3">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${
                      news.category === 'Pendaftaran' ? 'bg-blue-100 text-blue-800' :
                      news.category === 'Prestasi' ? 'bg-green-100 text-green-800' :
                      news.category === 'Kegiatan' ? 'bg-teal-100 text-teal-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {news.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {news.excerpt}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {news.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-calendar"></i>
                    {new Date(news.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-user"></i>
                    {news.author}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(news)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-trash"></i>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
