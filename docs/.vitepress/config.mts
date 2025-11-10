import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Unreal Solutions",
  description: "Documentation for Unreal Engine Plugins",
  base: '/',
  
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
      { text: 'Support', link: 'https://discord.gg/Ujw7QVrWxG' }
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
            { text: 'How-To Guide', link: '/products/runtime-video-recorder/how-to' },
            { text: 'Project Settings', link: '/products/runtime-video-recorder/project-settings' }
          ]
        },
        {
          text: 'Core Features',
          collapsed: false,
          items: [
            { text: 'Viewport Recording', link: '/products/runtime-video-recorder/viewport-recording' },
            { text: 'Camera Recording', link: '/products/runtime-video-recorder/camera-recording' },
            { text: 'Render Target Recording', link: '/products/runtime-video-recorder/render-target-recording' },
            { text: 'Audio Recording', link: '/products/runtime-video-recorder/audio-recording' },
            { text: 'Multi-Camera Recording', link: '/products/runtime-video-recorder/multi-camera-recording' }
          ]
        },
        {
          text: 'Advanced Features',
          collapsed: false,
          items: [
            { text: 'Frame-Rate Independent Recording', link: '/products/runtime-video-recorder/frame-rate-independent' },
            { text: 'Circular Buffer', link: '/products/runtime-video-recorder/circular-buffer' },
            { text: 'Manual Frame Capture', link: '/products/runtime-video-recorder/manual-frame-capture' },
            { text: 'Deferred Encoding', link: '/products/runtime-video-recorder/deferred-encoding' },
            { text: 'Camera Preview', link: '/products/runtime-video-recorder/camera-preview' }
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
        },
        {
          text: 'Platform Guides',
          collapsed: false,
          items: [
            { text: 'Windows', link: '/products/runtime-video-recorder/platforms/windows' },
            { text: 'macOS', link: '/products/runtime-video-recorder/platforms/macos' },
            { text: 'Linux', link: '/products/runtime-video-recorder/platforms/linux' },
            { text: 'Android', link: '/products/runtime-video-recorder/platforms/android' },
            { text: 'Oculus/Meta Quest', link: '/products/runtime-video-recorder/platforms/oculus' }
          ]
        },
        {
          text: 'Resources',
          collapsed: false,
          items: [
            { text: 'Troubleshooting', link: '/products/runtime-video-recorder/troubleshooting' },
            { text: 'Best Practices', link: '/products/runtime-video-recorder/best-practices' },
            { text: 'Performance', link: '/products/runtime-video-recorder/performance' },
            { text: 'FAQ', link: '/products/runtime-video-recorder/faq' },
            { text: 'Changelog', link: '/products/runtime-video-recorder/changelog' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unrealsolutionsltd' },
      { icon: 'discord', link: 'https://discord.gg/Ujw7QVrWxG' },
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

