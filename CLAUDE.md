# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern website for SPS ENG, a Korean farm implement manufacturer (frontloader.co.kr). The project has been completely redesigned with modern web technologies while preserving the original content and images.

## Architecture

This is a **modern Node.js web application** with the following stack:

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks for simplicity)
- **Backend**: Node.js with Express.js
- **Build Tools**: PostCSS, UglifyJS for optimization
- **Development**: Live Server, Nodemon for hot reloading
- **Legacy Assets**: Original images preserved in `frontloader.co.kr_files/` directory

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server (with nodemon auto-restart)
npm run dev

# Live development server (with hot reload)
npm run serve

# Watch CSS changes and serve
npm run watch

# Build for production
npm run build

# Start production server
npm start
```

## Key Files

- `index.html` - Modern HTML5 structure with semantic elements
- `styles.css` - Modern CSS with Grid, Flexbox, and responsive design
- `script.js` - Vanilla JavaScript with modern features
- `server.js` - Express.js server with security and compression
- `package.json` - Node.js project configuration
- `postcss.config.js` - PostCSS configuration for CSS processing
- `frontloader.co.kr_files/` - Original images and assets (preserved)

## Development Workflow

1. **Development**: Use `npm run dev` for backend development or `npm run serve` for frontend-only development
2. **CSS Changes**: Use `npm run watch` to automatically process CSS changes
3. **Production Build**: Run `npm run build` to create optimized assets
4. **Deployment**: Use `npm start` for production server

## Content Structure

- **Hero Section**: Company introduction with statistics
- **Products Section**: Front Loader, Backhoe Loader, Tractor Mounted Crane
- **About Section**: Company values and information
- **Contact Section**: Contact form and company details
- **Footer**: Links and company information

## Modern Features

- Responsive design (mobile-first)
- CSS Grid and Flexbox layouts
- Intersection Observer for animations
- Modern JavaScript (ES6+)
- Performance optimizations
- Security headers with Helmet.js
- Compression middleware