/**
 * useLocalStorageSync Hook
 * Handles persistent data storage and retrieval across page refreshes
 * Ensures demo data and real data stay synchronized
 * 
 * Usage:
 * const [data, setData, clearData] = useLocalStorageSync('key', defaultValue)
 */

import { useState, useEffect, useCallback } from 'react';

const useLocalStorageSync = (key, initialValue) => {
  // Storage keys for tracking
  const STORAGE_KEY = `placesync_${key}`;
  const TIMESTAMP_KEY = `placesync_${key}_ts`;

  // Initialize state
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check localStorage first
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Handle function updates (like setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update state
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valueToStore));

      // Track when this was last updated
      window.localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());

      // Dispatch custom event for cross-tab synchronization
      window.dispatchEvent(
        new CustomEvent('placesync-update', {
          detail: { key, value: valueToStore, timestamp: new Date().toISOString() }
        })
      );
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }, [storedValue, key, STORAGE_KEY, TIMESTAMP_KEY]);

  // Clear localStorage
  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TIMESTAMP_KEY);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error clearing localStorage (${key}):`, error);
    }
  }, [key, initialValue, STORAGE_KEY, TIMESTAMP_KEY]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error syncing from other tab (${key}):`, error);
        }
      }
    };

    // Listen for custom placesync events
    const handlePlacesyncUpdate = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('placesync-update', handlePlacesyncUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('placesync-update', handlePlacesyncUpdate);
    };
  }, [key, STORAGE_KEY]);

  return [storedValue, setValue, clearValue];
};

export default useLocalStorageSync;
