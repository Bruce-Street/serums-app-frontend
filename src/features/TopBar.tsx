import { MapPin, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useState, useEffect } from 'react';

export function TopBar() {
  const updateFilter = useAppStore((state) => state.updateFilter);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilter('search', searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, updateFilter]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 relative">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <MapPin className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">SERUMS Map</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
            placeholder="Search establishments, districts, codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
