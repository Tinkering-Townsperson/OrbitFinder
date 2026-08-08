import { useState } from 'react';
import { PlanetCanvas } from '../components/PlanetCanvas';

// Mock data for the matching experience
const MOCK_PLANETS = [
  {
    id: 1,
    name: 'Kepler-452b',
    type: 'Terrestrial',
    size: 'Earth-like (1.0x)',
    temper: 'Mild',
    terrain: 'Mountains & Valleys',
    water: '60% Oceans',
    moons: 1,
    craters: 'Few',
    age: '4.5 Billion Yrs',
    colors: ['#4ade80', '#10437a'],
    renderConfig: { size: 1.0, colour: '#4ade80', water: 0.6, terrain: 0.7, moons: 1, craters: 20, name: 'Kepler-452b', age: 4500, type: 'terrestrial' as any }
  },
  {
    id: 2,
    name: 'Gliese 581c',
    type: 'Ice Giant',
    size: 'Super-Earth (4.2x)',
    temper: 'Frigid',
    terrain: 'Smooth Ice',
    water: '0% Liquid',
    moons: 5,
    craters: 'Heavily Bombarded',
    age: '8.1 Billion Yrs',
    colors: ['#a5d8ff', '#1f4b8e'],
    renderConfig: { size: 1.3, colour: '#a5d8ff', water: 0, terrain: 0.3, moons: 5, craters: 80, name: 'Gliese 581c', age: 8100, type: 'ice' as any }
  },
  {
    id: 3,
    name: 'HD 209458 b',
    type: 'Gas Giant',
    size: 'Jupiter-like (300x)',
    temper: 'Scorching',
    terrain: 'Gas & Storms',
    water: '0% Liquid',
    moons: 0,
    craters: 'None',
    age: '1.2 Billion Yrs',
    colors: ['#fca5a5', '#450a0a'],
    renderConfig: { size: 1.8, colour: '#fca5a5', water: 0, terrain: 0.1, moons: 0, craters: 0, name: 'HD 209458 b', age: 1200, type: 'gas' as any }
  }
];

export function Match() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < MOCK_PLANETS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back or show empty state
      setCurrentIndex(0);
    }
  };

  const planet = MOCK_PLANETS[currentIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f12] text-white font-sans select-none">
      
      {/* 3D Viewer Background */}
      <PlanetCanvas config={planet.renderConfig} />

      {/* Top Logo */}
      <div className="absolute top-6 left-6 sm:left-8 z-20 pointer-events-none">
        <h1 className="text-3xl font-bold tracking-tighter text-[#8f6589] bg-clip-text font-fraunces drop-shadow-md">
          OrbitFinder
        </h1>
      </div>

      {/* Bottom Floating Info Card */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-2xl flex flex-col gap-4 pointer-events-auto">
          
          {/* Glassmorphism Info Panel */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
              <div>
                <h2 className="text-4xl font-bold font-fraunces text-white flex items-center gap-3">
                  {planet.name} 
                  <span className="text-xl font-normal text-white/50 tracking-wide">{planet.age}</span>
                </h2>
                <p className="text-[#f5b1eb] font-semibold tracking-wider text-sm uppercase mt-1">
                  {planet.type} • {planet.size}
                </p>
              </div>
              <div className="flex gap-2">
                {planet.colors.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Traits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <TraitBadge label="Temper" value={planet.temper} />
              <TraitBadge label="Terrain" value={planet.terrain} />
              <TraitBadge label="Water" value={planet.water} />
              <TraitBadge label="Moons" value={`${planet.moons} Orbiting`} />
              <TraitBadge label="Craters" value={planet.craters} className="sm:col-span-2" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-2 mb-4">
            <button 
              onClick={handleNext}
              className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ff6b6b] hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all backdrop-blur-md shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <button 
              onClick={handleNext}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5b1eb] to-[#cf7cc2] flex items-center justify-center text-white shadow-[0_0_30px_rgba(207,124,194,0.4)] hover:scale-105 active:scale-95 transition-all hover:shadow-[0_0_40px_rgba(207,124,194,0.6)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper component for traits
function TraitBadge({ label, value, className = '' }: { label: string, value: string, className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">{label}</span>
      <span className="text-sm font-medium text-white/90">{value}</span>
    </div>
  );
}
