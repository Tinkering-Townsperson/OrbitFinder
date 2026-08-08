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
    <div className="flex w-screen h-screen overflow-hidden bg-[#0d0f12] text-white font-sans select-none">
      
      {/* Left Panel: Info and Actions */}
      <div className="w-1/3 min-w-[350px] max-w-[450px] h-full bg-[#16191e] border-r border-white/10 flex flex-col relative z-20 shadow-2xl">
        {/* Top Logo */}
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tighter text-[#8f6589] bg-clip-text font-fraunces drop-shadow-md">
            OrbitFinder
          </h1>
        </div>

        {/* Content (Name, Traits) */}
        <div className="flex-grow p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-bold font-fraunces text-white">
              {planet.name} 
            </h2>
            <div className="text-xl font-normal text-white/50 tracking-wide">{planet.age}</div>
            <p className="text-[#f5b1eb] font-semibold tracking-wider text-sm uppercase mt-1">
              {planet.type} • {planet.size}
            </p>
          </div>

          <div className="flex gap-3">
            {planet.colors.map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-sm border border-white/20 shadow-inner" style={{ backgroundColor: c }} />
            ))}
          </div>

          {/* Traits Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <TraitBadge label="Temper" value={planet.temper} />
            <TraitBadge label="Terrain" value={planet.terrain} />
            <TraitBadge label="Water" value={planet.water} />
            <TraitBadge label="Moons" value={`${planet.moons} Orbiting`} />
            <TraitBadge label="Craters" value={planet.craters} className="col-span-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 border-t border-white/10 flex justify-center gap-8 bg-[#16191e]">
          <button 
            onClick={handleNext}
            className="w-16 h-16 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-[#ff6b6b] hover:bg-white/5 hover:border-[#ff6b6b]/50 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5b1eb] to-[#cf7cc2] flex items-center justify-center text-white shadow-[0_0_20px_rgba(207,124,194,0.3)] hover:scale-105 active:scale-95 transition-all hover:shadow-[0_0_30px_rgba(207,124,194,0.5)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>

      {/* Right Panel: 3D Viewer */}
      <div className="flex-grow relative h-full">
        <PlanetCanvas config={planet.renderConfig} />
      </div>
    </div>
  );
}

// Helper component for traits
function TraitBadge({ label, value, className = '' }: { label: string, value: string, className?: string }) {
  return (
    <div className={`bg-transparent border border-white/10 rounded-sm p-4 flex flex-col justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">{label}</span>
      <span className="text-sm font-medium text-white/90">{value}</span>
    </div>
  );
}
