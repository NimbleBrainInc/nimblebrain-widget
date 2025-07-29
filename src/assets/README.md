# Assets Directory

Place your widget images and logos here:

- `logo.png` - Main widget logo
- `icons/` - Icon files (SVG recommended)
- `avatars/` - Agent avatar images

## Usage in Code

Import images in TypeScript:
```typescript
import logoUrl from './assets/logo.png';
import iconUrl from './assets/icons/chat.svg';
```

Then use in HTML:
```typescript
const img = `<img src="${logoUrl}" alt="Logo" />`;
```

## Supported Formats
- PNG, JPG, JPEG, GIF, SVG, ICO
- Images are inlined as base64 in the widget bundle