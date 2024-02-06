import { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: null | number, generalDelay = 5000, leading = true) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    function tick() {
      const current = savedCallback.current;
      if (current) {
        current();
        // Hier wird die allgemeine Verzögerung (general delay) von 500 Millisekunden berücksichtigt
        timeoutId = setTimeout(tick, generalDelay);
      }
    }

    if (delay !== null) {
      if (leading) tick();
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
        timeoutId && clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [delay, generalDelay, leading]);
}
