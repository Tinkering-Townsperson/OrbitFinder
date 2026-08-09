import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlanetCanvas } from '../components/PlanetCanvas';
import { planets } from '../data/planets-all';
import { getPerspectives, type Planet } from '../planet';

export function Match() {
  const location = useLocation();
  const userPlanet = location.state?.userPlanet as Planet | undefined;

  const [currentMatch, setCurrentMatch] = useState<Planet | null>(null);
  const [perspectives, setPerspectives] = useState<{ userPerspective: number, matchPerspective: number } | null>(null);
  const [matchResult, setMatchResult] = useState<'matched' | 'rejected' | null>(null);

  const pickRandomPlanet = () => {
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    setCurrentMatch(randomPlanet);
    
    if (userPlanet) {
      const p = getPerspectives(userPlanet, randomPlanet);
      setPerspectives(p);
      console.log(`[Perspective] How much ${userPlanet.name} likes ${randomPlanet.name}:`, Math.round(p.userPerspective * 100) + '%');
      console.log(`[Perspective] How much ${randomPlanet.name} likes ${userPlanet.name}:`, Math.round(p.matchPerspective * 100) + '%');
    }
  };

  useEffect(() => {
    pickRandomPlanet();
  }, []);

  const handleNext = () => {
    pickRandomPlanet();
  };

  const handleMatchAttempt = () => {
    if (!perspectives) return;
    // Calculate the probability of the other planet matching you
    const prob = Math.pow(perspectives.matchPerspective, 3);
    if (Math.random() < prob) {
      setMatchResult('matched');
    } else {
      setMatchResult('rejected');
    }
  };

  const closeResultAndNext = () => {
    setMatchResult(null);
    pickRandomPlanet();
  };

  if (!currentMatch) return null;

  const planet = currentMatch;

  const formatAge = (age: number) => {
    if (age < 1000) return `${age} Million Yrs`;
    return `${(age / 1000).toFixed(1)} Billion Yrs`;
  };

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
        <div className="flex-grow p-10 flex flex-col gap-10 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h2 className="text-4xl font-bold font-fraunces text-white">
                {planet.name} 
              </h2>
            </div>
            <div className="text-xl font-normal text-white/70 tracking-wide mt-1 flex items-baseline gap-3">
              <span>{formatAge(planet.age)}</span>
              {userPlanet && <span className="text-sm text-white/50">vs {formatAge(userPlanet.age)}</span>}
            </div>
            <p className="text-[#f5b1eb] font-semibold tracking-wider text-sm uppercase mt-1 flex items-baseline gap-3">
              <span>{planet.type} • {(0.6 + planet.size * 1.6).toFixed(1)}x</span>
              {userPlanet && <span className="text-xs text-[#f5b1eb]/70">vs {(0.6 + userPlanet.size * 1.6).toFixed(1)}x</span>}
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#f5b1eb] font-bold border border-[#f5b1eb]/40 px-2 py-0.5 rounded-sm bg-[#f5b1eb]/10">
                  Favors: {planet.favoured?.join(', ')}
                </span>
              </div>
              {userPlanet && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold border border-white/20 px-2 py-0.5 rounded-sm bg-white/10">
                    You Favor: {userPlanet.favoured?.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 items-center mt-2">
            <div className="w-8 h-8 rounded-sm border border-white/20 shadow-inner" style={{ backgroundColor: planet.colour }} />
            {userPlanet && (
              <>
                <span className="text-white/20 text-xs font-bold uppercase tracking-widest mx-1">vs</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-sm border border-white/10 shadow-inner opacity-50" title="Your Color" style={{ backgroundColor: userPlanet.colour }} />
                  <span className="text-[10px] text-white/30 tracking-widest uppercase">You</span>
                </div>
              </>
            )}
          </div>

          {/* Traits Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <TraitBadge 
              label="Terrain" 
              value={`${Math.round(planet.terrain * 100)}%`} 
              userValue={userPlanet ? `${Math.round(userPlanet.terrain * 100)}%` : undefined} 
            />
            <TraitBadge 
              label="Water" 
              value={`${Math.round(planet.water * 100)}%`} 
              userValue={userPlanet ? `${Math.round(userPlanet.water * 100)}%` : undefined} 
            />
            <TraitBadge 
              label="Moons" 
              value={`${planet.moons} Orbiting`} 
              userValue={userPlanet ? `${userPlanet.moons}` : undefined} 
            />
            <TraitBadge 
              label="Craters" 
              value={planet.type === 'terrestrial' ? `${Math.round(planet.craters * 100)}` : '0'} 
              userValue={userPlanet ? (userPlanet.type === 'terrestrial' ? `${Math.round(userPlanet.craters * 100)}` : '0') : undefined} 
            />
          </div>

          {/* Perspective Scores */}
          {/* {userPlanet && perspectives && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-md p-4">
              <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3 text-center">Compatibility Analysis</h3>
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] text-white/40 uppercase font-semibold mb-1 text-center leading-tight">How much you<br/>like them</span>
                  <span className="text-xl font-mono text-[#f5b1eb] font-bold">{Math.round(perspectives.userPerspective * 100)}%</span>
                </div>
                <div className="w-[1px] h-10 bg-white/10"></div>
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] text-white/40 uppercase font-semibold mb-1 text-center leading-tight">How much they<br/>like you</span>
                  <span className="text-xl font-mono text-[#cf7cc2] font-bold">{Math.round(perspectives.matchPerspective * 100)}%</span>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Action Buttons */}
        <div className="p-10 flex justify-center gap-10 bg-[#16191e]">
          <button 
            onClick={handleNext}
            className="flex-1 py-5 rounded-md bg-transparent border border-white/20 flex items-center justify-center text-[#ff6b6b] "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <button 
            onClick={handleMatchAttempt}
            className="flex-1 py-5 rounded-md bg-transparent border border-[#f5b1eb]/50 flex items-center justify-center text-[#f5b1eb]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>

      {/* Right Panel: 3D Viewer */}
      <div className="flex-grow relative h-full">
        <PlanetCanvas config={planet} />
      </div>

      {/* Match Result Modal */}
      {matchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-[#16191e] border border-white/10 rounded-md p-10 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
            {matchResult === 'matched' ? (
              <>
                <div className="w-24 h-24 rounded-md bg-[#f5b1eb] flex items-center justify-center text-[#16191e] shadow-[0_0_40px_rgba(245,177,235,0.4)] mb-8 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
                <h2 className="text-4xl font-bold font-fraunces text-[#f5b1eb] mb-3">IT'S A MATCH!</h2>
                <p className="text-white/90 text-lg mb-8"><strong>{userPlanet?.name || 'You'}</strong> and <strong>{planet.name}</strong> liked each other!</p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-md bg-white/5 border border-white/20 flex items-center justify-center text-white/50 mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <h2 className="text-3xl font-bold font-fraunces text-white/90 mb-3">MISSED CONNECTION</h2>
                <p className="text-white/70 text-lg mb-8"><strong>{planet.name}</strong> wasn't feeling the spark.</p>
              </>
            )}
            <button 
              onClick={closeResultAndNext}
              className="px-10 py-4 bg-white/20 hover:bg-white/30 text-white rounded-md font-bold uppercase tracking-widest transition-colors w-full"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for traits
function TraitBadge({ label, value, userValue, className = '' }: { label: string, value: string, userValue?: string, className?: string }) {
  return (
    <div className={`bg-transparent border border-white/20 rounded-md p-4 flex flex-col justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1">{label}</span>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">{value}</span>
        {userValue && <span className="text-[10px] text-white/60 font-medium">You: {userValue}</span>}
      </div>
    </div>
  );
}
