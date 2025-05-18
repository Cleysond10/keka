import { useState, useCallback } from 'react';
import { Photo, Directory } from '../types';
import { getDirectoryHandle, readImagesFromDirectory } from '../utils/fileSystem';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [directory, setDirectory] = useState<Directory>({ name: '', handle: null });
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const loadPhotosFromDirectory = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const directoryHandle = await getDirectoryHandle();

      if (directoryHandle) {
        const loadedPhotos = await readImagesFromDirectory(directoryHandle);
        setPhotos(loadedPhotos);
        setDirectory({
          name: directoryHandle.name,
          handle: directoryHandle
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load photos. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePhotoSelection = useCallback((id: string) => {
    setPhotos(prevPhotos => {
      const updatedPhotos = prevPhotos.map(photo =>
        photo.id === id ? { ...photo, selected: !photo.selected } : photo
      );

      const newSelectedCount = updatedPhotos.filter(photo => photo.selected).length;
      setSelectedCount(newSelectedCount);

      return updatedPhotos;
    });
  }, []);

  const selectAllPhotos = useCallback(() => {
    setPhotos(prevPhotos => {
      const updatedPhotos = prevPhotos.map(photo => ({ ...photo, selected: true }));
      setSelectedCount(updatedPhotos.length);
      return updatedPhotos;
    });
  }, []);

  const deselectAllPhotos = useCallback(() => {
    setPhotos(prevPhotos => {
      const updatedPhotos = prevPhotos.map(photo => ({ ...photo, selected: false }));
      setSelectedCount(0);
      return updatedPhotos;
    });
  }, []);

  const getSelectedPhotos = useCallback(() => {
    return photos.filter(photo => photo.selected);
  }, [photos]);

  const sortPhotos = useCallback((criteria: 'name' | 'date' | 'size', ascending = true) => {
    setPhotos(prevPhotos => {
      const sortedPhotos = [...prevPhotos].sort((a, b) => {
        let comparison = 0;

        switch (criteria) {
          case 'date':
            comparison = a.lastModified - b.lastModified;
            break;
          case 'size':
            comparison = a.size - b.size;
            break;
          default:
            comparison = a.name.localeCompare(b.name);
            break;
        }

        return ascending ? comparison : -comparison;
      });

      return sortedPhotos;
    });
  }, []);

  return {
    photos,
    loading,
    error,
    directory,
    selectedCount,
    loadPhotosFromDirectory,
    togglePhotoSelection,
    selectAllPhotos,
    deselectAllPhotos,
    getSelectedPhotos,
    sortPhotos
  };
};
