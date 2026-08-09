import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Gallery.css';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  // Solo le foto presenti nella cartella Drive "Foto sito"
  const images = [
    '/images/Foto sito/IMG_1171_Original.jpg',
    '/images/Foto sito/IMG_3507.jpg',
    '/images/Foto sito/IMG_3607.jpg',
    '/images/Foto sito/IMG_3915.jpg',
    '/images/Foto sito/IMG_4208.jpg',
    '/images/Foto sito/IMG_5928.jpg',
    '/images/Foto sito/IMG_6493.jpg',
    '/images/Foto sito/IMG_6950.jpg',
    '/images/Foto sito/IMG_7102.jpg',
    '/images/Foto sito/IMG_7431.jpg',
    '/images/Foto sito/IMG_7537.jpg',
    '/images/Foto sito/IMG_7675.jpg',
    '/images/Foto sito/IMG_7686.jpg',
    '/images/Foto sito/IMG_7809.jpg',
    '/images/Foto sito/IMG_7933.jpg',
    '/images/Foto sito/IMG_8108.jpg',
    '/images/Foto sito/IMG_8238.jpg',
    '/images/Foto sito/whatsapp-20260713.jpg',
    '/images/Foto sito/whatsapp-20260716.jpg',
    '/images/Foto sito/whatsapp-20260720-1.jpg',
    '/images/Foto sito/0875802b-e11c-462b-b627-8f8140d33b41.jpg',
    '/images/Foto sito/14b2843e-3262-4b86-9a97-24364543c7b9.jpg',
    '/images/Foto sito/375afe23-948d-4a7f-9350-3ba081ca97fe.jpg',
    '/images/Foto sito/4ad964b1-c228-44e5-a519-75278a0d86a2.jpg',
    '/images/Foto sito/5272FA54-3883-4FF2-A9D9-3BD1AE2C320D.jpg',
    '/images/Foto sito/8777a7fa-b2a3-4031-9081-a716879135c0.jpg',
    '/images/Foto sito/98223a04-5b52-4e71-802d-52d540486220.jpg',
    '/images/Foto sito/cd4df773-5911-4343-ae64-38762aa80a89.jpg'
  ];

  const shuffledImages = useMemo(() => {
    return [...images].sort(() => Math.random() - 0.5);
  }, []);

  return (
    <div className="section-container gallery-section">
      <div className="gallery-grid">
        {shuffledImages.map((src, idx) => (
          <motion.div 
            key={src} 
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (idx % 3) * 0.15 }}
            onClick={() => setSelectedImage(src)}
          >
            <img src={src} alt={`Momento ${idx}`} loading="lazy" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <p className="gallery-note">Maria &amp; Lorenzo</p>
        <p className="gallery-footer-date">7 · 11 · 2026</p>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
            <motion.img 
              src={selectedImage} 
              alt="Ingrandimento"
              className="lightbox-image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
