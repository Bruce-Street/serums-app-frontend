import { GitCompare, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function CompareFloatingBar() {
  const comparedPlazaIds = useAppStore((state) => state.comparedPlazaIds);
  const toggleCompareView = useAppStore((state) => state.toggleCompareView);
  const clearCompare = useAppStore((state) => state.clearCompare);

  if (comparedPlazaIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-[#aa3bff]" />
        <span className="text-xs font-bold">
          {comparedPlazaIds.length} {comparedPlazaIds.length === 1 ? 'plaza seleccionada' : 'plazas seleccionadas'}
        </span>
      </div>

      <button
        onClick={() => toggleCompareView(true)}
        className="px-3 py-1 bg-[#aa3bff] hover:bg-[#992eee] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
      >
        Comparar ahora
      </button>

      <button
        onClick={clearCompare}
        className="p-1 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer ml-1"
        title="Limpiar lista"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
