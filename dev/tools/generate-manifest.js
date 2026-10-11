#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dsRoot = path.resolve(__dirname, '..');
const versionFile = path.join(dsRoot, 'VERSION');
const version = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf8').trim() : 'dev';

const publicFiles = [
  'index.html',
  'assets/css/business-pro.bundle.css',
  'assets/css/business-pro.css',
  'assets/css/business-pro-brands.css',
  'assets/css/tokens.css',
  'assets/css/foundation.css',
  'assets/css/components.css',
  'assets/css/documents.css',
  'assets/css/advanced.css',
  'assets/css/gallery.css',
  'assets/js/theme.js',
  'assets/js/business-pro.js',
  'assets/js/gallery.js',
  'assets/brand/logo-lightmode.svg',
  'assets/brand/logo-darkmode.svg',
  'assets/brand/logo-lightmode-mobile.svg',
  'assets/brand/logo-darkmode-mobile.svg',
  'assets/vendor/fontawesome/css/fontawesome.min.css',
  'assets/vendor/fontawesome/css/solid.min.css',
  'assets/vendor/fontawesome/css/brands.min.css',
  'assets/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  'assets/vendor/fontawesome/webfonts/fa-brands-400.woff2',
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function fileEntry(relativePath) {
  const absolutePath = path.join(dsRoot, relativePath);
  const data = fs.readFileSync(absolutePath);
  return {
    path: relativePath,
    bytes: data.length,
    sha256: sha256(data),
  };
}

const generatedAt = new Date().toISOString();
const files = publicFiles.map(fileEntry);

const manifest = {
  name: 'Business PRO Design System',
  environment: 'dev',
  version,
  generatedAt,
  entrypoints: {
    css: `assets/css/business-pro.bundle.css?v=${version}`,
    cssModules: `assets/css/business-pro.css?v=${version}`,
    js: `assets/js/business-pro.js?v=${version}`,
    theme: `assets/js/theme.js?v=${version}`,
  },
  files,
};

const health = {
  ok: true,
  name: manifest.name,
  environment: manifest.environment,
  version,
  generatedAt,
  fileCount: files.length,
  entrypoints: manifest.entrypoints,
};

fs.writeFileSync(path.join(dsRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(dsRoot, 'health.json'), `${JSON.stringify(health, null, 2)}\n`);

console.log(`Generated manifest.json and health.json for DS ${version}.`);
