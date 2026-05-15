# Unreal Solutions Documentation

Official documentation site for Unreal Solutions plugins, built with [VitePress](https://vitepress.dev/).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

The dev server will be available at `http://localhost:5173`

## 📁 Project Structure

```
.
├── docs/                          # Documentation source
│   ├── .vitepress/
│   │   └── config.mts            # VitePress configuration
│   ├── index.md                   # Home page
│   ├── download.md                # Download page
│   └── products/
│       └── runtime-video-recorder/
│           ├── index.md           # RVR home
│           ├── installation.md
│           ├── quick-start.md
│           └── api/               # API reference
├── assets/                        # Static assets (shared with main site)
├── index.html                     # Main marketing site
├── download.html                  # Download page
└── package.json                   # Dependencies
```

## 🔧 Configuration

VitePress configuration is in `docs/.vitepress/config.mts`:

- Site metadata
- Navigation menu
- Sidebar structure
- Theme customization

## 📝 Adding Documentation

### New Product

1. Create directory: `docs/products/your-product/`
2. Add to sidebar in `docs/.vitepress/config.mts`
3. Create `index.md` and other pages
4. Update navigation if needed

### New Page

Create a `.md` file in the appropriate directory and add it to the sidebar config.

## 🚢 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when you push to `main`.

**Workflow:** `.github/workflows/deploy.yml`

The deployment:
1. Builds VitePress docs
2. Copies existing HTML pages (index.html, download.html, etc.)
3. Copies assets folder
4. Deploys to GitHub Pages

## 🌐 Site Structure

The site combines VitePress documentation with existing HTML pages:

- `/` - Marketing homepage (index.html)
- `/docs/*` - VitePress documentation (built from `docs/`)
- `/download` - Download page (download.html)
- `/recorders` - Recorders comparison (recorders.html)
- `/assets/*` - Shared assets

## 🛠️ Technologies

- **VitePress** - Documentation framework
- **Vue 3** - Component framework
- **Vite** - Build tool
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## 📖 Writing Guide

### Markdown Features

VitePress supports:
- Standard Markdown
- GitHub Flavored Markdown (GFM)
- Custom containers (tip, warning, danger)
- Code syntax highlighting
- Mermaid diagrams
- LaTeX math

### Example

````markdown
# Page Title

## Section

Regular content with **bold** and *italic*.

### Code Example

```cpp
void MyFunction() {
    // C++ code with syntax highlighting
}
```

::: tip
This is a tip container
:::

::: warning
This is a warning
:::

::: danger
This is a danger/error message
:::
````

## 🤝 Contributing

To add or update documentation:

1. Clone the repository
2. Create a branch
3. Make your changes
4. Test locally with `npm run docs:dev`
5. Submit a pull request

## 📞 Support

- Discord: [discord.gg/wptvWkhtGm](https://discord.gg/wptvWkhtGm)
- Email: [business@unrealsolutions.com](mailto:business@unrealsolutions.com)
- Website: [unrealsolutions.com](https://unrealsolutions.com)

