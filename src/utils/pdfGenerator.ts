import { Photo } from '../types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PDFGenerationOptions {
  watermarkText: string;
  imageQuality: number; // 0.4 to 1.0
  onProgress?: (progress: number) => void;
}

const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const resizeImage = (
  dataUrl: string,
  quality: number,
  maxWidth = 1600,
  maxHeight = 1200
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};

const addWatermark = (
  dataUrl: string,
  text: string,
  quality: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(img, 0, 0);

      if (ctx) {
        const fontSize = Math.floor((img.width / text.length) * 1.6);

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, img.width / 2, img.height / 2);
      }

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};

const removeFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
};

export const generatePDFFromPhotos = async (
  photos: Photo[],
  options: PDFGenerationOptions
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    if (options.onProgress) {
      options.onProgress((i / photos.length) * 90);
    }

    // Fetch the image
    const response = await fetch(photo.url);
    const blob = await response.blob();
    const dataUrl = await fileToDataUrl(blob as File);

    // Resize and quality reduction
    const resizedDataUrl = await resizeImage(dataUrl, options.imageQuality);

    // Add watermark
    const watermarkedDataUrl = await addWatermark(
      resizedDataUrl,
      options.watermarkText,
      options.imageQuality
    );

    // Embed in PDF
    const base64Data = watermarkedDataUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const image = await pdfDoc.embedJpg(imageBytes);

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width + 100, height + 150]);

    page.drawImage(image, {
      x: 50,
      y: 100,
      width,
      height,
    });

    // Add filename as title
    const fileName = removeFileExtension(photo.name);
    const titleFontSize = 28;
    const titleWidth = font.widthOfTextAtSize(fileName, titleFontSize);
    page.drawText(fileName, {
      x: (page.getWidth() - titleWidth) / 2,
      y: 50,
      size: titleFontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  if (options.onProgress) {
    options.onProgress(100);
  }

  return await pdfDoc.save();
};

export const downloadPDF = (pdfBytes: Buffer | Uint8Array, filename = 'photos.pdf') => {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
