import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, iconRotate, staggerItem, cardHover } from '../utils/animations';

const Program = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    document.title = 'Program Pendidikan GCNI School';
  }, []);

  const handleImageError = (programId) => {
    setImageErrors(prev => ({
      ...prev,
      [programId]: true
    }));
  };

  const openModal = (programId) => {
    setActiveModal(programId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const programs = [
    {
      id: 'tahfidz',
      title: 'Tahfidz',
      subtitle: 'Program Hafalan Al-Qur\'an',
      description: 'Program intensif hafalan Al-Qur\'an dengan metode terbukti dan bimbingan ustadz berpengalaman untuk membentuk generasi Qur\'ani.',
      icon: 'fa-quran',
      image: 'https://res.cloudinary.com/dof6csq4i/image/upload/v1758594705/pesantren/blog/f9blppo5nwwwgja39wp7.png',
      color: 'emerald',
      features: [
        'Target Hafalan 30 Juz',
        'Metode Pembelajaran Efektif',
        'Bimbingan Ustadz Berpengalaman',
        'Evaluasi Berkala',
        'Pembinaan Karakter Islami',
        'Tahsin & Tajwid'
      ],
      detail: 'Program tahfidz yang terstruktur dengan metode pembelajaran yang telah terbukti efektif dalam membantu santri menghafal Al-Qur\'an 30 juz dengan tartil dan tajwid yang benar.'
    },
    {
      id: 'courtesy',
      title: 'Courtesy',
      subtitle: 'Pendidikan Karakter & Adab',
      description: 'Pembentukan akhlak mulia, etika, dan sopan santun sebagai dasar kepribadian Islami yang unggul dan berkarakter.',
      icon: 'fa-handshake',
      image: 'https://res.cloudinary.com/dtcfexttw/image/upload/v1759675078/IMG_20210304_055050_xkk59n.jpg',
      color: 'yellow',
      features: [
        'Pembinaan Akhlak Mulia',
        'Pendidikan Adab Islami',
        'Etika & Sopan Santun',
        'Leadership Training',
        'Character Building',
        'Public Speaking'
      ],
      detail: 'Program pembentukan karakter yang komprehensif untuk menghasilkan lulusan yang tidak hanya cerdas secara intelektual, tetapi juga memiliki akhlak mulia dan kepribadian yang santun.'
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      subtitle: 'Program Kewirausahaan',
      description: 'Mengembangkan jiwa wirausaha, kreativitas, dan kemandirian ekonomi sejak dini untuk mencetak santripreneur yang sukses.',
      icon: 'fa-lightbulb',
      image: 'https://res.cloudinary.com/dtcfexttw/image/upload/v1759675082/_storage_emulated_0_Android_data_com.miui.gallery_cache_SecurityShare_IMG20250707_091615_lmc_8.4_p4w0v8.jpg',
      color: 'blue',
      features: [
        'Pelatihan Business Skill',
        'Praktik Bisnis Nyata',
        'Mentoring dari Praktisi',
        'Project-Based Learning',
        'Digital Marketing',
        'Financial Literacy'
      ],
      detail: 'Program kewirausahaan yang mengajarkan siswa untuk mandiri secara ekonomi dengan mengembangkan kemampuan bisnis dan inovasi sejak dini.'
    },
    {
      id: 'international',
      title: 'International Program',
      subtitle: 'Kurikulum Cambridge',
      description: 'Program dengan standar internasional Cambridge untuk mempersiapkan siswa bersaing di kancah global dengan tetap berpegang pada nilai Islam.',
      icon: 'fa-globe',
      image: 'https://res.cloudinary.com/dof6csq4i/image/upload/v1758591275/santri_zzlfdp.jpg',
      color: 'purple',
      features: [
        'Kurikulum Cambridge',
        'Standar Internasional',
        'Bilingual Education',
        'Global Perspective',
        'International Certification',
        'Exchange Program Ready'
      ],
      detail: 'Program pendidikan bertaraf internasional dengan kurikulum Cambridge yang dirancang untuk mempersiapkan siswa menghadapi tantangan global tanpa meninggalkan identitas Islami.'
    },
    {
      id: 'language',
      title: 'Language Development Center',
      subtitle: 'Pengembangan Bahasa',
      description: 'Pusat pengembangan kemampuan berbahasa Arab dan Inggris secara intensif untuk mendukung komunikasi global dan pemahaman Islam.',
      icon: 'fa-comments',
      image: 'https://res.cloudinary.com/dtcfexttw/image/upload/v1759675073/f_bi8ais.jpg',
      color: 'red',
      features: [
        'Bahasa Arab Intensif',
        'English Proficiency',
        'Conversation Practice',
        'Language Lab',
        'Native Speaker Instruction',
        'Language Certification'
      ],
      detail: 'Program pengembangan bahasa yang intensif untuk menguasai bahasa Arab sebagai bahasa Al-Qur\'an dan bahasa Inggris sebagai bahasa internasional untuk komunikasi global.'
    }
  ];

  const colorClasses = {
    emerald: {
      gradient: 'from-emerald-400 to-teal-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600'
    },
    yellow: {
      gradient: 'from-yellow-400 to-amber-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600'
    },
    blue: {
      gradient: 'from-blue-400 to-indigo-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: 'text-blue-600'
    },
    purple: {
      gradient: 'from-purple-400 to-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: 'text-purple-600'
    },
    red: {
      gradient: 'from-red-400 to-pink-600',
      button: 'bg-red-600 hover:bg-red-700',
      text: 'text-red-600',
      bg: 'bg-red-50',
      icon: 'text-red-600'
    },
    teal: {
      gradient: 'from-teal-400 to-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700',
      text: 'text-teal-600',
      check: 'text-teal-600'
    },
    green: {
      gradient: 'from-green-400 to-green-600',
      button: 'bg-green-600 hover:bg-green-700',
      text: 'text-green-600',
      check: 'text-green-600'
    },
    orange: {
      gradient: 'from-orange-400 to-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      text: 'text-orange-600',
      check: 'text-orange-600'
    },
    indigo: {
      gradient: 'from-indigo-400 to-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      text: 'text-indigo-600',
      check: 'text-indigo-600'
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div 
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
            {...iconRotate}
          >
            <i className="fas fa-graduation-cap text-5xl text-white"></i>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="gradient-text">Program Unggulan</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Berbagai program berkualitas untuk mendukung pendidikan dan pemberdayaan generasi Qur'ani
          </motion.p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div 
                key={program.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer"
                {...staggerItem(index)}
                {...cardHover}
                onClick={() => openModal(program.id)}
              >
                <div className={`h-64 bg-gradient-to-r ${colorClasses[program.color].gradient} flex items-center justify-center overflow-hidden relative`}>
                  {program.image && !imageErrors[program.id] ? (
                    <img 
                      src={program.image} 
                      alt={program.title}
                      onError={() => handleImageError(program.id)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className={`fas ${program.icon} text-8xl text-white`}></i>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className={`${colorClasses[program.color].text} font-semibold mb-4`}>{program.subtitle}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className={`inline-flex items-center ${colorClasses[program.color].button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}>
                    <i className="fas fa-info-circle mr-2"></i>
                    Detail Program
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Daftar Program Sekarang
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Wujudkan impian menjadi generasi Qur'ani yang berakhlak mulia dan berjiwa entrepreneur
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/kontak" 
              className="inline-flex items-center justify-center bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-phone mr-2"></i>
              Hubungi Kami
            </Link>
            <Link 
              to="/donasi" 
              className="inline-flex items-center justify-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-heart mr-2"></i>
              Dukung Program
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      {programs.map((program) => (
        <div
          key={`modal-${program.id}`}
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 ${
            activeModal === program.id ? 'flex' : 'hidden'
          }`}
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-6 sm:p-8 md:p-10 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {program.title} {program.subtitle && `- ${program.subtitle}`}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">{program.detail}</p>
              <div>
                <h4 className="font-semibold text-lg mb-2">Keunggulan Program:</h4>
                <ul className="space-y-2 text-gray-600">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <i className={`fas fa-check ${colorClasses[program.color].check} mt-1 mr-2`}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 mt-6">
                <Link 
                  to="/kontak" 
                  className={`${colorClasses[program.color].button} text-white px-6 py-2 rounded-lg font-semibold transition-all`}
                >
                  {program.id === 'kajian' ? 'Ikuti Kajian' : 'Daftar Sekarang'}
                </Link>
                <button 
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Program;
