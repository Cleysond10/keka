import React, { useState } from 'react';
import { CheckSquare, Info } from 'lucide-react';
import { Photo } from '../types';
import { formatFileSize, formatDate } from '../utils/fileSystem';

interface PhotoItemProps {
  photo: Photo;
  onToggleSelect: (id: string) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onToggleSelect }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggleSelect(photo.id);
      e.preventDefault();
    }
  };
  
  return (
    <div 
      className={`relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200
                ${photo.selected ? 'ring-2 ring-blue-500 scale-[0.98]' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
                cursor-pointer`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={photo.selected}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={photo.url}
          alt={photo.name}
          className={`w-full h-full object-cover transition-transform duration-200
                    ${photo.selected ? 'scale-105' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
        
        {photo.selected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
            <CheckSquare className="text-blue-500 w-8 h-8" />
          </div>
        )}
        
        <button
          className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-40 hover:bg-opacity-60 
                   text-white rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(photo.id);
          }}
          aria-label={photo.selected ? "Desmarcar foto" : "Selecionar foto"}
        >
          <CheckSquare className="w-4 h-4" />
        </button>
        
        <button
          className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-40 hover:bg-opacity-60 
                   text-white rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(!showInfo);
          }}
          aria-label="Mostrar informações da foto"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      
      <div className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <p className="text-sm font-medium truncate">{photo.name}</p>
      </div>
      
      {showInfo && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-75 p-3 text-white text-sm 
                   flex flex-col justify-start"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-medium mb-2 truncate">{photo.name}</h3>
          <p>Tamanho: {formatFileSize(photo.size)}</p>
          <p>Dimensões: {photo.width} × {photo.height}</p>
          <p>Modificado em: {formatDate(photo.lastModified)}</p>
          <button
            className="mt-auto self-end text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(false);
            }}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoItem;