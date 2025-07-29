# NimbleBrain Widget Deployment Guide

## Overview

This document outlines the deployment strategy for the NimbleBrain widget, including versioning, build process, and CDN distribution.

## Build Process

### Development Build
```bash
npm run dev          # Watch mode for development
npm run build        # Standard production build
```

### CDN-Ready Build
```bash
npm run build:cdn    # Build with version injection
npm run deploy:prepare  # Build + create CDN files
```

### File Structure

After `npm run deploy:prepare`, the `dist/` directory contains:

```
dist/
├── widget.js              # Main widget file
├── widget.js.map          # Source map
├── widget-latest.js       # Latest version alias
├── widget-v1.1.0.js      # Versioned file
├── manifest.json          # Version manifest
├── widget.d.ts           # TypeScript definitions
└── api.d.ts              # API type definitions
```

## Versioning Strategy

### Semantic Versioning

The widget follows [semantic versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Version Commands

```bash
npm run version:patch    # 1.1.0 → 1.1.1
npm run version:minor    # 1.1.0 → 1.2.0
npm run version:major    # 1.1.0 → 2.0.0
```

### Version Injection

The build process automatically:
1. Reads version from `package.json`
2. Injects version comment at top of JS file
3. Adds version to `window.NimbleBrainWidget.version`
4. Creates versioned filename copies

## Deployment Options

### 1. Cloudflare Pages (Current Setup)

Deploy to Cloudflare Pages for global edge distribution:

```bash
# Deploy to production
npm run deploy:cloudflare

# Deploy to staging
npm run deploy:cf-staging

# Login to Cloudflare (if needed)
npm run wrangler:login
```

### 2. Alternative CDN Setup

For other CDN providers:

```bash
# Build files
npm run deploy:prepare

# Upload dist/ contents to your CDN
# Ensure CORS headers are configured
```

## CDN Configuration

### Required Headers

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: public, max-age=86400
```

### File-Specific Caching

```
*.js files: Cache-Control: public, max-age=86400, immutable
*.map files: Cache-Control: public, max-age=86400
manifest.json: Cache-Control: public, max-age=300
```

## DNS Configuration

### Recommended Setup

```
widget.nimblebrain.ai → CDN endpoint
```

### Alternative Subdomains

```
cdn.nimblebrain.ai/widget/ → CDN path
assets.nimblebrain.ai/widget/ → CDN path
```

## Security Configuration

### CORS Policy

The widget requires CORS to be enabled for cross-origin requests:

```nginx
# Nginx configuration
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
add_header Access-Control-Allow-Headers "Content-Type" always;
```

### Content Security Policy

Customers need these CSP directives:

```
script-src 'self' https://widget.nimblebrain.ai;
connect-src 'self' https://api.nimblebrain.ai;
img-src 'self' data: https://widget.nimblebrain.ai;
```

## Monitoring & Analytics

### Performance Metrics

Track these metrics:

- **Load Time**: Time to first byte
- **Parse Time**: JS execution time
- **Error Rate**: Failed initializations
- **Usage**: Widget interactions

### Logging

Widget logs important events:

```javascript
// Console logs for debugging
console.log('NimbleBrain Widget v1.1.0 loaded');
console.log('Widget initialized successfully');
console.error('Widget initialization failed:', error);
```

## Release Process

### 1. Development

```bash
# Feature development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
```

### 2. Version Bump

```bash
# Choose appropriate version bump
npm run version:patch  # or minor/major
git add package.json
git commit -m "Bump version to 1.1.1"
```

### 3. Build & Test

```bash
# Build CDN version
npm run deploy:prepare

# Test locally
npm run serve
# Visit http://localhost:8080/index.html
```

### 4. Deploy

```bash
# Deploy to production
npm run deploy:cloudflare

# Or deploy to staging first
npm run deploy:cf-staging
```

### 5. Tag Release

```bash
git tag v1.1.1
git push origin v1.1.1
git push origin main
```

## Rollback Strategy

### Quick Rollback

If issues occur, customers can:

```html
<!-- Rollback to previous version -->
<script src="https://widget.nimblebrain.ai/widget-v1.0.0.js?agentId=..."></script>
```

### CDN Rollback

Update CDN to serve previous version:

```bash
# Copy previous version to latest
cp dist/widget-v1.0.0.js dist/widget-latest.js

# Redeploy
npm run deploy:cloudflare
```

## Environment-Specific Configurations

### Development

```javascript
// Local development
const widget = new NimbleBrainWidget({
  agentId: 'test-agent-id',
  apiUrl: 'http://localhost:3001'
});
```

### Staging

```javascript
// Staging environment
const widget = new NimbleBrainWidget({
  agentId: 'staging-agent-id',
  apiUrl: 'https://staging-api.nimblebrain.ai'
});
```

### Production

```javascript
// Production environment
const widget = new NimbleBrainWidget({
  agentId: 'prod-agent-id',
  apiUrl: 'https://api.nimblebrain.ai'
});
```

## Troubleshooting Deployment

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build:cdn
```

### CDN Issues

1. Check CORS headers
2. Verify file permissions
3. Test with curl:

```bash
curl -I https://widget.nimblebrain.ai/widget-latest.js
```

### Version Conflicts

```bash
# Force version update
npm run version:patch
npm run deploy:prepare
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/
```

### Compression

Ensure CDN serves compressed files:

```bash
# Check compression
curl -H "Accept-Encoding: gzip" -I https://widget.nimblebrain.ai/widget-latest.js
```

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs
- **Monthly**: Review performance metrics
- **Quarterly**: Update dependencies

### Health Checks

```bash
# Verify widget loads
curl -f https://widget.nimblebrain.ai/widget-latest.js

# Check manifest
curl https://widget.nimblebrain.ai/manifest.json
```