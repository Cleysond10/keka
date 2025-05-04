/**
 * Utility functions for handling file system operations
 */

import { Photo } from '../types';

/**
 * Checks if the File System Access API is available in the browser
 */
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window && window.self === window.top;
};

/**
 * Gets a directory handle using the File System Access API
 */
export const getDirectoryHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    if (window.self !== window.top) {
      throw new Error('File picker cannot be opened in a cross-origin iframe. Please open the application in a new window.');
    }
    // @ts-ignore - TypeScript doesn't recognize showDirectoryPicker yet
    return await window.showDirectoryPicker();
  } catch (error) {
    console.error('Error picking directory:', error);
    throw error; // Re-throw to allow handling in the UI layer
  }
};

/**
 * Reads all image files from a directory handle
 */
export const readImagesFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<Photo[]> => {
  const photos: Photo[] = [];
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  try {
    // Recursively read all files in the directory
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        
        // Check if this is an image file
        if (imageTypes.includes(file.type)) {
          const url = URL.createObjectURL(file);
          
          // Get image dimensions
          const dimensions = await getImageDimensions(url);
          
          photos.push({
            id: crypto.randomUUID(),
            name: file.name,
            path: file.name,
            url,
            selected: false,
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            lastModified: file.lastModified
          });
        }
      }
    }
    
    return photos;
  } catch (error) {
    console.error('Error reading files from directory:', error);
    return [];
  }
};

/**
 * Gets image dimensions by loading it into an Image object
 */
const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = url;
  });
};

/**
 * Downloads selected photos to a 'selected_photos' folder
 */
export const downloadSelectedPhotos = async (photos: Photo[]): Promise<void> => {
  try {
    if (window.self !== window.top) {
      throw new Error('File picker cannot be opened in a cross-origin iframe. Please open the application in a new window.');
    }
    // Create a directory to save photos
    // @ts-ignore - TypeScript doesn't recognize showDirectoryPicker yet
    const dirHandle = await window.showDirectoryPicker();
    
    // Create a 'selected_photos' subfolder
    const selectedDirHandle = await dirHandle.getDirectoryHandle('selected_photos', { create: true });
    
    // Save each selected photo
    for (const photo of photos) {
      if (photo.selected) {
        const response = await fetch(photo.url);
        const blob = await response.blob();
        
        // Write the file to the selected_photos directory
        const fileHandle = await selectedDirHandle.getFileHandle(photo.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
    }
    
    alert('Selected photos saved successfully!');
  } catch (error) {
    console.error('Error saving selected photos:', error);
    throw error; // Re-throw to allow handling in the UI layer
  }
};

/**
 * Formats file size into a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a date timestamp into a readable string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};