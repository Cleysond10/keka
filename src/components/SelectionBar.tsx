import { useState } from 'react';
import { CheckSquare, MinusSquare, ArrowUpDown, Eye } from 'lucide-react';

interface SelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSort: (criteria: 'name' | 'date' | 'size') => void;
  onReviewSelected: () => void;
}

const SelectionBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onSort,
  onReviewSelected
}: SelectionBarProps) => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const handleSelectionMessage = () => {
    if (selectedCount === 0) {
      return 'Nenhuma foto selecionada';
    } else if (selectedCount === totalCount) {
      return 'Todas as fotos selecionadas';
    } else {
      return `Você selecionou ${selectedCount} de ${totalCount} fotos`;
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg px-4 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="font-medium mr-4">{handleSelectionMessage()}</span>

        {totalCount > 0 && (
          selectedCount > 0 ? (
            <button
              onClick={onDeselectAll}
              className="flex items-center text-sm text-[#FF4801] hover:text-[#DB2C1D]"
              aria-label="Desmarcar todas as fotos"
            >
              <MinusSquare className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Desmarcar Todas</span>
            </button>
          ) : (
            <button
              onClick={onSelectAll}
              className="flex items-center text-sm text-[#FF4801] hover:text-[#DB2C1D]"
              aria-label="Selecionar todas as fotos"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Selecionar Todas</span>
            </button>
          )
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800
                    dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Ordenar fotos"
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Ordenar</span>
          </button>

          {sortMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-800
                          rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-40 z-10">
              <button
                onClick={() => {
                  onSort('name');
                  setSortMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100
                        dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Por nome
              </button>
              <button
                onClick={() => {
                  onSort('date');
                  setSortMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100
                        dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Por data
              </button>
              <button
                onClick={() => {
                  onSort('size');
                  setSortMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100
                        dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Por tamanho
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onReviewSelected}
          disabled={selectedCount === 0}
          className={`flex items-center rounded-lg px-4 py-2 font-medium transition-colors duration-200
                  ${selectedCount > 0
                    ? 'bg-[#FF4801] hover:bg-[#DB2C1D] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
          aria-label="Revisar fotos selecionadas"
        >
          <Eye className="w-4 h-4 mr-2" />
          <span>Ir para Revisão</span>
        </button>
      </div>
    </footer>
  );
};

export default SelectionBar;
