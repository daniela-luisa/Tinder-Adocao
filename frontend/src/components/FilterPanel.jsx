import { useState } from 'react';
import { FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaTimes } from 'react-icons/fa';

function FilterPanel({ onFilterChange, availableLocations, availableAges, availableCharacteristics, initialFilters }) {
  const init = initialFilters || { locations: [], ages: [], characteristics: [] };
  const [selectedLocations, setSelectedLocations] = useState(init.locations);
  const [selectedAges, setSelectedAges] = useState(init.ages);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState(init.characteristics);

  const toggle = (list, setList, value) => {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    setList(next);
    return next;
  };

  const handleLocation = (val) => {
    const next = toggle(selectedLocations, setSelectedLocations, val);
    onFilterChange({ locations: next, ages: selectedAges, characteristics: selectedCharacteristics });
  };

  const handleAge = (val) => {
    const next = toggle(selectedAges, setSelectedAges, val);
    onFilterChange({ locations: selectedLocations, ages: next, characteristics: selectedCharacteristics });
  };

  const handleCharacteristic = (val) => {
    const next = toggle(selectedCharacteristics, setSelectedCharacteristics, val);
    onFilterChange({ locations: selectedLocations, ages: selectedAges, characteristics: next });
  };

  const clearAll = () => {
    setSelectedLocations([]);
    setSelectedAges([]);
    setSelectedCharacteristics([]);
    onFilterChange({ locations: [], ages: [], characteristics: [] });
  };

  const activeCount = selectedLocations.length + selectedAges.length + selectedCharacteristics.length;

  return (
    <div className="space-y-5">

      {availableLocations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt size={15} className="text-pink-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Localização</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableLocations.map((loc) => (
              <button key={loc} onClick={() => handleLocation(loc)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLocations.includes(loc) ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableAges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt size={15} className="text-orange-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Idade</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableAges.map((age) => (
              <button key={age} onClick={() => handleAge(age)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAges.includes(age) ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {age}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableCharacteristics.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaStar size={15} className="text-yellow-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Características</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableCharacteristics.map((char) => (
              <button key={char} onClick={() => handleCharacteristic(char)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCharacteristics.includes(char) ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableLocations.length === 0 && availableAges.length === 0 && availableCharacteristics.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Nenhum filtro disponível</p>
      )}

      {activeCount > 0 && (
        <button onClick={clearAll}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
          <FaTimes size={14} /> Limpar filtros
        </button>
      )}

    </div>
  );
}

export default FilterPanel;