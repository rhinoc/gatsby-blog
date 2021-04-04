import { useState, useEffect, useCallback } from 'react';

const getDarkMode = () => typeof window === 'object' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(getDarkMode);

  const handleChange = useCallback(() => {
    setDarkMode(getDarkMode());
  }, []);

  useEffect(() => {
    if (!typeof window === 'object') return false;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    try {
      // Handle Chrome & Firefox
      darkModeQuery.addEventListener('change', handleChange);
    } catch (addEventListenerError) {
      try {
        // Handle Safari
        darkModeQuery.addListener('change', handleChange);
      } catch (addListenerError) {
        console.error(addListenerError);
      }
    }
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChange);
  }, [handleChange]);

  return darkMode;
};

export default useDarkMode;
