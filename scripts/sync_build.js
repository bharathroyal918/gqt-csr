const fs = require('fs');
const path = require('path');

const srcNext = path.join(__dirname, '..', 'frontend', '.next');
const destNext = path.join(__dirname, '..', '.next');
const srcPublic = path.join(__dirname, '..', 'frontend', 'public');
const destPublic = path.join(__dirname, '..', 'public');

if (fs.existsSync(srcNext)) {
  console.log(`[sync_build] Copying ${srcNext} to ${destNext}...`);
  fs.cpSync(srcNext, destNext, { recursive: true });
}

if (fs.existsSync(srcPublic)) {
  console.log(`[sync_build] Copying ${srcPublic} to ${destPublic}...`);
  fs.cpSync(srcPublic, destPublic, { recursive: true });
}

console.log('[sync_build] Build sync completed successfully.');
