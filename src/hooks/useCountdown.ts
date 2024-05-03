import { useEffect, useState, useRef, useCallback } from "react";

import { useLocalStorage } from "./useLocalStorage";

// TODO remove semicolon
export const useCountdown = (interval = 1000) => {
  const { getLocalStorageValue } = useLocalStorage();
  const [time, setTime] = useState(() => getLocalStorageValue("time") || 15000);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [countdown, setCountdown] = useState(time);

  const startCountdown = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          return prev - interval;
        }
        if (prev === 0) clearInterval(intervalRef.current!);

        return prev;
      });
    }, interval);
  }, [time]);

  const resetCountdown = useCallback(() => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setCountdown(time);
  }, [time]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, [interval]);

  return { time, setTime, countdown, startCountdown, resetCountdown };
};
