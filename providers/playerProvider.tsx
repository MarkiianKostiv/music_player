import React, { createContext, useContext } from 'react';
import { useCustomPlayer } from 'hooks/useCustomPlayer';

const PlayerContext = createContext<ReturnType<typeof useCustomPlayer> | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const player = useCustomPlayer();
  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
