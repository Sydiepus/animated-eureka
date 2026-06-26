/**
 * Main Application JavaScript
 * Implements CatGrid and UIManager classes for cat data display
 */

/**
 * UIManager - Handles UI state management (loading, error, empty states)
 */
class UIManager {
  static showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'flex';
    }
  }

  static hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  static showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  static hideError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  static showEmpty(message) {
    const emptyElement = document.getElementById('empty-message');
    if (emptyElement) {
      emptyElement.textContent = message;
      emptyElement.style.display = 'block';
    }
  }

  static hideEmpty() {
    const emptyElement = document.getElementById('empty-message');
    if (emptyElement) {
      emptyElement.style.display = 'none';
    }
  }

  static updatePaginationInfo(totalCats, currentPage, catsPerPage) {
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
      const start = ((currentPage - 1) * catsPerPage) + 1;
      const end = Math.min(currentPage * catsPerPage, totalCats);
      paginationInfo.textContent = `Showing ${start}-${end} of ${totalCats} cats`;
    }
  }
}

/**
 * CatGrid - Main application class for managing cat data display
 */
class CatGrid {
  constructor(api) {
    this.api = api;
    this.state = {
      cats: [],
      filteredCats: [],
      currentPage: 1,
      searchQuery: '',
      isLoading: false,
      error: null
    };
    
    this.cardsPerPage = 20;  // API Ninjas returns max 20 results per request
    
    // DOM Elements
    this.gridElement = document.getElementById('cat-grid');
    this.searchInput = document.getElementById('search-input');
    this.paginationElement = document.getElementById('pagination');
    this.searchForm = document.getElementById('search-form');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadCats();
  }

  setupEventListeners() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
    
