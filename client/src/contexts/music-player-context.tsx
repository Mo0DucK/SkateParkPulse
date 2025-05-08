import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type MusicPlayerContextType = {
  isPlayerEnabled: boolean;
  togglePlayerEnabled: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlayerEnabled, setIsPlayerEnabled] = useState(false);

  // Load preference from localStorage on initial render
  useEffect(() => {
    const savedPreference = localStorage.getItem('musicPlayerEnabled');
    if (savedPreference !== null) {
      setIsPlayerEnabled(savedPreference === 'true');
    }
  }, []);

  const togglePlayerEnabled = () => {
    setIsPlayerEnabled(prev => !prev);
    // Save preference to localStorage
    localStorage.setItem('musicPlayerEnabled', (!isPlayerEnabled).toString());
  };

  return (
    <MusicPlayerContext.Provider value={{ isPlayerEnabled, togglePlayerEnabled }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}