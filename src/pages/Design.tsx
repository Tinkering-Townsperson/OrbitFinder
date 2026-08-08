import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PlanetCanvas, type PlanetConfig } from '../components/PlanetCanvas';

export function Design() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<PlanetConfig>({
    size: 1.2,
    terrainRoughness: 0.45,
    waterLevel: 0.45,
    landColor: '#2b8a3e',
    moons: 2,
    craters: 20,
    rotationSpeed: 0.002,
    name: 'Kepler-452b',
    age: 1500,
    type: 'Terrestrial',
  });

  const handleContinue = () => {
    navigate('/');
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
            onChange={(e) => setConfig({ ...config, type: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f5b1eb] cursor-pointer appearance-none"
          >
            <option value="Terrestrial">Terrestrial</option>
            <option value="Gas Giant">Gas Giant</option>
            <option value="Ice Giant">Ice Giant</option>
          </select>
        </div>

        {/* Planet Size */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Size</span>
            <span className="text-[#f5b1eb] font-mono">{config.size.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.6"
            max="2.2"
            step="0.1"
            value={config.size}
            onChange={(e) => setConfig({ ...config, size: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.size, 0.6, 2.2)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.size, 0.6, 2.2)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Terrain Roughness */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Terrain</span>
            <span className="text-[#f5b1eb] font-mono">{Math.round(config.terrainRoughness * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.terrainRoughness}
            onChange={(e) => setConfig({ ...config, terrainRoughness: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.terrainRoughness, 0, 1)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.terrainRoughness, 0, 1)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Craters (Only show for Terrestrial) */}
        {config.type === 'Terrestrial' && (
          <div>
            <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
              <span>Craters</span>
              <span className="text-[#f5b1eb] font-mono">{config.craters}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.craters}
              onChange={(e) => setConfig({ ...config, craters: parseInt(e.target.value, 10) })}
              style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.craters, 0, 100)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.craters, 0, 100)}%)` }}
              className="w-full appearance-none cursor-pointer h-2 rounded-md"
            />
          </div>
        )}

        {/* Water Level */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-bold text-white/90 font-fraunces">
            <span>Water</span>
            <span className="text-[#f5b1eb] font-mono">{Math.round(config.waterLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            value={config.waterLevel}
            onChange={(e) => setConfig({ ...config, waterLevel: parseFloat(e.target.value) })}
            style={{ background: `linear-gradient(to right, #f5b1eb ${getProgress(config.waterLevel, 0, 0.9)}%, rgba(0, 0, 0, 0.4) ${getProgress(config.waterLevel, 0, 0.9)}%)` }}
            className="w-full appearance-none cursor-pointer h-2 rounded-md"
          />
        </div>

        {/* Color Swatches Grid */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white/90 font-fraunces">Base Color</span>
            <input
              type="color"
              value={config.landColor}
              onChange={(e) => setConfig({ ...config, landColor: e.target.value })}
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
        <Button variant="primary" onClick={handleContinue} className="text-lg px-9 py-4 shadow-2xl shadow-[#FD3A73]/40">
          Continue
        </Button>
      </footer>
    </div>
  );
}
