import { useState, useEffect } from 'react';

// Easing function for a smooth animation
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      const easedT = easeOutExpo(t);
      
      const currentCount = Math.floor(easedT * end);
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};
