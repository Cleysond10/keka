import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';
import { ImageOff, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  onToggleSelect: (id: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, loading, onToggleSelect }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  
  const handlePrevious = () => {
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setShowGallery(false);
    if (e.key === ' ') {
      e.preventDefault();
      onToggleSelect(photos[activePhotoIndex].id);
    }
  };

  useEffect(() => {
    if (showGallery) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [showGallery, activePhotoIndex]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p>Carregando fotos...</p>
      </div>
    );
  }
  
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <ImageOff className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg">Nenhuma foto para exibir</p>
        <p className="text-sm mt-2">Escolha uma pasta com imagens para começar</p>
      </div>
    );
  }

  if (showGallery && photos.length > 0) {
    const activePhoto = photos[activePhotoIndex];
    
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="bg-black/50 px-6 py-4">
          <h2 className="text-white text-xl font-medium truncate max-w-2xl mx-auto">
            {activePhoto.name}
          </h2>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center">
          <img
            src={activePhoto.url}
            alt={activePhoto.name}
            className="max-h-[calc(100vh-12rem)] max-w-[calc(100vw-4rem)] object-contain"
          />
          
          <button
            onClick={handlePrevious}
            className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          >
            ×
          </button>
          
          <button
            onClick={() => onToggleSelect(activePhoto.id)}
            className={`absolute top-4 left-4 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activePhoto.selected
                ? 'bg-blue-500 text-white'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>{activePhoto.selected ? 'Selecionada' : 'Selecionar'}</span>
          </button>
        </div>
        
        <div className="h-24 bg-black/90 flex items-center overflow-x-auto">
          <div className="flex px-4 space-x-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setActivePhotoIndex(index)}
                className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden transition-transform ${
                  index === activePhotoIndex ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                />
                {photo.selected && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          onClick={() => {
            setActivePhotoIndex(index);
            setShowGallery(true);
          }}
          className="cursor-pointer"
        >
          <PhotoItem 
            photo={photo} 
            onToggleSelect={(id) => {
              onToggleSelect(id);
              event?.stopPropagation();
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;