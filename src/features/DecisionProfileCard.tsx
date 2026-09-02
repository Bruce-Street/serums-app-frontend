import { useState, useEffect } from 'react';
import {
  UserCheck,
  Edit3,
  MapPin,
  Compass,
  Award,
  Stethoscope,
  X,
  Check,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useDecisionProfile } from '../hooks/useDecisionProfile';
import { useFilters } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export function DecisionProfileCard() {
  const { profile, saveProfile, isConfigured } = useDecisionProfile();
  const { data: filterOptions } = useFilters();
  const isProfileModalOpen = useAppStore((state) => state.isProfileModalOpen);
  const toggleProfileModal = useAppStore((state) => state.toggleProfileModal);

  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [profession, setProfession] = useState(profile?.profession || '');
  const [score, setScore] = useState<string>(
    profile?.finalScore !== null && profile?.finalScore !== undefined
      ? String(profile.finalScore)
      : '',
  );
  const [originType, setOriginType] = useState<'coordinates' | 'manual'>(
    profile?.origin?.type || 'manual',
  );
  const [department, setDepartment] = useState(profile?.origin?.department || '');
  const [province, setProvince] = useState(profile?.origin?.province || '');
  const [district, setDistrict] = useState(profile?.origin?.district || '');
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({
    lat: profile?.origin?.latitude,
    lon: profile?.origin?.longitude,
  });

  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleOpenEdit = () => {
    setProfession(profile?.profession || filterOptions?.profesiones?.[0] || '');
    setScore(
      profile?.finalScore !== null && profile?.finalScore !== undefined
        ? String(profile.finalScore)
        : '',
    );
    setOriginType(profile?.origin?.type || 'manual');
    setDepartment(profile?.origin?.department || '');
    setProvince(profile?.origin?.province || '');
    setDistrict(profile?.origin?.district || '');
    setCoords({
      lat: profile?.origin?.latitude,
      lon: profile?.origin?.longitude,
    });
    setGeoError(null);
    setValidationError(null);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isProfileModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleOpenEdit();
    }
  }, [isProfileModalOpen]);

  const handleClose = () => {
    setIsEditing(false);
    toggleProfileModal(false);
  };

  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('La geolocalización no está soportada por su navegador.');
      setOriginType('manual');
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setOriginType('coordinates');
        setIsGeolocating(false);
      },
      (error) => {
        setIsGeolocating(false);
        setOriginType('manual');
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Permiso denegado. Seleccione su lugar de origen manualmente.');
        } else {
          setGeoError('No se pudo obtener su ubicación. Seleccione manualmente.');
        }
      },
      { timeout: 10000 },
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!profession.trim()) {
      setValidationError('Por favor seleccione una profesión.');
      return;
    }

    let parsedScore: number | null = null;
    if (score !== '') {
      parsedScore = parseFloat(score);
      if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
        setValidationError('El puntaje final debe ser un número entre 0 y 100.');
        return;
      }
    }

    saveProfile({
      profession: profession.trim(),
      finalScore: parsedScore,
      origin:
        originType === 'coordinates'
          ? {
              type: 'coordinates',
              latitude: coords.lat,
              longitude: coords.lon,
            }
          : {
              type: 'manual',
              department: department.trim() || undefined,
              province: province.trim() || undefined,
              district: district.trim() || undefined,
            },
      lastUpdated: new Date().toISOString(),
    });

    handleClose();
  };

  const isModalVisible = isEditing || isProfileModalOpen;

  return (
    <>
      {/* Floating Card Desktop (top-right) - Hidden on Mobile */}
      <div className="hidden md:block fixed top-20 right-4 z-30 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl p-4 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#aa3bff]/10 text-[#aa3bff]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900 leading-none">Perfil de Decisión</h4>
              <span className="text-[10px] text-gray-400 font-medium">Recomendaciones</span>
            </div>
          </div>

          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1 text-xs font-bold text-[#aa3bff] hover:bg-[#aa3bff]/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isConfigured ? 'Editar' : 'Configurar'}
          </button>
        </div>

        {/* Card Content Summary */}
        <div className="pt-3 space-y-2 text-xs">
          {isConfigured && profile ? (
            <>
              <div className="flex justify-between items-center bg-gray-50/70 p-2 rounded-lg">
                <span className="text-gray-500 font-medium flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#aa3bff]" />
                  Profesión
                </span>
                <span className="font-semibold text-gray-900 truncate max-w-[140px]">
                  {profile.profession}
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50/70 p-2 rounded-lg">
                <span className="text-gray-500 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#aa3bff]" />
                  Puntaje Final
                </span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {profile.finalScore} pts
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50/70 p-2 rounded-lg">
                <span className="text-gray-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#aa3bff]" />
                  Origen
                </span>
                <span className="font-semibold text-gray-900 truncate max-w-[140px]">
                  {profile.origin?.type === 'coordinates'
                    ? 'GPS / Geolocalización'
                    : profile.origin?.district || profile.origin?.department || 'No especificado'}
                </span>
              </div>
            </>
          ) : (
            <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl text-center">
              <p className="text-[11px] text-purple-900 font-medium mb-2">
                Personaliza el ranking recomendador configurando tu profesión y puntaje.
              </p>
              <button
                onClick={handleOpenEdit}
                className="w-full bg-[#aa3bff] text-white font-bold py-1.5 px-3 rounded-xl text-xs shadow-xs hover:bg-[#992de0] transition-colors cursor-pointer"
              >
                Completar Perfil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Form Drawer (Responsive: Drawer on mobile, Modal on desktop) */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#aa3bff] text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Perfil de Decisión</h3>
                  <p className="text-xs text-gray-500">
                    Configura tus datos para personalizar las recomendaciones
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Profession */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Profesión <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-semibold focus:outline-none focus:border-[#aa3bff] focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona tu profesión</option>
                    {filterOptions?.profesiones?.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Final Score */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Puntaje Final SERUMS <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ej: 78.50"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-semibold focus:outline-none focus:border-[#aa3bff] focus:bg-white"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Puntaje ponderado de 0 a 100 utilizado para el cálculo de compatibilidad.
                </span>
              </div>

              {/* Place of Origin */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Lugar de Origen (Para cálculo de accesibilidad)
                </label>

                {/* Option Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleRequestGeolocation}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                      originType === 'coordinates'
                        ? 'bg-[#aa3bff]/10 border-[#aa3bff] text-[#aa3bff]'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    {isGeolocating ? 'Obteniendo...' : 'Usar GPS'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOriginType('manual');
                      setGeoError(null);
                    }}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                      originType === 'manual'
                        ? 'bg-[#aa3bff]/10 border-[#aa3bff] text-[#aa3bff]'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Búsqueda Manual
                  </button>
                </div>

                {geoError && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-2">
                    {geoError}
                  </p>
                )}

                {originType === 'coordinates' && coords.lat && coords.lon && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-semibold">Coordenadas capturadas</span>
                    <span className="text-[10px] text-green-700 font-mono">
                      {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                    </span>
                  </div>
                )}

                {originType === 'manual' && (
                  <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Departamento
                      </label>
                      <select
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          setProvince('');
                          setDistrict('');
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-semibold focus:outline-none"
                      >
                        <option value="">Seleccionar Departamento</option>
                        {filterOptions?.departamentos?.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">
                          Provincia
                        </label>
                        <input
                          type="text"
                          placeholder="Provincia"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">
                          Distrito
                        </label>
                        <input
                          type="text"
                          placeholder="Distrito"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#aa3bff] text-white font-bold text-xs shadow-md hover:bg-[#992de0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
