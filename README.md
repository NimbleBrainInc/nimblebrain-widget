# NimbleBrain Widget

A lightweight, embeddable chatbot widget that enables conversations with NimbleBrain AI agents on any website.

## Features

- 🚀 **Easy Integration**: Single script tag setup
- 💬 **Real-time Chat**: Instant messaging with AI agents
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Customizable**: Configurable positioning and styling
- 🔒 **Secure**: Uses bearer token authentication
- 📦 **Lightweight**: Minified build ~224KB (includes all dependencies)

## Quick Start

Add this script tag to your HTML page:

```html
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=YOUR_AGENT_ID"></script>
```

Replace `YOUR_AGENT_ID` with your actual NimbleBrain agent UUID.

## Configuration Options

You can customize the widget by adding URL parameters:

```html
<script src="https://widget.nimblebrain.ai/widget-latest.js?agentId=YOUR_AGENT_ID&position=bottom-left&apiUrl=https://api.nimblebrain.ai"></script>
```

### Available Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agentId` | string | **required** | UUID of the NimbleBrain agent |
| `apiUrl` | string | `https://api.nimblebrain.ai` | Base URL for the NimbleBrain API |
| `position` | string | `bottom-right` | Widget position (`bottom-right` or `bottom-left`) |
| `primaryColor` | string | - | Custom primary color (future feature) |

## Development

### Prerequisites

- Node.js 24+
- npm

### Setup

```bash
# If using nvm (recommended), use the project's Node version
nvm use  # Uses version from .nvmrc file

# Install dependencies
npm install

# Build for production
npm run build

# Build for development (with watching)
npm run dev

# Serve test page locally
npm run serve
```

### Project Structure

```
nimblebrain-widget/
├── src/
│   ├── widget.ts       # Main widget implementation
│   ├── api.ts          # NimbleBrain API client
│   └── widget.css      # Widget styles
├── dist/
│   └── widget.js       # Built distribution file
├── index.html          # Test page for development
└── README.md
```

### Building

The build process uses Webpack to bundle TypeScript, CSS, and create a single distributable JavaScript file:

```bash
npm run build
```

This generates `dist/widget.js` which contains:
- Compiled TypeScript code
- Inlined CSS styles
- All dependencies bundled
- Minified for production

### Testing

1. Build the widget: `npm run build`
2. Update `index.html` with a valid agent ID
3. Serve the test page: `npm run serve`
4. Open http://localhost:8080 in your browser

## API Integration

The widget uses the NimbleBrain `/v1/` API endpoints:

- `POST /v1/session` - Create authentication session
- `GET /v1/agents/:agentId` - Get agent information
- `POST /v1/agents/:agentId/conversations` - Create new conversation
- `POST /v1/agents/:agentId/conversations/:conversationId/messages` - Send messages

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Styling

The widget uses CSS custom properties and can be styled by overriding CSS classes in your page:

```css
/* Custom widget button color */
.nb-widget-button {
    background: linear-gradient(135deg, #your-color 0%, #your-color-dark 100%) !important;
}

/* Custom chat window size */
.nb-widget-chat {
    width: 400px !important;
    height: 600px !important;
}
```

## Error Handling

The widget includes comprehensive error handling:

- Network connectivity issues
- API authentication failures
- Invalid agent IDs
- Server errors

Errors are displayed in the chat interface and logged to the browser console.

## Security

- Uses secure HTTPS connections
- Bearer token authentication
- Origin-based session validation
- No sensitive data stored locally

## License

MIT License - see LICENSE file for details.