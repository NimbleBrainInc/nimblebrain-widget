# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: You'll need a domain (can be free with Cloudflare)
3. **Wrangler CLI**: Already installed as dev dependency

## Step 1: Authenticate with Cloudflare

```bash
# Login to Cloudflare
npm run wrangler:login

# Verify authentication
npm run wrangler:whoami
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 2: Create Cloudflare Pages Project

### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Choose **Upload assets** (for direct deployment)
5. Name your project: `nimblebrain-widget-cdn`

### Option B: Via CLI

```bash
# Create project via CLI (if preferred)
npx wrangler pages project create nimblebrain-widget-cdn
```

## Step 3: Deploy the Widget

```bash
# Build and deploy to production
npm run deploy:cloudflare

# Or deploy to staging first
npm run deploy:cf-staging
```

## Step 4: Configure Custom Domain

### In Cloudflare Dashboard:

1. Go to **Pages** → **nimblebrain-widget-cdn**
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `widget.nimblebrain.ai`
5. Follow DNS setup instructions

### Expected URLs after setup:

- **Production**: `https://widget.nimblebrain.ai/widget-latest.js`
- **Cloudflare**: `https://nimblebrain-widget-cdn.pages.dev/widget-latest.js`
- **Staging**: `https://nimblebrain-widget-staging.pages.dev/widget-latest.js`

## Step 5: Verify Deployment

⏳ **Wait 2-5 minutes** after deployment for SSL certificate provisioning.

### Test the widget load:

```bash
# Test main widget file
curl -I https://widget.nimblebrain.ai/widget-latest.js

# Test CORS headers
curl -H "Origin: https://example.com" -I https://widget.nimblebrain.ai/widget-latest.js

# Test manifest
curl https://widget.nimblebrain.ai/manifest.json
```

**Note**: If you get SSL handshake errors immediately after deployment, wait 2-5 minutes for certificate provisioning.

### Expected Response Headers:

```
HTTP/2 200
access-control-allow-origin: *
access-control-allow-methods: GET, HEAD, OPTIONS
access-control-allow-headers: Content-Type
cache-control: public, max-age=86400, immutable
content-type: application/javascript
```

## Deployment Workflow

### For new releases:

```bash
# 1. Update version
npm run version:patch  # or minor/major

# 2. Build and deploy
npm run deploy:cloudflare

# 3. Test deployment
curl https://widget.nimblebrain.ai/manifest.json
```

### Available URLs after deployment:

```bash
# Latest version (always points to newest)
https://widget.nimblebrain.ai/widget-latest.js

# Specific version (immutable)
https://widget.nimblebrain.ai/widget-v1.1.0.js

# Version redirects (convenience)
https://widget.nimblebrain.ai/latest/
https://widget.nimblebrain.ai/v1/
https://widget.nimblebrain.ai/v1.1.0/

# Manifest with version info
https://widget.nimblebrain.ai/manifest.json
```

## Configuration Files

### `_headers` (CORS and Caching)
- Enables cross-origin requests
- Sets appropriate cache headers
- Adds security headers

### `_redirects` (URL Routing)
- Version-specific URL routing
- Fallback handling
- Clean URL support

### `wrangler.toml` (Cloudflare Config)
- Project configuration
- Build settings
- Environment setup

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate
npm run wrangler:login

# Clear auth and re-login
wrangler logout
npm run wrangler:login
```

### Deployment Failures

```bash
# Check Wrangler logs
npx wrangler pages deployment list --project-name nimblebrain-widget-cdn

# View specific deployment
npx wrangler pages deployment tail
```

### CORS Issues

1. Check `_headers` file is in `dist/`
2. Verify headers in browser network tab
3. Test with curl: `curl -H "Origin: https://test.com" -I <your-url>`

### Domain Issues

1. Verify DNS settings in Cloudflare
2. Check SSL certificate status
3. Allow time for DNS propagation (up to 24 hours)

## Performance Features

### Cloudflare Pages includes:

- **Global CDN**: 200+ edge locations
- **HTTP/2 & HTTP/3**: Modern protocols
- **Brotli Compression**: Automatic compression
- **Smart Caching**: Edge caching with instant purge
- **DDoS Protection**: Built-in security
- **Analytics**: Request analytics and Core Web Vitals

### Cache Strategy:

- **JS files**: 24 hours with immutable cache
- **Source maps**: 24 hours
- **Manifest**: 5 minutes (for quick updates)
- **TypeScript definitions**: 24 hours

## Security Features

### Automatic security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- CORS enabled for widget embedding

### Rate Limiting:

Cloudflare provides automatic DDoS protection and rate limiting.

## Cost

**Cloudflare Pages Free Tier includes:**

- Unlimited requests
- 500 builds per month
- 20,000 files per deployment
- 25 MB per file
- Custom domains
- SSL certificates

Perfect for widget distribution! 🎉