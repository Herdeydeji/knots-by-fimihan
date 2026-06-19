const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons')
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const svgIcon = fs.readFileSync(path.join(ICONS_DIR, 'icon-512x512.svg'), 'utf-8')

async function generate() {
  await sharp(Buffer.from(svgIcon)).resize(192, 192).png().toFile(path.join(ICONS_DIR, 'icon-192x192.png'))
  await sharp(Buffer.from(svgIcon)).resize(512, 512).png().toFile(path.join(ICONS_DIR, 'icon-512x512.png'))
  await sharp(Buffer.from(svgIcon)).resize(180, 180).png().toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'))
  await sharp(Buffer.from(svgIcon)).resize(1200, 630).png().toFile(path.join(PUBLIC_DIR, 'og-image.png'))
  console.log('All PNG icons generated successfully')
}

generate().catch(console.error)
