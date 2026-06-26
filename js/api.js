/**
 * CatAPI Class - Handles communication with API Ninjas Cat API
 * Implements fetching, caching, and error handling
 */

class CatAPI {
  constructor() {
    this.apiKey = API_CONFIG.key;
    this.baseUrl = API_CONFIG.baseUrl || 'https://api.api-ninjas.com/v1/cats';
    this.cache = new Map();
    this.storagePrefix = 'cat-api-';
    this.loadFromLocalStorage();
  }

  /**
   * Load cached data from localStorage into memory cache
   */
  loadFromLocalStorage() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          const cacheKey = key.substring(this.storagePrefix.length);
          const data = localStorage.getItem(key);
          if (data) {
            try {
              this.cache.set(cacheKey, JSON.parse(data));
              console.log(`Loaded cached data from localStorage for ${cacheKey}`);
            } catch (e) {
              console.warn(`Failed to parse cached data for ${cacheKey}`, e);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
  }

  /**
   * Save data to localStorage
   * @param {string} cacheKey - The cache key
   * @param {any} data - Data to cache
   */
  saveToLocalStorage(cacheKey, data) {
    try {
      const storageKey = this.storagePrefix + cacheKey;
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log(`Saved data to localStorage for ${cacheKey}`);
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  }

  /**
   * Fetch cats from API with pagination
   * @param {number} offset - Offset for pagination (default: 0)
   * @returns {Promise<Array>} - Array of cat objects
   */
  async fetchCats(offset = 0) {
    const cacheKey = `cats-${offset}`;
    
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      console.log(`Returning cached data for ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    try {
      const url = new URL(this.baseUrl);
      // API Ninjas requires at least one parameter besides offset
      // Using min_weight=1 to include all cats
      url.searchParams.append('min_weight', '1');
      url.searchParams.append('offset', offset);
      
      const response = await fetch(url.toString(), {
        headers: {
          'X-Api-Key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API request failed: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Cache the response in memory and localStorage
      this.cache.set(cacheKey, data);
      this.saveToLocalStorage(cacheKey, data);
      console.log(`Fetched ${data.length} cats from API (offset: ${offset})`);
      
      return data;
    } catch (error) {
      console.error('Error fetching cats:', error);
      // Re-throw with more context
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to the API server. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Fetch all cats from API (be mindful of rate limits)
   * @returns {Promise<Array>} - All cat objects
   */
  async fetchAllCats() {
    const allCats = [];
    let offset = 0;
    const apiPageSize = 20; // API Ninjas returns max 20 results per request
    
    try {
      while (true) {
        const cats = await this.fetchCats(offset);
        if (cats.length === 0) break;
        allCats.push(...cats);
        offset += apiPageSize;
        
        // Safety check to prevent infinite loops
        if (offset > 1000) {
          console.warn('Reached maximum offset, stopping fetch');
          break;
        }
      }
      
      console.log(`Fetched all ${allCats.length} cats from API`);
      return allCats;
    } catch (error) {
      console.error('Error fetching all cats:', error);
      throw error;
    }
  }

  /**
   * Search cats by query (client-side filtering)
   * @param {Array} cats - Array of cat objects to search through
   * @param {string} query - Search query
   * @returns {Array} - Filtered array of cats
   */
  searchCats(cats, query) {
    if (!query || query.trim() === '') {
      return cats;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return cats.filter(cat => {
      const nameMatch = cat.name && cat.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = cat.description && cat.description.toLowerCase().includes(searchTerm);
      const originMatch = cat.origin && cat.origin.toLowerCase().includes(searchTerm);
      const lengthMatch = cat.length && cat.length.toLowerCase().includes(searchTerm);
      
      return nameMatch || descriptionMatch || originMatch || lengthMatch;
    });
  }

  /**
   * Clear the cache from both memory and localStorage
   */
  clearCache() {
    this.cache.clear();
    
    // Clear from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('API cache cleared from memory and localStorage');
    } catch (error) {
      console.warn('Error clearing localStorage cache:', error);
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CatAPI;
}
