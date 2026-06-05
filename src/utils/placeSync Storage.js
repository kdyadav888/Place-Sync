/**
 * LocalStorage Manager for PlaceSync
 * Centralizes all localStorage operations and ensures consistency
 * 
 * This file acts as a single source of truth for all localStorage keys
 * and provides utility functions for data management
 */

class PlaceSyncStorage {
  /**
   * All storage keys used in the application
   * Format: { key: 'description' }
   */
  static KEYS = {
    // Demo data overrides
    jobStatusOverrides: 'Status overrides for jobs (active/inactive)',
    appStatusOverrides: 'Status overrides for applications',
    
    // Local data (user created)
    localJobs: 'Jobs created locally before API sync',
    localApplications: 'Applications created locally before API sync',
    localConnections: 'Connections created locally before API sync',
    
    // UI state
    lastViewedJobId: 'Last job ID viewed by user',
    lastViewedApplicantId: 'Last applicant ID viewed by user',
    filterPreferences: 'User filter preferences per page',
    
    // Session data
    sessionToken: 'Authentication token (if stored)',
    userProfile: 'Cached user profile data',
    
    // Timestamps
    lastDataSync: 'Last time data was synced from API',
    lastRefresh: 'Last time page was refreshed',
  };

  /**
   * Get all stored data (for debugging)
   */
  static getAllData() {
    const data = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('placesync_')) {
        const cleanKey = key.replace('placesync_', '').replace('_ts', '');
        try {
          data[cleanKey] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[cleanKey] = localStorage.getItem(key);
        }
      }
    });
    return data;
  }

  /**
   * Get storage usage (for monitoring)
   */
  static getStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return {
      bytes: totalSize,
      kilobytes: (totalSize / 1024).toFixed(2),
      items: localStorage.length,
    };
  }

  /**
   * Clear all PlaceSync data from localStorage
   * @param {string|null} exceptKey - Key to keep (optional)
   */
  static clearAll(exceptKey = null) {
    const keysToRemove = [];
    for (let key in localStorage) {
      if (key.startsWith('placesync_') && key !== `placesync_${exceptKey}`) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length;
  }

  /**
   * Verify data consistency
   * @returns {object} Consistency report
   */
  static verifyConsistency() {
    const report = {
      isValid: true,
      warnings: [],
      errors: [],
    };

    // Check for orphaned data
    const jobOverrides = this.get('jobStatusOverrides', {});
    const jobOverrideKeys = Object.keys(jobOverrides);
    
    if (jobOverrideKeys.length > 20) {
      report.warnings.push(`High number of job overrides (${jobOverrideKeys.length}), consider cleanup`);
    }

    // Check for large data sizes
    const usage = this.getStorageUsage();
    if (usage.kilobytes > 1000) {
      report.warnings.push(`Large localStorage usage (${usage.kilobytes}KB), consider archiving old data`);
    }

    // Validate JSON integrity
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('placesync_')) {
          JSON.parse(localStorage.getItem(key));
        }
      });
    } catch (error) {
      report.isValid = false;
      report.errors.push(`JSON parse error: ${error.message}`);
    }

    return report;
  }

  /**
   * Get value from localStorage
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`placesync_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Set value in localStorage
   */
  static set(key, value) {
    try {
      localStorage.setItem(`placesync_${key}`, JSON.stringify(value));
      localStorage.setItem(`placesync_${key}_ts`, new Date().toISOString());
      return true;
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove value from localStorage
   */
  static remove(key) {
    try {
      localStorage.removeItem(`placesync_${key}`);
      localStorage.removeItem(`placesync_${key}_ts`);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Get timestamp of last update
   */
  static getTimestamp(key) {
    return localStorage.getItem(`placesync_${key}_ts`);
  }

  /**
   * Check if value exists
   */
  static has(key) {
    return localStorage.getItem(`placesync_${key}`) !== null;
  }
}

export default PlaceSyncStorage;
