import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Unreal Solutions",
  description: "Documentation for Unreal Engine Plugins",
  base: '/docs/',  // Docs are served at unrealsolutions.com/docs/
  
  head: [
    ['link', { rel: 'icon', href: '/assets/favicon/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/favicon/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:site_name', content: 'Unreal Solutions | Documentation' }],
    ['meta', { property: 'og:image', content: 'https://unrealsolutions.com/assets/linkedin_preview.png' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Products', items: [
        { text: 'Runtime Video Recorder', link: '/products/runtime-video-recorder/' },
        // Add more products here as they become available
      ]},
      { text: 'Download', link: '/download' },
      { text: 'Support', link: 'https://discord.com/invite/pBDSCBcdgv' }
    ],

    sidebar: {
      '/products/runtime-video-recorder/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/products/runtime-video-recorder/' },
            { text: 'Installation', link: '/products/runtime-video-recorder/installation' },
            { text: 'Quick Start', link: '/products/runtime-video-recorder/quick-start' },
            { text: 'Project Settings', link: '/products/runtime-video-recorder/project-settings' },
            { text: 'Troubleshooting', link: '/products/runtime-video-recorder/troubleshooting' }
          ]
        },
        {
          text: 'How-To Guide',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/products/runtime-video-recorder/how-to/' },
            { text: 'Hotkey Recording', link: '/products/runtime-video-recorder/how-to/hotkey-recording' },
            { text: 'Instant Replay', link: '/products/runtime-video-recorder/how-to/instant-replay' },
            { text: 'Security Camera', link: '/products/runtime-video-recorder/how-to/security-camera' },
            { text: 'Photo Mode', link: '/products/runtime-video-recorder/how-to/photo-mode' },
            { text: 'Time-Lapse', link: '/products/runtime-video-recorder/how-to/time-lapse' },
            { text: 'Multi-Camera', link: '/products/runtime-video-recorder/how-to/multi-camera' },
            { text: 'No Voice Chat', link: '/products/runtime-video-recorder/how-to/no-voice-chat' },
            { text: 'Boss Fights', link: '/products/runtime-video-recorder/how-to/boss-fights' },
            { text: 'Minimap Replay', link: '/products/runtime-video-recorder/how-to/minimap-replay' },
            { text: 'Crash Recovery', link: '/products/runtime-video-recorder/how-to/crash-recovery' }
          ]
        },
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'URuntimeVideoRecorder', link: '/products/runtime-video-recorder/api/runtime-video-recorder' },
            { text: 'Encoder Settings', link: '/products/runtime-video-recorder/api/encoder-settings' },
            { text: 'Events & Delegates', link: '/products/runtime-video-recorder/api/events' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unrealsolutionsltd' },
      { icon: 'discord', link: 'https://discord.com/invite/pBDSCBcdgv' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/unreal-solutions-company/' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2025 Unreal Solutions Ltd. Registered in England and Wales No. 14451923'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/unrealsolutionsltd/unrealsolutionsltd.github.io/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})

