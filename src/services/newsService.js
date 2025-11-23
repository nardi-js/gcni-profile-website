import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const NEWS_COLLECTION = 'news';

/**
 * Create new news article
 */
export const createNews = async (newsData) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    
    // Process tags: convert string to array if needed
    const tags = typeof newsData.tags === 'string' 
      ? newsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : newsData.tags || [];

    const newsToSave = {
      ...newsData,
      tags,
      isPinned: newsData.isPinned || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(newsRef, newsToSave);
    
    return {
      success: true,
      id: docRef.id,
      message: 'Berita berhasil ditambahkan!'
    };
  } catch (error) {
    console.error('Error creating news:', error);
    return {
      success: false,
      error: error.message,
      message: 'Gagal menambahkan berita!'
    };
  }
};

/**
 * Get all news articles
 */
export const getAllNews = async () => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const newsList = [];
    querySnapshot.forEach((doc) => {
      newsList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      data: newsList
    };
  } catch (error) {
    console.error('Error getting news:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get single news by ID
 */
export const getNewsById = async (id) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    const newsDoc = await getDoc(newsRef);

    if (newsDoc.exists()) {
      return {
        success: true,
        data: {
          id: newsDoc.id,
          ...newsDoc.data()
        }
      };
    } else {
      return {
        success: false,
        error: 'News not found',
        data: null
      };
    }
  } catch (error) {
    console.error('Error getting news by ID:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Get single news by slug
 */
export const getNewsBySlug = async (slug) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const newsDoc = querySnapshot.docs[0];
      return {
        success: true,
        data: {
          id: newsDoc.id,
          ...newsDoc.data()
        }
      };
    } else {
      return {
        success: false,
        error: 'News not found',
        data: null
      };
    }
  } catch (error) {
    console.error('Error getting news by slug:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Update news article
 */
export const updateNews = async (id, newsData) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    
    // Process tags: convert string to array if needed
    const tags = typeof newsData.tags === 'string' 
      ? newsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : newsData.tags || [];

    const newsToUpdate = {
      ...newsData,
      tags,
      isPinned: newsData.isPinned !== undefined ? newsData.isPinned : false,
      updatedAt: serverTimestamp()
    };

    await updateDoc(newsRef, newsToUpdate);

    return {
      success: true,
      message: 'Berita berhasil diupdate!'
    };
  } catch (error) {
    console.error('Error updating news:', error);
    return {
      success: false,
      error: error.message,
      message: 'Gagal mengupdate berita!'
    };
  }
};

/**
 * Delete news article
 */
export const deleteNews = async (id) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    await deleteDoc(newsRef);

    return {
      success: true,
      message: 'Berita berhasil dihapus!'
    };
  } catch (error) {
    console.error('Error deleting news:', error);
    return {
      success: false,
      error: error.message,
      message: 'Gagal menghapus berita!'
    };
  }
};

/**
 * Get news by category
 */
export const getNewsByCategory = async (category) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const querySnapshot = await getDocs(newsRef);
    
    const newsList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category === category) {
        newsList.push({
          id: doc.id,
          ...data
        });
      }
    });

    // Sort by date descending
    newsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      success: true,
      data: newsList
    };
  } catch (error) {
    console.error('Error getting news by category:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get pinned news for homepage
 */
export const getPinnedNews = async (limit = 3) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    
    // Try with compound query first (requires Firestore index)
    try {
      const q = query(newsRef, where('isPinned', '==', true), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const newsList = [];
      querySnapshot.forEach((doc) => {
        newsList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Limit the results
      return {
        success: true,
        data: newsList.slice(0, limit)
      };
    } catch (indexError) {
      // If index not created yet, fallback to client-side filtering
      console.warn('Firestore index not found, using client-side filtering:', indexError.message);
      
      const querySnapshot = await getDocs(newsRef);
      const newsList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isPinned === true) {
          newsList.push({
            id: doc.id,
            ...data
          });
        }
      });

      // Sort by date and limit
      newsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return {
        success: true,
        data: newsList.slice(0, limit)
      };
    }
  } catch (error) {
    console.error('Error getting pinned news:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Toggle pin status of a news article
 */
export const togglePinNews = async (id, isPinned) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    await updateDoc(newsRef, {
      isPinned: isPinned,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: isPinned ? 'Berita berhasil di-pin!' : 'Pin berita berhasil dihapus!'
    };
  } catch (error) {
    console.error('Error toggling pin news:', error);
    return {
      success: false,
      error: error.message,
      message: 'Gagal mengubah status pin berita!'
    };
  }
};
