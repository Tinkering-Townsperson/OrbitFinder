import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function SamplePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tighter text-[#8f6589] mb-4">
        Sample Next Page
      </h1>
      <p className="text-xl text-[#f5b1eb] max-w-md mb-8">
        This is a sample page connected via React Router!
      </p>
      <Link to="/">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </div>
  );
}
