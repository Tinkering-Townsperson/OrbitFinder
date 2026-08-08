import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/Button";
import { SamplePage } from "./pages/SamplePage";

function Stars() {
  // Generate 100 random stars only once when the component mounts
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 0.5, // Between 0.5px and 2.5px
      opacity: Math.random() * 0.6 + 0.2, // Between 0.2 and 0.8
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
            <Link to="/next">
              <Button variant="primary">Go to Sample Page</Button>
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
        <Route path="/next" element={<SamplePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
