import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanetCanvas } from '../components/PlanetCanvas';
import { Button } from '../components/Button';
import { fetchFirstPage, fetchNextPage } from '../download';
import type { Planet } from '../planet';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export function Explore() {
  const navigate = useNavigate();
  
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const { planets: newPlanets, lastDoc: newLastDoc } = await fetchFirstPage();
      setPlanets(newPlanets);
      setLastDoc(newLastDoc || null);
      if (newPlanets.length > 0) {
        setSelectedPlanet(newPlanets[0]);
      }
    } catch (err) {
      console.error("Error fetching planets:", err);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const { planets: morePlanets, lastDoc: newLastDoc } = await fetchNextPage(lastDoc);
      setPlanets(prev => [...prev, ...morePlanets]);
      setLastDoc(newLastDoc || null);
    } catch (err) {
      console.error("Error fetching more planets:", err);
    }
    setLoadingMore(false);
  };

  const formatAge = (age: number) => {
    if (age < 1000) return `${age} Million Yrs`;
    return `${(age / 1000).toFixed(1)} Billion Yrs`;
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f12] text-white font-sans select-none">
      
      {/* 3D WebGL Planet Scene (Background) */}
      {selectedPlanet ? (
        <PlanetCanvas config={selectedPlanet} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xl font-fraunces">
          Select a planet from the list to view it
        </div>
      )}

      {/* Left Floating Panel: List of Planets */}
      <aside className="absolute top-6 left-6 sm:left-8 w-80 sm:w-96 bg-[#16191e]/85 backdrop-blur-2xl border border-white/10 rounded-md flex flex-col z-20 shadow-2xl shadow-black/60 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-center border-b border-white/10 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#8f6589] bg-clip-text font-fraunces drop-shadow-md">
              OrbitFinder
            </h1>
            <p className="text-white/50 text-sm mt-1">Explore Community Planets</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors border border-white/20 rounded-md px-3 py-1.5 hover:bg-white/5"
          >
            Back
          </button>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-grow p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-white/50">
              Loading universe...
            </div>
          ) : planets.length === 0 ? (
            <div className="flex justify-center items-center h-full text-white/50">
              No planets found.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {planets.map((p, idx) => (
                  <div 
                    key={p.name + idx}
                    onClick={() => setSelectedPlanet(p)}
                    className={`cursor-pointer rounded-md p-3 border flex items-center gap-4 transition-all ${selectedPlanet === p ? 'border-[#f5b1eb] bg-[#f5b1eb]/10 shadow-[0_0_15px_rgba(245,177,235,0.15)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xs shrink-0 shadow-inner border border-white/20"
                      style={{ backgroundColor: p.colour }}
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-white truncate text-sm">{p.name || 'Unnamed Planet'}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-white/50 mt-1 uppercase tracking-widest font-mono">
                        <span>{p.type}</span>
                        <span className="text-white/20">•</span>
                        <span>{(0.6 + p.size * 1.6).toFixed(1)}x</span>
                        <span className="text-white/20">•</span>
                        <span>{formatAge(p.age)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {lastDoc && (
                <Button 
                  variant="secondary" 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="w-full text-sm py-3 mt-4"
                >
                  {loadingMore ? 'Scanning...' : 'Load More Planets'}
                </Button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Floating Right Stats Box */}
      {selectedPlanet && (
        <div className="absolute bottom-8 right-8 bg-[#16191e]/85 backdrop-blur-2xl border border-white/10 p-6 rounded-md shadow-2xl z-20 w-72">
          <h2 className="text-2xl font-bold font-fraunces text-white mb-1">{selectedPlanet.name || 'Unnamed Planet'}</h2>
          <p className="text-[#f5b1eb] text-sm font-bold uppercase tracking-widest mb-4">{selectedPlanet.type}</p>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Age</span>
              <span className="font-mono text-white/90">{formatAge(selectedPlanet.age)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Size</span>
              <span className="font-mono text-white/90">{(0.6 + selectedPlanet.size * 1.6).toFixed(1)}x</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Terrain</span>
              <span className="font-mono text-white/90">{Math.round(selectedPlanet.terrain * 100)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Water</span>
              <span className="font-mono text-white/90">{Math.round(selectedPlanet.water * 100)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Moons</span>
              <span className="font-mono text-white/90">{selectedPlanet.moons}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
