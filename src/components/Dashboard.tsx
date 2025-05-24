import { useEffect, useState } from 'react';
import { Moon, Sun, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import DirectoryPicker from './DirectoryPicker';
import PhotoGrid from './PhotoGrid';
import SelectionBar from './SelectionBar';
import FolderNameModal from './FolderNameModal';
import EmailModal from './EmailModal';
import ActionModal from './ActionModal';
import LightLogo from '../assets/logo-lighttheme.png';
import DarkLogo from '../assets/logo-darktheme.png';
import { usePhotos } from '../hooks/usePhotos';
import { downloadSelectedPhotos } from '../utils/fileSystem';
import { SmashEmailService, type EmailData } from '../services/EmailService';

const emailService = new SmashEmailService();

const Dashboard = () => {
  const {
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
  } = usePhotos();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showReview, setShowReview] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showFolderNameModal, setShowFolderNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleActionClick = () => {
    setShowActionModal(true);
  };

  const handleDownloadClick = () => {
    setShowActionModal(false);
    setShowFolderNameModal(true);
  };

  const handleEmailClick = () => {
    setShowActionModal(false);
    setShowEmailModal(true);
  };

  const handleConfirmDownload = (folderName: string) => {
    const selectedPhotos = getSelectedPhotos();
    setShowFolderNameModal(false);

    downloadSelectedPhotos(selectedPhotos, folderName)
      .then(() => {
        toast.success('Fotos salvas com sucesso!');
        deselectAllPhotos();
        setShowReview(false);
      })
      .catch(error => {
        toast.error(error instanceof Error ? error.message : 'Erro ao salvar as fotos.');
      });
  };

  const handleSendEmail = async (to: string, subject: string, message: string) => {
    const selectedPhotos = getSelectedPhotos();
    setShowEmailModal(false);

    const loadingToast = toast.loading('Enviando email...');

    try {
      const files = await Promise.all(
        selectedPhotos.map(async (photo) => {
          console.log('Fetching photo:', photo.url);
          const response = await fetch(photo.url);
          const blob = await response.blob();
          return new File([blob], photo.name, { type: blob.type });
        })
      );

      const emailData: EmailData = {
        to,
        subject,
        message,
        files
      };

      await emailService.sendEmail(emailData);

      toast.success('Email enviado com sucesso!', { id: loadingToast });
      deselectAllPhotos();
      setShowReview(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar email.',
        { id: loadingToast }
      );
    }
  };

  const handleSort = (criteria: 'name' | 'date' | 'size') => {
    sortPhotos(criteria);
  };

  if (showReview) {
    const selectedPhotos = getSelectedPhotos();

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster position="top-right" />
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={theme === 'dark' ? DarkLogo : LightLogo}
                alt="Logo"
                className="h-12 w-16 rounded-full"
              />

              <h1 className="text-xl font-semibold">Revise as fotos selecionadas</h1>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {selectedPhotos.map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => togglePhotoSelection(photo.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0
                           group-hover:opacity-100 transition-opacity"
                  title="Remover da seleção"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg px-4 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPhotos.length} fotos selecionadas
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReview(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100
                         dark:hover:bg-gray-700 rounded-lg"
              >
                Voltar para Galeria
              </button>
              <button
                onClick={handleActionClick}
                className="px-4 py-2 bg-[#FF4801] hover:bg-[#DB2C1D] text-white rounded-lg
                         transition-colors flex items-center"
              >
                Avançar
              </button>
            </div>
          </div>
        </footer>

        <ActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onDownload={handleDownloadClick}
          onEmail={handleEmailClick}
        />

        <FolderNameModal
          isOpen={showFolderNameModal}
          onClose={() => setShowFolderNameModal(false)}
          onConfirm={handleConfirmDownload}
        />

        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Toaster position="top-right" />
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={theme === 'dark' ? DarkLogo : LightLogo}
              alt="Logo"
              className="h-12 w-16 rounded-full"
            />

            <div className="ml-3">
              <h1 className="text-xl font-semibold">KEKA</h1>
              <p className="text-sm font-normal">Sistema para Gestão de Fotos</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <DirectoryPicker
            onPickDirectory={loadPhotosFromDirectory}
            loading={loading}
            directoryName={directory.name}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-20">
          <PhotoGrid
            photos={photos}
            loading={loading}
            onToggleSelect={togglePhotoSelection}
          />
        </div>

        <SelectionBar
          selectedCount={selectedCount}
          totalCount={photos.length}
          onSelectAll={selectAllPhotos}
          onDeselectAll={deselectAllPhotos}
          onSort={handleSort}
          onReviewSelected={() => setShowReview(true)}
        />
      </main>

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onDownload={handleDownloadClick}
        onEmail={handleEmailClick}
      />

      <FolderNameModal
        isOpen={showFolderNameModal}
        onClose={() => setShowFolderNameModal(false)}
        onConfirm={handleConfirmDownload}
      />

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
      />
    </div>
  );
};

export default Dashboard;
