/**
 * AVDPunks <3 AI - Main JavaScript
 * Handles theme toggling, filtering, search, and cookie consent
 */

(function() {
    'use strict';

    /* ==========================================================================
       Cookie Consent
       ========================================================================== */

    /**
     * Check if user has already made a cookie choice
     */
    function checkCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            showCookieBanner();
        }
    }

    /**
     * Show the cookie consent banner
     */
    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    /**
     * Hide the cookie consent banner
     */
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    /**
     * User accepts cookies
     */
    window.acceptCookies = function() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
    };

    /**
     * User declines cookies - clear localStorage except consent
     */
    window.declineCookies = function() {
        const consent = 'declined';
        localStorage.clear();
        localStorage.setItem('cookieConsent', consent);
        hideCookieBanner();
    };

    /* ==========================================================================
       Theme Management
       ========================================================================== */

    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcons(newTheme);
    }

    /**
     * Update theme toggle icons based on current theme
     * @param {string} theme - Current theme ('dark' or 'light')
     */
    function updateThemeIcons(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (!sunIcon || !moonIcon) return;
        
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    /**
     * Load saved theme from localStorage
     */
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    }

    // Expose toggleTheme globally for onclick handlers
    window.toggleTheme = toggleTheme;

    /* ==========================================================================
       Filter Functionality
       ========================================================================== */

    /**
     * Initialize filter buttons
     */
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                const filter = this.getAttribute('data-filter');
                filterCards(filter);
            });
        });
    }

    /**
     * Filter cards by category
     * @param {string} filter - Category to filter by, or 'all'
     */
    function filterCards(filter) {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /* ==========================================================================
       Search Functionality
       ========================================================================== */

    /**
     * Initialize search functionality
     */
    function initSearch() {
        const searchBox = document.getElementById('searchBox');
        
        if (!searchBox) return;
        
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            searchCards(searchTerm);
        });
    }

    /**
     * Search cards by title and description
     * @param {string} searchTerm - Term to search for
     */
    function searchCards(searchTerm) {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title');
            const description = card.querySelector('.card-description');
            
            const titleText = title ? title.textContent.toLowerCase() : '';
            const descText = description ? description.textContent.toLowerCase() : '';
            
            if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */

    /**
     * Initialize all components when DOM is ready
     */
    function init() {
        checkCookieConsent();
        loadSavedTheme();
        initFilters();
        initSearch();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
