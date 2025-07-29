const fs = require('fs');
const path = require('path');

// Read package.json to get version
const packageJson = require('../package.json');
const version = packageJson.version;

const distPath = path.join(__dirname, '../dist');

// Create versioned copies for CDN
const files = [
  { src: 'widget.js', dest: `widget-v${version}.js` },
  { src: 'widget.js', dest: 'widget-latest.js' }
];

files.forEach(file => {
  const srcPath = path.join(distPath, file.src);
  const destPath = path.join(distPath, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Created ${file.dest}`);
  }
});

// Create a version manifest
const manifest = {
  version: version,
  files: {
    latest: 'widget-latest.js',
    versioned: `widget-v${version}.js`,
    original: 'widget.js'
  },
  buildDate: new Date().toISOString(),
  integrity: {}
};

// Calculate file sizes
files.forEach(file => {
  const filePath = path.join(distPath, file.dest);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    manifest.integrity[file.dest] = {
      size: stats.size,
      sizeFormatted: formatBytes(stats.size)
    };
  }
});

// Write manifest
fs.writeFileSync(
  path.join(distPath, 'manifest.json'), 
  JSON.stringify(manifest, null, 2)
);

console.log(`✅ Created manifest.json with version ${version}`);

// Copy Cloudflare configuration files
const publicPath = path.join(__dirname, '../public');
if (fs.existsSync(publicPath)) {
  const publicFiles = fs.readdirSync(publicPath);
  publicFiles.forEach(file => {
    const srcPath = path.join(publicPath, file);
    const destPath = path.join(distPath, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file} to dist/`);
  });
} else {
  console.log('⚠️ No public/ directory found, skipping Cloudflare config files');
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}