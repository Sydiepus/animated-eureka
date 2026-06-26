# CatInfo - Responsive Cat Information Website

## Student Information
**Name:** Sydie

## API Used
**API Ninjas Cat API**
- **Endpoint:** `https://api.api-ninjas.com/v1/cats`
- **Authentication:** API key required (X-Api-Key header)
- **Documentation:** https://api-ninjas.com/api/cats

## Project Description

CatInfo is a responsive website that displays information about various cat breeds fetched from the API Ninjas Cat API. The site features a card grid layout with interactive hover effects, client-side search functionality, and pagination. Additionally, the site includes personal content about why cats make great pets, my personal experiences with cats, and fun cat facts.

### Features Implemented

#### Core Features
- **Responsive Card Grid:** 3-column layout on desktop, 2-column on tablet, 1-column on mobile
- **Hover Effects:** Cards lift with shadow and reveal overlay information on hover
- **API Integration:** Fetches cat data from API Ninjas
- **Client-Side Search:** Filter cats by name or breed
- **Pagination:** Navigate through pages of cat data (12 cats per page)

#### User Experience
- **Loading States:** Spinner animation while fetching data
- **Error Handling:** User-friendly error messages if API fails
- **Empty States:** Clear messaging when no results match search criteria

#### Content Pages
1. **Home:** Cat card grid with search and pagination
2. **About:** Personal content about cats (15+ real items)
3. **Gallery:** Extended collection of cat images

### Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup for structure |
| CSS3 | Hand-written styles with Flexbox and Grid |
| Bootstrap 5 | Responsive layout components |
| JavaScript ES6 | Classes, Fetch API, DOM manipulation |
| API Ninjas | Cat data API |
| Vercel/Netlify | Free hosting deployment |

## Custom UI Requirement

**Requirement:** Design a responsive card grid layout with hover effects

### Implementation Details

The custom requirement was implemented using a combination of CSS Grid, Bootstrap 5, and custom CSS animations:

```css
/* Grid Layout */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Hover Effects */
.cat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.cat-image-container:hover .hover-overlay {
  opacity: 1;
}
```

**Bootstrap Integration:** Used Bootstrap's card component as a base, then extended with custom hover animations and responsive grid behavior.

**Responsive Behavior:**
- **Desktop (≥992px):** 3 columns
- **Tablet (768-991px):** 2 columns
- **Mobile (<768px):** 1 column

## AI-Use Appendix

### Tools Used
- **Mistral Vibe:** Used for project planning, code review, and technical guidance throughout the development process.

### Prompts Used

1. **"Help me create a plan for my cat website project with API Ninjas integration and responsive card grid"**
   - Used to create the comprehensive project plan and development phases

2. **"How do I implement hover effects on a card grid using CSS and Bootstrap"**
   - Used to understand best practices for combining Bootstrap cards with custom CSS animations

3. **"Best practices for fetching from API Ninjas with error handling in ES6 JavaScript"**
   - Used to implement robust API fetching with proper error states

### What AI Got Wrong & How I Fixed It

1. **Issue:** AI initially suggested using jQuery for DOM manipulation
   - **Problem:** Project requirements explicitly state "All JavaScript must be written using ES6 classes" and "Avoid jQuery or older JS syntax"
   - **Fix:** Rewrote all JavaScript using ES6 classes with Fetch API, async/await, and vanilla DOM manipulation

2. **Issue:** AI's first grid layout suggestion used fixed widths that broke on mobile
   - **Problem:** The layout didn't properly adapt to smaller screens
   - **Fix:** Implemented responsive grid using CSS Grid with `auto-fill` and `minmax()`, combined with Bootstrap responsive classes for robust mobile behavior

3. **Issue:** AI forgot to include error handling in the initial API fetch examples
   - **Problem:** Without try/catch blocks, API failures would crash the page
   - **Fix:** Added comprehensive error handling with user-friendly messages and loading state management

## Screenshots

### Desktop View (1920x1080)
![Desktop Screenshot](screenshots/desktop.png)

### Tablet View (iPad - 768px)
![Tablet Screenshot](screenshots/tablet.png)

### Mobile View (iPhone SE - 375px)
![Mobile Screenshot](screenshots/mobile.png)

## Project Structure

```
project/
├── index.html          # Home page with cat grid
├── about.html          # About cats / personal content
├── gallery.html        # Extended cat images/gallery
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── config.js       # API configuration (gitignored)
│   ├── main.js         # ES6 classes for functionality
│   └── api.js          # API fetching logic
├── images/             # Personal cat images
├── README.md           # This file
├── PLAN.md             # Development plan
└── screenshots/        # Responsiveness evidence
```

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Get an API Key:**
   - Register at https://api-ninjas.com/ to get a free API key
   - Create `js/config.js` with your key (this file is in .gitignore):
     ```javascript
     const API_CONFIG = {
       key: 'your-api-ninjas-key-here',
       baseUrl: 'https://api.api-ninjas.com/v1/cats'
     };
     ```

3. **Open in browser:**
   - Simply open `index.html` in a web browser
   - Or deploy to Vercel/Netlify for live hosting

## Deployment

**Live URL:** (To be added after deployment)

**GitHub Repository:** (To be added after deployment)

### Deployment Instructions

#### Option 1: Vercel
1. Push code to GitHub
2. Go to https://vercel.com/ and import your repository
3. Add environment variable for API key (optional)
4. Deploy

#### Option 2: Netlify
1. Push code to GitHub
2. Go to https://app.netlify.com/ and connect your repository
3. Deploy

#### Option 3: GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select `main` branch
3. Your site will be live at `https://<username>.github.io/<repo-name>/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (Chrome, Safari)

## License

This project is for educational purposes only.

---

*Created for SEM 8 Full Stack Project*
*Last updated: June 24, 2026*
