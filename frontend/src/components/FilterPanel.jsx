import { useState } from 'react';
import { FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaTimes } from 'react-icons/fa';

function FilterPanel({ onFilterChange, availableLocations, availableAges, availableCharacteristics }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

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
    <div className="w-full max-w-md mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <FaFilter size={16} className="text-pink-600" />
          <span className="font-medium text-gray-700">
            Filtros
            {activeCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">{activeCount}</span>
            )}
          </span>
        </div>
        <FaFilter size={14} className="text-gray-400" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
      </button>

      {isOpen && (
        <div className="mt-3 p-6 bg-white rounded-2xl shadow-lg space-y-5">
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

          {activeCount > 0 && (
            <button onClick={clearAll}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <FaTimes size={14} /> Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
