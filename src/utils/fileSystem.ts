import { Photo } from '../types';

export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window && window.self === window.top;
};

export const getDirectoryHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    if (window.self !== window.top) {
      throw new Error('File picker cannot be opened in a cross-origin iframe. Please open the application in a new window.');
    }
    // @ts-ignore - TypeScript doesn't recognize showDirectoryPicker yet
    return await window.showDirectoryPicker();
  } catch (error) {
    if (error instanceof Error && error.name === 'SecurityError') {
      throw new Error('Por favor, tente novamente clicando no botão de seleção de pasta.');
    }
    console.error('Error picking directory:', error);
    throw error;
  }
};

export const readImagesFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<Photo[]> => {
  const photos: Photo[] = [];
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  try {
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();

        if (imageTypes.includes(file.type)) {
          const url = URL.createObjectURL(file);

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

export const downloadSelectedPhotos = async (photos: Photo[], folderName: string): Promise<void> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize showDirectoryPicker yet
    const dirHandle = await window.showDirectoryPicker();

    const selectedDirHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });

    for (const photo of photos) {
      const response = await fetch(photo.url);
      const blob = await response.blob();

      const fileHandle = await selectedDirHandle.getFileHandle(photo.name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'SecurityError') {
      throw new Error('Por favor, tente novamente clicando no botão de download.');
    }
    console.error('Error saving selected photos:', error);
    throw error;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
