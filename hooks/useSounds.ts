import { useCallback } from 'react';
import { useAppContext } from './useAppContext.js';
import { sounds, SoundType } from '../assets/sounds.js';
import { playSound } from '../lib/soundPlayer.js';

/**
 * A hook for playing theme-aware sound effects.
 * It checks if sounds are enabled in the context before playing.
 * @returns A `play` function that accepts a `SoundType`.
 */
export const useSounds = () => {
  const { state } = useAppContext();
  const { soundEnabled, theme } = state;

  const play = useCallback((soundType: SoundType) => {
    if (!soundEnabled) return;

    // Fallback logic: if a sound doesn't exist for the current theme, use the 'stealth' theme as a default.
    const soundSrc = sounds[theme]?.[soundType] || sounds.stealth[soundType];
    
    if (soundSrc) {
        playSound(soundSrc);
    }
  }, [soundEnabled, theme]);

  return play;
};