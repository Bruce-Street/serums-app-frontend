import { MapPin, Search, Map as MapIcon, Building2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useState, useEffect, useRef } from 'react';
import { useGlobalSearch } from '../hooks/queries';
import type { GlobalSearchResult, PlazaMapItem } from '../types';

export function TopBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setFlyToLocation = useAppStore((state) => state.setFlyToLocation);
  const setSelectedEstablishment = useAppStore((state) => state.setSelectedEstablishment);

  // Debounced value for API
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: searchResults, isFetching } = useGlobalSearch(debouncedSearchTerm);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: GlobalSearchResult) => {
    setFlyToLocation({ lat: result.lat, lng: result.lon });
    setIsDropdownOpen(false);
    setSearchTerm('');

    if (result.type === 'plaza') {
      // Mock an establishment to open the info panel. 
      // We don't have the full 'plazas' array here, so we provide an empty one.
      // The PlazaInfoPanel will handle fetching detailed data.
      const mockEstablishment: PlazaMapItem = {
        codigo_renipress_id: result.id || '',
        nombre_establecimiento: result.name,
        latitud: result.lat,
        longitud: result.lon,
        grado_dificultad: '',
        zaf: false,
        ze: false,
        plazas: [],
      };
      setSelectedEstablishment(mockEstablishment);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-50 relative">
      <div className="flex items-center gap-2">
        <div className="bg-[#aa3bff]/10 p-2 rounded-lg">
          <MapPin className="text-[#aa3bff] w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">SERUMS Map</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4 relative" ref={dropdownRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] sm:text-sm transition-colors"
            placeholder="Search establishments, districts, codes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
        </div>

        {/* Search Dropdown */}
        {isDropdownOpen && searchTerm.length >= 2 && (
          <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50 py-2">
            {isFetching ? (
              <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-[#aa3bff] border-t-transparent animate-spin"></div>
                Searching...
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="flex flex-col">
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.id || idx}`}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors flex items-start gap-3"
                  >
                    {result.type === 'place' ? (
                      <div className="mt-1 bg-blue-100 p-1.5 rounded-lg text-blue-600 shrink-0">
                        <MapIcon className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="mt-1 bg-[#aa3bff]/10 p-1.5 rounded-lg text-[#aa3bff] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-gray-900 truncate ${result.type === 'plaza' ? 'font-bold' : 'font-medium'}`}>
                        {result.name}
                      </p>
                      
                      {result.type === 'plaza' && result.id && (
                        <p className="text-xs font-semibold text-[#aa3bff] mt-0.5">
                          RENIPRESS: {result.id}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {result.location}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
