import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RoomGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-card flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[60vh] max-h-[600px] min-h-[400px] rounded-card overflow-hidden group">
      <img 
        src={images[currentIndex].url} 
        alt={`Room view ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentIndex === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoomGallery;
