const fs = require('fs');
const path = require('path');

// Read package.json to get version
const packageJson = require('../package.json');
const version = packageJson.version;

// Read the built widget.js file
const distPath = path.join(__dirname, '../dist/widget.js');
let content = fs.readFileSync(distPath, 'utf8');

// Inject version information at the top of the file
const versionComment = `/*! NimbleBrain Widget v${version} | https://www.nimblebrain.ai */\n`;
content = versionComment + content;

// Add version to window object
const versionInjection = `
// Version information
if (typeof window !== 'undefined') {
  window.NimbleBrainWidget.version = '${version}';
  console.log('NimbleBrain Widget v${version} loaded');
}
`;

// Insert version injection before the last closing brackets
content = content.replace(/(\}\)\(\);?\s*)$/, versionInjection + '\n$1');

// Write back to file
fs.writeFileSync(distPath, content);

console.log(`✅ Version ${version} injected into widget.js`);