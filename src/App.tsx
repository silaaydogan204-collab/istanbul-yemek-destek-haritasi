import { useState } from 'react';
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';

type View = 'landing' | 'map';

export default function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <div className="h-full">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('map')} />
      ) : (
        <MapPage onBack={() => setView('landing')} />
      )}
    </div>
  );
}
