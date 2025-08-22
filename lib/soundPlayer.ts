const audioCache: { [src: string]: HTMLAudioElement } = {};

/**
 * Plays a sound from a given source string (e.g., base64 data URI).
 * Caches the Audio object for performance.
 * @param src The source of the audio to play.
 */
export const playSound = (src: string) => {
  if (typeof window === 'undefined' || !src) return;

  try {
    let audio = audioCache[src];
    if (!audio) {
      audio = new Audio(src);
      audioCache[src] = audio;
    }

    audio.volume = 0.3; // Lower volume for UI sounds
    audio.currentTime = 0;
    
    // play() returns a promise which can be rejected if autoplay is not allowed.
    // We catch it to prevent unhandled promise rejection errors.
    audio.play().catch(e => {});
  } catch (e) {
    console.error("Error playing sound:", e);
  }
};
