import { useEffect, useRef } from 'react';

/**
 * Custom hook for tracking the previous value of a state or prop.
 * @param value The value to track.
 * @returns The value from the previous render.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  // Store current value in ref after the render is committed to the DOM
  useEffect(() => {
    ref.current = value;
  }, [value]); // Re-run effect only if value changes

  // Return previous value (happens before the update in useEffect)
  return ref.current;
}