    // Search form submit (for better mobile support)
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.searchInput) {
          this.handleSearch(this.searchInput.value);
        }
      });
    }
  }

  async loadCats() {
    UIManager.showLoading();
    UIManager.hideError();
    UIManager.hideEmpty();
    this.setState({ isLoading: true, error: null });
    
    try {
      // Fetch first page of cats
      const cats = await this.api.fetchCats(0);
      this.setState({
        cats,
        filteredCats: cats,
        isLoading: false,
        currentPage: 1
      });
      this.render();
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error.message
      });
      UIManager.hideLoading();
      UIManager.showError(error.message);
    }
  }

  async loadMore(page) {
    UIManager.showLoading();
    UIManager.hideError();
    this.setState({ isLoading: true, error: null, currentPage: page });
    
    try {
      const offset = (page - 1) * this.cardsPerPage;
      const cats = await this.api.fetchCats(offset);
      
      // If we're loading a different page, replace the data
      this.setState({
        cats,
        filteredCats: cats,
        isLoading: false,
        currentPage: page
      });
      this.render();
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error.message
      });
      UIManager.hideLoading();
      UIManager.showError(error.message);
    }
  }

  handleSearch(query) {
    this.setState({
      searchQuery: query,
      currentPage: 1
    });
    
    // Filter cats based on search query
    const filtered = this.api.searchCats(this.state.cats, query);
    
    this.setState({ filteredCats: filtered });
    this.render();
  }

  render() {
    const { filteredCats, currentPage, isLoading, error } = this.state;
    
    // Hide all state messages first
    UIManager.hideLoading();
    UIManager.hideError();
    UIManager.hideEmpty();
    
    if (isLoading) {
      UIManager.showLoading();
      return;
    }
    
    if (error) {
      UIManager.showError(error);
      return;
    }
    
    if (filteredCats.length === 0) {
      const message = this.state.searchQuery 
        ? 'No cats found matching your search.' 
        : 'No cats available.';
      UIManager.showEmpty(message);
      return;
    }
    
    // Render cards and pagination
    this.renderCards();
    this.renderPagination();
    
    // Update pagination info
    UIManager.updatePaginationInfo(
      filteredCats.length, 
      currentPage, 
      this.cardsPerPage
    );
  }

  renderCards() {
    const { filteredCats, currentPage } = this.state;
    const startIndex = (currentPage - 1) * this.cardsPerPage;
    const paginatedCats = filteredCats.slice(
      startIndex,
      startIndex + this.cardsPerPage
    );
    
    if (!this.gridElement) {
      console.error('Cat grid element not found');
      return;
    }
    
    this.gridElement.innerHTML = paginatedCats
      .map(cat => this.createCatCard(cat))
      .join('');
  }

  createCatCard(cat) {
    const name = cat.name || 'Unknown';
    const origin = cat.origin || 'Unknown';
    const imageUrl = cat.image_link || cat.image || `https://placekitten.com/400/300?text=${encodeURIComponent(name)}`;
    
    // Build description from available fields
    let description = '';
    if (cat.description) {
      description = cat.description.substring(0, 150);
      if (cat.description.length > 150) description += '...';
    } else {
      // Create description from other fields
      const parts = [];
      if (cat.length) parts.push(cat.length);
      if (cat.min_weight && cat.max_weight) parts.push(`${cat.min_weight}-${cat.max_weight} lbs`);
      if (cat.min_life_expectancy && cat.max_life_expectancy) parts.push(`${cat.min_life_expectancy}-${cat.max_life_expectancy} years lifespan`);
      description = parts.join(' • ') || 'No description available.';
    }
    
    return `
      <div class="col-md-4 col-sm-6 mb-4">
        <article class="cat-card card h-100">
          <div class="cat-image-container position-relative">
            <img src="${imageUrl}" 
                 class="card-img-top" 
                 alt="${name}"
                 loading="lazy">
            <div class="hover-overlay position-absolute">
              <h3>${name}</h3>
              <p>Origin: ${origin}</p>
            </div>
          </div>
          <div class="card-body">
            <h4 class="card-title">${name}</h4>
            <p class="card-text">${description}</p>
            ${this.renderCatMeta(cat)}
          </div>
        </article>
      </div>
    `;
  }

  renderCatMeta(cat) {
    const metaParts = [];
    
    if (cat.origin) {
      metaParts.push(`<span class="badge bg-primary">Origin: ${cat.origin}</span>`);
    }
    
    // Display life expectancy range
    if (cat.min_life_expectancy && cat.max_life_expectancy) {
      metaParts.push(`<span class="badge bg-success">Lifespan: ${cat.min_life_expectancy}-${cat.max_life_expectancy} yrs</span>`);
    } else if (cat.life_span) {
      metaParts.push(`<span class="badge bg-success">Lifespan: ${cat.life_span} yrs</span>`);
    }
    
    // Display weight range
    if (cat.min_weight && cat.max_weight) {
      metaParts.push(`<span class="badge bg-info text-dark">Weight: ${cat.min_weight}-${cat.max_weight} lbs</span>`);
    }
    
    // Display key ratings
    if (cat.family_friendly !== undefined) {
      metaParts.push(`<span class="badge bg-warning text-dark">Family: ${cat.family_friendly}/5</span>`);
    }
    
    if (cat.intelligence !== undefined) {
      metaParts.push(`<span class="badge bg-secondary">Intel: ${cat.intelligence}/5</span>`);
    }
    
    if (cat.playfulness !== undefined) {
      metaParts.push(`<span class="badge bg-primary">Playful: ${cat.playfulness}/5</span>`);
    }
    
    if (metaParts.length === 0) {
      return '';
    }
    
    return `
      <div class="card-meta">
        ${metaParts.join('\n        ')}
      </div>
    `;
  }

  renderPagination() {
    const { filteredCats, currentPage } = this.state;
    const totalPages = Math.ceil(filteredCats.length / this.cardsPerPage);
    
    if (!this.paginationElement) {
      console.error('Pagination element not found');
      return;
    }
    
    if (totalPages <= 1) {
      this.paginationElement.innerHTML = '';
      return;
    }
    
    let html = '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';
    
    // Previous button
    if (currentPage > 1) {
      html += `
        <li class="page-item">
          <button class="page-link" data-page="${currentPage - 1}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
      `;
    } else {
      html += `
        <li class="page-item disabled">
          <span class="page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </span>
        </li>
      `;
    }
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page and ellipsis
    if (startPage > 1) {
      html += `
        <li class="page-item ${1 === currentPage ? 'active' : ''}">
          <button class="page-link" data-page="1">1</button>
        </li>
      `;
      if (startPage > 2) {
        html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      html += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <button class="page-link" data-page="${i}">${i}</button>
        </li>
      `;
    }
    
    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      html += `
        <li class="page-item ${totalPages === currentPage ? 'active' : ''}">
          <button class="page-link" data-page="${totalPages}">${totalPages}</button>
        </li>
      `;
    }
    
    // Next button
    if (currentPage < totalPages) {
      html += `
        <li class="page-item">
          <button class="page-link" data-page="${currentPage + 1}" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      `;
    } else {
      html += `
        <li class="page-item disabled">
          <span class="page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </span>
        </li>
      `;
    }
    
    html += '</ul></nav>';
    this.paginationElement.innerHTML = html;
    
    // Add event listeners to pagination buttons
    this.paginationElement.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.target.closest('[data-page]').dataset.page);
        this.loadMore(page);
      });
    });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for config to load (it's loaded via script tag before this)
  if (typeof API_CONFIG !== 'undefined') {
    const api = new CatAPI();
    const catGrid = new CatGrid(api);
    console.log('CatGrid application initialized');
  } else {
    console.error('API_CONFIG not found. Make sure config.js is loaded before main.js');
  }
});
