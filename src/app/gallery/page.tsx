'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/ui/button';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
    title: 'Miniature Dragon',
    category: 'Fantasy'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    title: 'RC Quadcopter Frame',
    category: 'RC Parts'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    title: 'Phone Stand',
    category: 'Accessories'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800',
    title: 'Architectural Model',
    category: 'Architecture'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    title: 'Cosplay Helmet',
    category: 'Cosplay'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    title: 'Desk Organizer',
    category: 'Home & Office'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
    title: 'Custom Figurine',
    category: 'Miniatures'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    title: 'Drone Parts',
    category: 'RC Parts'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    title: 'Jewelry Prototype',
    category: 'Jewelry'
  }
];

const categories = ['All', ...new Set(galleryImages.map(img => img.category))];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filteredImages = galleryImages.filter(img => 
    selectedCategory === 'All' || img.category === selectedCategory
  );

  const openLightbox = (imageId: number) => {
    setLightboxImage(imageId);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setLightboxImage(filteredImages[newIndex].id);
  };

  const currentImage = filteredImages.find(img => img.id === lightboxImage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of 3D printed projects. From intricate miniatures to functional prototypes.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-gradient-primary text-white' : ''}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(image.id)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-300">{image.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground text-lg">
              No images found in this category.
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.src}
                alt={currentImage.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold mb-1">
                  {currentImage.title}
                </h3>
                <p className="text-gray-300">{currentImage.category}</p>
              </div>

              {/* Navigation */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={() => navigateLightbox('prev')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => navigateLightbox('next')}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Close Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}