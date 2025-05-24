import React from 'react';
import { X, Download, Mail } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  onEmail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Escolha uma ação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center px-4 py-3 bg-[#FF4801]
                     hover:bg-[#DB2C1D] text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar em Pasta
          </button>

          <button
            onClick={onEmail}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500
                     hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Enviar por Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
