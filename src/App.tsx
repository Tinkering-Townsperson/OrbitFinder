import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/Button";
import { Design } from "./pages/Design";
import { Match } from "./pages/Match";

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 0.5, 
      opacity: Math.random() * 0.6 + 0.2, 
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <Stars />
      <div className="max-w-10xl space-y-8 z-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter text-[#8f6589] bg-clip-text">
            OrbitFinder
          </h1>
          <p className="text-8xl text-[#f5b1eb] font-fraunces font-bold">
            It starts with a <span className="italic">swipe</span>. 
          </p>
          <div className="flex justify-center gap-6 pt-6">
            <Link to="/design">
              <Button variant="primary">Design Your Planet &rarr;</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<Design />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
