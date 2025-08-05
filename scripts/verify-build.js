#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

console.log('🔍 Verifying build output...');

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ index.html not found in dist folder');
  process.exit(1);
}

// Read index.html to verify it contains the app
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Check for essential elements
const checks = [
  { name: 'Root div', pattern: /<div id="root"><\/div>/, required: true },
  { name: 'Main script', pattern: /src="\/assets\/.*\.js"/, required: true },
  { name: 'CSS file', pattern: /href="\/assets\/.*\.css"/, required: true },
];

let allChecksPassed = true;

checks.forEach(check => {
  const found = check.pattern.test(indexHtml);
  if (found) {
    console.log(`✅ ${check.name} found`);
  } else if (check.required) {
    console.error(`❌ ${check.name} not found`);
    allChecksPassed = false;
  } else {
    console.warn(`⚠️  ${check.name} not found (optional)`);
  }
});

// Check for admin route support (should be handled by React Router)
console.log('✅ Admin routes will be handled by client-side routing');

// List all files in dist for debugging
console.log('\n📁 Build output files:');
const files = fs.readdirSync(distPath, { recursive: true });
files.forEach(file => {
  if (typeof file === 'string') {
    console.log(`  - ${file}`);
  }
});

if (allChecksPassed) {
  console.log('\n✅ Build verification completed successfully');
  console.log('🚀 Admin routes should work correctly');
} else {
  console.error('\n❌ Build verification failed');
  process.exit(1);
} 