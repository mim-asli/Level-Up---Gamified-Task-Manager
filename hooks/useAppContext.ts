import { useContext } from 'react';
import { AppContext } from '../context/AppContext.js';
import { AppContextType } from '../types.js';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};