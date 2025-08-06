import { useState, useEffect } from 'react';

const DEV_MODE_KEY = 'disduct-dev-mode';

export const useDevMode = () => {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DEV_MODE_KEY);
    setIsDevMode(stored === 'true');
  }, []);

  const toggleDevMode = () => {
    const newValue = !isDevMode;
    setIsDevMode(newValue);
    localStorage.setItem(DEV_MODE_KEY, newValue.toString());
  };

  return { isDevMode, toggleDevMode };
};