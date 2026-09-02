import { GitCompare, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function CompareFloatingBar() {
  const comparedPlazaIds = useAppStore((state) => state.comparedPlazaIds);
  const toggleCompareView = useAppStore((state) => state.toggleCompareView);
  const clearCompare = useAppStore((state) => state.clearCompare);

  if (comparedPlazaIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 bg-gray-900/95 text-white backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[calc(100vw-120px)] sm:max-w-none">
      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
        <GitCompare className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#aa3bff] shrink-0" />
        <span className="text-xs font-bold truncate">
          {comparedPlazaIds.length} <span className="hidden sm:inline">{comparedPlazaIds.length === 1 ? 'plaza' : 'plazas'}</span>
        </span>
      </div>

      <button
        onClick={() => toggleCompareView(true)}
        className="px-2.5 sm:px-3 py-1 bg-[#aa3bff] hover:bg-[#992eee] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
      >
        Comparar
      </button>

      <button
        onClick={clearCompare}
        className="p-1 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
        title="Limpiar lista"
        aria-label="Limpiar lista"
      >
        <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
      </button>
    </div>
  );
}

