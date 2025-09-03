import React, { createContext, useState, useEffect } from 'react';
import { FaMoon, FaSun, FaPalette, FaCog } from 'react-icons/fa';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, showSettings, toggleSettings }}>
      <div className="relative">
        {children}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-background/95 dark:bg-background-dark/95 p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Theme Settings</h3>
                <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaCog className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background/5 dark:hover:bg-background-dark/5 transition-colors"
                  >
                    <span className="text-gray-600 dark:text-gray-300">
                      {theme === 'light' ? <FaSun /> : <FaMoon />}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-600 dark:text-gray-300">Background Color</h4>
                    <div className="mt-2">
                      <div className="h-8 bg-background dark:bg-background-dark rounded-lg p-2 flex items-center space-x-2">
                        <div className="w-4 h-4 bg-primary rounded-full" />
                        <div className="w-4 h-4 bg-secondary rounded-full" />
                        <div className="w-4 h-4 bg-accent rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
};
