/**
 * Shared Navigation Component
 * Include this script and add <div id="site-nav"></div> where you want the nav to appear.
 * 
 * Usage:
 *   <div id="site-nav" data-logo-path="./assets/logo.png"></div>
 *   <script src="/assets/js/nav.js"></script>
 */

(function() {
  'use strict';

  const NAV_ITEMS = [
    { href: '/products/bugit/', label: 'BugIt', emoji: '🐛', isHighlight: true },
    { href: '/products/', label: 'Products' },
    { href: '/licensing.html', label: 'Licensing' },
    { href: '/docs/', label: 'Docs' },
    { href: '/insights/', label: 'Insights' }
  ];

  function createNav(logoPath) {
    const currentPath = window.location.pathname;
    
    // Determine if we're on a specific page to highlight it
    const isActive = (href) => {
      if (href === '/') return currentPath === '/' || currentPath === '/index.html';
      return currentPath.startsWith(href.replace('.html', '').replace(/\/$/, ''));
    };

    const navLinks = NAV_ITEMS.map(item => {
      const active = isActive(item.href);
      
      if (item.isHighlight) {
        // BugIt special styling
        return `
          <a href="${item.href}" class="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium flex items-center gap-1">
            <span>${item.emoji}</span> ${item.label}
          </a>`;
      } else {
        // Regular nav items
        const colorClass = active ? 'text-white' : 'text-gray-400 hover:text-white';
        return `
          <a href="${item.href}" class="${colorClass} transition-colors text-sm font-medium">${item.label}</a>`;
      }
    }).join('');

    return `
      <div class="flex items-center justify-between sm:px-6 sm:py-3">
        <!-- Logo -->
        <a href="/">
          <img 
            src="${logoPath}" 
            alt="Unreal Solutions Logo" 
            title="Unreal Solutions Logo"
            class="h-12 sm:h-14 w-auto drop-shadow-[0_0_0.3rem_#ffffff70] cursor-pointer hover:opacity-80 transition-opacity"
          >
        </a>
        <!-- Navigation Links -->
        <nav class="hidden sm:flex items-center gap-6">
          ${navLinks}
        </nav>
        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="sm:hidden text-gray-400 hover:text-white p-2" aria-label="Open menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      <!-- Mobile Menu (hidden by default) -->
      <div id="mobile-menu" class="hidden sm:hidden bg-gray-900/95 border-t border-gray-800">
        <div class="px-4 py-4 space-y-3">
          ${NAV_ITEMS.map(item => {
            if (item.isHighlight) {
              return `<a href="${item.href}" class="block text-yellow-400 hover:text-yellow-300 text-sm font-medium">${item.emoji} ${item.label}</a>`;
            }
            return `<a href="${item.href}" class="block text-gray-400 hover:text-white text-sm font-medium">${item.label}</a>`;
          }).join('')}
        </div>
      </div>`;
  }

  function initNav() {
    const navContainer = document.getElementById('site-nav');
    if (!navContainer) {
      console.warn('Navigation container #site-nav not found');
      return;
    }

    // Get logo path from data attribute or use default
    const logoPath = navContainer.dataset.logoPath || '/assets/logo.png';
    
    // Apply container styling
    navContainer.className = 'mb-4 sm:mb-0 sm:fixed sm:top-0 sm:left-0 sm:right-0 z-50 sm:bg-gray-900/80 sm:backdrop-blur-md sm:border-b sm:border-gray-800';
    
    // Insert navigation HTML
    navContainer.innerHTML = createNav(logoPath);

    // Setup mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

      // ==========================================
      // FOOTER LINKS (uses same NAV_ITEMS)
      // ==========================================
      function createFooterLinks() {
        return NAV_ITEMS.map(item => {
          if (item.isHighlight) {
            return `
              <a href="${item.href}" class="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
                <span class="mr-1.5">${item.emoji}</span>
                ${item.label}
              </a>`;
          }
          return `
            <a href="${item.href}" class="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
              ${item.label}
            </a>`;
        }).join('');
      }

      function initFooterNav() {
        const footerNav = document.getElementById('footer-nav');
        if (!footerNav) return;
        
        footerNav.innerHTML = createFooterLinks();
      }

      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initNav();
          initFooterNav();
        });
      } else {
        initNav();
        initFooterNav();
      }
    })();
