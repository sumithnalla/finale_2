import React, { useState, useEffect } from 'react';
import { galleryData } from '../data/galleryData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(
    Array(galleryData.photos.length).fill(false)
  );

  useEffect(() => {
    if (selectedItem !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedItem]);

  const handleImageLoad = (index: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[index] = true;
    setIsLoaded(newLoadedState);
  };

  const handlePrev = () => {
    if (selectedItem === null) return;
    setSelectedItem(
      selectedItem === 0 ? galleryData.photos.length - 1 : selectedItem - 1
    );
  };

  const handleNext = () => {
    if (selectedItem === null) return;
    setSelectedItem(
      selectedItem === galleryData.photos.length - 1 ? 0 : selectedItem + 1
    );
  };

  return (
    <section id="gallery" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
              Gallery
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryData.photos.map((photo, index) => (
            <div
              key={index}
              className="group aspect-square relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedItem(index)}
            >
              <div
                className={`absolute inset-0 bg-gray-900 flex items-center justify-center transition-opacity duration-300 ${
                  isLoaded[index] ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="w-10 h-10 border-4 border-t-pink-500 border-gray-800 rounded-full animate-spin"></div>
              </div>
              <img
                src={photo.thumbnail}
                alt={photo.alt}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                onLoad={() => handleImageLoad(index)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedItem !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-pink-500 transition-colors duration-300"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-8 w-8" />
            </button>

            <button
              className="absolute left-4 md:left-8 text-white hover:text-pink-500 transition-colors duration-300"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            <button
              className="absolute right-4 md:right-8 text-white hover:text-pink-500 transition-colors duration-300"
              onClick={handleNext}
            >
              <ChevronRight className="h-10 w-10" />
            </button>

            <div className="max-w-5xl w-full max-h-[90vh]">
              <img
                src={galleryData.photos[selectedItem].fullSize}
                alt={galleryData.photos[selectedItem].alt}
                className="object-contain max-h-[85vh] mx-auto"
              />
              <div className="mt-4 text-center">
                <p className="text-white text-lg font-medium">
                  {galleryData.photos[selectedItem].caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
