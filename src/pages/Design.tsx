import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PlanetCanvas } from '../components/PlanetCanvas';
import type { Planet } from '../planet';

export function Design() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<Planet>({
    size: 0.375, // Corresponds to 1.2 visual size (0.6 + 0.375 * 1.6)
    terrain: 0.45,
    water: 0.5,  // Corresponds to 0.45 visual water (0.5 * 0.9)
    colour: '#2b8a3e',
    moons: 2,
    craters: 0.2, // Corresponds to 20 visual craters
    name: 'Kepler-452b',
    age: 1500,
    type: 'terrestrial',
    favoured: 'water', // Default favoured trait
  });

  const handleContinue = () => {
    navigate('/match', { state: { userPlanet: config } });
  };

  const getProgress = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const formatAge = (age: number) => {
    if (age < 1000) return `${age} Million Yrs`;
    return `${(age / 1000).toFixed(1)} Billion Yrs`;
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f12] text-white font-sans select-none">
      {/* 3D WebGL Planet Scene */}
      <PlanetCanvas config={config} />

      {/* Simple, Non-Tabulated Control Card */}
      <aside className="absolute top-6 left-6 sm:left-8 w-80 sm:w-96 bg-[#16191e]/85 backdrop-blur-2xl border border-white/10 rounded-xs p-6 z-20 shadow-2xl shadow-black/60 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Name Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Name</span>
          </div>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f5b1eb]"
            placeholder="Planet Name"
          />
        </div>

        {/* Type Select */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Type</span>
          </div>
          <select
            value={config.type}
            onChange={(e) => {
              const newType = e.target.value as any;
              setConfig({ 
                ...config, 
                type: newType,
                ...(newType !== 'terrestrial' ? { craters: 0 } : {})
              });
            }}
            className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f5b1eb] appearance-none"
          >
            <option value="terrestrial">Terrestrial</option>
            <option value="gas">Gas Giant</option>
            <option value="ice">Ice Giant</option>
          </select>
        </div>

        {/* Favored Trait Select */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Most Important Factor</span>
          </div>
          <select
            value={config.favoured}
            onChange={(e) => setConfig({ ...config, favoured: e.target.value as any })}
            className="w-full bg-black/40 border border-[#f5b1eb]/30 rounded-md px-3 py-2 text-sm text-[#f5b1eb] focus:outline-none focus:border-[#f5b1eb] appearance-none shadow-[0_0_10px_rgba(245,177,235,0.1)]"
          >
            <option value="water">Wet / Dry Oceans</option>
            <option value="terrain">Rugged / Smooth Terrain</option>
            <option value="colour">Complementary Colors</option>
            <option value="size">Similar Size</option>
            <option value="age">Similar Age</option>
            <option value="moon">Similar Moons</option>
          </select>
        </div>

        {/* Planet Size */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Size</span>
            <span className="text-[#f5b1eb] font-mono">{(0.6 + config.size * 1.6).toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.size}
            onChange={(e) => setConfig({ ...config, size: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.size, 0, 1)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.size, 0, 1)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Terrain Roughness */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Terrain</span>
            <span className="text-[#f5b1eb] font-mono">{Math.round(config.terrain * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.terrain}
            onChange={(e) => setConfig({ ...config, terrain: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.terrain, 0, 1)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.terrain, 0, 1)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Craters (Only show for Terrestrial) */}
        {config.type === 'terrestrial' && (
          <div>
            <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
               <span>Craters</span>
              <span className="text-[#f5b1eb] font-mono">{Math.round(config.craters * 100)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.craters}
              onChange={(e) => setConfig({ ...config, craters: parseFloat(e.target.value) })}
              style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.craters, 0, 1)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.craters, 0, 1)}%)` }}
              className="w-full appearance-none cursor-pointer h-2 rounded-md"
            />
          </div>
        )}

        {/* Water Level */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Water</span>
            <span className="text-[#f5b1eb] font-mono">{Math.round(config.water * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.water}
            onChange={(e) => setConfig({ ...config, water: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.water, 0, 1)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.water, 0, 1)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Color Swatches Grid */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white/90 font-fraunces">Base Color</span>
            <input
              type="color"
              value={config.colour}
              onChange={(e) => setConfig({ ...config, colour: e.target.value })}
              className="w-8 h-8 rounded-md cursor-pointer bg-transparent border border-white/20 p-0 overflow-hidden"
            />
          </div>
        </div>

        {/* Age */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
              <span>Age</span>
              <span className="text-[#f5b1eb] font-mono text-xs">{formatAge(config.age)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12000"
              step="10"
              value={config.age}
              onChange={(e) => setConfig({ ...config, age: parseInt(e.target.value, 10) })}
              style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.age, 1, 12000)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.age, 1, 12000)}%)` }}
              className="w-full appearance-none cursor-pointer h-2 rounded-md"
            />
          </div>
        </div>

        {/* Moons */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
              <span>Moons</span>
              <span className="text-[#f5b1eb] font-mono text-xs">{config.moons}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={config.moons}
              onChange={(e) => setConfig({ ...config, moons: parseInt(e.target.value, 10) })}
              style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.moons, 0, 10)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.moons, 0, 10)}%)` }}
              className="w-full appearance-none cursor-pointer h-2 rounded-md"
            />
          </div>
        </div>
      </aside>

      {/* Floating Continue Button */}
      <footer className="absolute bottom-8 right-8 z-20">
        <Button variant="primary" onClick={handleContinue} className="text-lg px-9 py-4">
          Continue
        </Button>
      </footer>
    </div>
  );
}
