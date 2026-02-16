import React, { useState, useEffect } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (watermarkText: string, quality: number) => Promise<void>;
  isGenerating?: boolean;
}

const PDFModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false
}) => {
  const [watermarkText, setWatermarkText] = useState('Do Not Copy');
  const [imageQuality, setImageQuality] = useState('0.8');

  useEffect(() => {
    const savedWatermark = localStorage.getItem('pdfWatermarkText');
    if (savedWatermark) {
      setWatermarkText(savedWatermark);
    }
  }, []);

  useEffect(() => {
    if (watermarkText) {
      localStorage.setItem('pdfWatermarkText', watermarkText);
    }
  }, [watermarkText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (watermarkText.trim()) {
      await onGenerate(watermarkText.trim(), parseFloat(imageQuality));
      setWatermarkText('Do Not Copy');
      setImageQuality('0.8');
    }
  };

  const qualityOptions = [
    { value: '1.0', label: 'Original (100%)' },
    { value: '0.9', label: 'High (90%)' },
    { value: '0.8', label: 'Medium (80%)' },
    { value: '0.6', label: 'Low (60%)' },
    { value: '0.4', label: 'Very Low (40%)' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#FF4801]" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Gerar PDF
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isGenerating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="watermark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto de Marca d'água
              </label>
              <input
                type="text"
                id="watermark"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg focus:ring-2 focus:ring-[#FF4801] focus:border-[#FF4801]
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Digite o texto da marca d'água"
                required
                autoFocus
                disabled={isGenerating}
              />
            </div>

            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Qualidade da Imagem
              </label>
              <select
                id="quality"
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg focus:ring-2 focus:ring-[#FF4801] focus:border-[#FF4801]
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isGenerating}
              >
                {qualityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              A qualidade maior resultará em arquivos PDF maiores. Use qualidades menores para reduzir o tamanho do arquivo.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-[#FF4801] hover:bg-[#DB2C1D] disabled:bg-gray-400
                       text-white rounded-lg transition-colors flex items-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar PDF
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PDFModal;
