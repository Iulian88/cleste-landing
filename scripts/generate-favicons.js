// scripts/generate-favicons.js
// Run: node scripts/generate-favicons.js [v1|v2]
// Generates favicon.ico, apple-icon.png, icon.png, and public PNG copies
// from public/favicon-v1.svg or public/favicon-v2.svg

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const variant = process.argv[2] || 'v1';
const svgPath = path.join(__dirname, '..', 'public', `favicon-${variant}.svg`);

if (!fs.existsSync(svgPath)) {
  console.error(`SVG not found: ${svgPath}`);
  process.exit(1);
}

const APP_DIR = path.join(__dirname, '..', 'app');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(svgPath);
  console.log(`Using variant: ${variant} (${svgPath})`);

  // Generate all PNG sizes
  const [png16, png32, png180, png512] = await Promise.all([
    sharp(svgBuffer).resize(16, 16).png().toBuffer(),
    sharp(svgBuffer).resize(32, 32).png().toBuffer(),
    sharp(svgBuffer).resize(180, 180).png().toBuffer(),
    sharp(svgBuffer).resize(512, 512).png().toBuffer(),
  ]);

  // Save PNGs to public/ (for manual linking and inspection)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-512.png'), png512);
  console.log('  PNG files written to public/');

  // Save app/apple-icon.png  (Next.js App Router auto-detection: 180x180)
  fs.writeFileSync(path.join(APP_DIR, 'apple-icon.png'), png180);
  console.log('  app/apple-icon.png written (180x180)');

  // Save app/icon.png (Next.js App Router auto-detection: 32x32)
  fs.writeFileSync(path.join(APP_DIR, 'icon.png'), png32);
  console.log('  app/icon.png written (32x32)');

  // Build multi-resolution ICO with 16x16 and 32x32 PNG images embedded
  const icoBuffer = buildIco([
    { size: 16, buf: png16 },
    { size: 32, buf: png32 },
  ]);
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), icoBuffer);
  console.log('  app/favicon.ico written (16+32px multi-res)');

  console.log('\nDone! All favicon files generated.');
}

/**
 * Build a valid ICO file embedding PNG data for each size.
 * Modern browsers (IE9+, Chrome, Firefox, Safari) support PNG-in-ICO.
 *
 * ICO format:
 *   Header: 6 bytes
 *   Directory entries: 16 bytes × count
 *   Image data: concatenated PNG buffers
 */
function buildIco(images) {
  const count = images.length;
  const headerBytes = 6;
  const entryBytes = 16;
  const dirBytes = headerBytes + entryBytes * count;

  // Calculate absolute offsets for each PNG blob
  const offsets = [];
  let offset = dirBytes;
  for (const img of images) {
    offsets.push(offset);
    offset += img.buf.length;
  }

  const ico = Buffer.alloc(offset);

  // ICONDIR header
  ico.writeUInt16LE(0, 0);      // reserved
  ico.writeUInt16LE(1, 2);      // type: 1 = ICO
  ico.writeUInt16LE(count, 4);  // number of images

  // ICONDIRENTRY for each image
  for (let i = 0; i < images.length; i++) {
    const base = headerBytes + i * entryBytes;
    const { size, buf } = images[i];
    ico[base + 0] = size === 256 ? 0 : size; // bWidth
    ico[base + 1] = size === 256 ? 0 : size; // bHeight
    ico[base + 2] = 0;                        // bColorCount (0 = no palette)
    ico[base + 3] = 0;                        // bReserved
    ico.writeUInt16LE(1, base + 4);           // wPlanes
    ico.writeUInt16LE(32, base + 6);          // wBitCount (32 bpp RGBA)
    ico.writeUInt32LE(buf.length, base + 8);  // dwBytesInRes
    ico.writeUInt32LE(offsets[i], base + 12); // dwImageOffset
  }

  // Write PNG data after the directory
  let dataPos = dirBytes;
  for (const img of images) {
    img.buf.copy(ico, dataPos);
    dataPos += img.buf.length;
  }

  return ico;
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
