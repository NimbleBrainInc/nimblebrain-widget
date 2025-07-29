# NimbleBrain Widget Integration Guide

## Quick Start

Add the NimbleBrain widget to your website with a single script tag:

```html
<!-- Cloudflare CDN (Recommended) -->
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=YOUR_AGENT_ID"></script>
```

Replace `YOUR_AGENT_ID` with your actual NimbleBrain agent ID.

## Installation Options

### Direct CDN Usage (Recommended)

The widget is distributed via Cloudflare CDN for optimal performance and global availability.

## Integration Options

### 1. Auto-Initialize (Recommended)

The simplest way to add the widget:

```html
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=YOUR_AGENT_ID&apiUrl=https://api.nimblebrain.ai"></script>
```

**Parameters:**

- `agentId` (required): Your NimbleBrain agent ID
- `apiUrl` (optional): API endpoint (defaults to production)
- `position` (optional): `bottom-right` or `bottom-left` (default: `bottom-right`)
- `primaryColor` (optional): Custom color for the widget theme

### 2. Manual Initialization

For more control over when the widget loads:

```html
<script src="https://widget.nimblebrain.ai/widget-latest.js?noAutoInit=true"></script>
<script>
  // Initialize when ready
  const widget = new window.NimbleBrainWidget({
    agentId: "YOUR_AGENT_ID",
    apiUrl: "https://api.nimblebrain.ai",
    position: "bottom-right",
    primaryColor: "#2196f3",
  });
</script>
```

### 3. Conditional Loading

Load the widget based on conditions:

```html
<script>
  // Only load for logged-in users
  if (user.isLoggedIn) {
    const script = document.createElement("script");
    script.src = "https://widget.nimblebrain.ai/widget-latest.js";
    script.src += "?agentId=YOUR_AGENT_ID";
    document.head.appendChild(script);
  }
</script>
```

## Version Management

### Using Specific Versions

For production stability, use versioned URLs:

```html
<!-- Use specific version (recommended for production) -->
<script src="https://widget.nimblebrain.ai/widget-v1.1.0.js?agentId=YOUR_AGENT_ID"></script>

<!-- Always get latest version (auto-updates) -->
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=YOUR_AGENT_ID"></script>
```

### Version Information

Check the manifest for version information:

```javascript
// Fetch version manifest
fetch("https://widget.nimblebrain.ai/manifest.json")
  .then((r) => r.json())
  .then((manifest) => console.log("Widget version:", manifest.version));
```

## Configuration Options

```javascript
const widget = new window.NimbleBrainWidget({
  // Required
  agentId: "your-agent-id-here",

  // Optional
  apiUrl: "https://api.nimblebrain.ai", // API endpoint
  position: "bottom-right", // or 'bottom-left'
  primaryColor: "#2196f3", // Custom theme color
});
```

## API Methods

### Destroy Widget

```javascript
widget.destroy(); // Removes widget from page
```

### Check Widget Status

```javascript
// Widget automatically exposes version info
console.log("Version:", window.NimbleBrainWidget.version);
```

## Styling Customization

The widget uses CSS custom properties for theming:

```css
:root {
  --nb-widget-primary-color: #2196f3;
  --nb-widget-text-color: #333;
  --nb-widget-bg-color: #ffffff;
}
```

## Error Handling

The widget handles common errors gracefully:

- **Invalid Agent ID**: Shows error message in widget
- **Network Issues**: Displays retry option
- **CORS Issues**: Provides domain configuration guidance
- **Rate Limiting**: Shows cooldown message

## Security Considerations

### Domain Restrictions

Configure allowed domains in your NimbleBrain agent settings to prevent unauthorized usage.

### Content Security Policy (CSP)

Add these directives to your CSP:

```
script-src 'self' https://widget.nimblebrain.ai;
connect-src 'self' https://api.nimblebrain.ai;
img-src 'self' data: https://widget.nimblebrain.ai;
```

## Browser Support

- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## Performance

### Widget Specs

- **Size**: ~224KB minified (~157KB gzipped)
- **Load Time**: <500ms on fast connections
- **First Paint**: <200ms after script load

### Cloudflare CDN Benefits

- **Global Network**: 200+ edge locations worldwide
- **Cache Hit Rate**: >95% for widget files
- **HTTP/3 & Brotli**: Modern protocols and compression
- **Edge Caching**: 24-hour immutable cache for versioned files
- **Instant Purge**: Updates propagate globally in <30 seconds

## Troubleshooting

### Widget Not Loading

1. Check console for errors
2. Verify agent ID is correct
3. Ensure domain is authorized
4. Check network connectivity

### CORS Errors

Add your domain to allowed origins in NimbleBrain dashboard:

1. Go to Agent Settings
2. Add your domain to "Allowed Origins"
3. Save settings

### Authentication Issues

Verify your agent is properly configured and accessible.

## Examples

### E-commerce Site

```html
<!-- Only show for product pages -->
<script>
  if (window.location.pathname.includes("/product/")) {
    const script = document.createElement("script");
    script.src =
      "https://widget.nimblebrain.ai/widget-latest.js?agentId=ecommerce-agent-id";
    document.head.appendChild(script);
  }
</script>
```

### Support Portal

```html
<!-- Custom styling for support theme -->
<style>
  :root {
    --nb-widget-primary-color: #28a745;
  }
</style>
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=support-agent-id&position=bottom-left"></script>
```

### SaaS Application

```html
<!-- Load after user authentication -->
<script>
  document.addEventListener("userAuthenticated", function (event) {
    new window.NimbleBrainWidget({
      agentId: "saas-agent-id",
      apiUrl: "https://api.nimblebrain.ai",
      position: "bottom-right",
    });
  });
</script>
<script src="https://widget.nimblebrain.ai/widget-latest.js?noAutoInit=true"></script>
```
