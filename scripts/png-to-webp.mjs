import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import fg from 'fast-glob';

const ROOT_DIRS = ['public', 'src/assets'];
const QUALITY = 75;
const MANIFEST_PATH = 'build-cache/images-manifest.json';
const CACHE_DIR = 'build-cache/webp-cache';

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

async function convertPngToWebp(filePath, manifest) {
  const ext = path.extname(filePath);
  if (ext.toLowerCase() !== '.png') return;

  const hash = getHash(filePath);
  const baseName = path.basename(filePath, ext);
  const hashedWebpName = `${baseName}.${hash}.webp`;
  
  // Резолвим путь для манифеста (относительно public или src/assets)
  let relativePath = filePath;
  let subDir = '';
  for (const root of ROOT_DIRS) {
    if (filePath.startsWith(root)) {
      relativePath = path.relative(root, filePath).replace(/\\/g, '/');
      subDir = path.dirname(relativePath);
      break;
    }
  }

  const targetDir = subDir === '.' ? CACHE_DIR : path.join(CACHE_DIR, subDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const webpPath = path.join(targetDir, hashedWebpName);

  const manifestKey = relativePath.replace(/\.png$/i, '.webp');
  manifest[manifestKey] = hashedWebpName;

  try {
    // Удаляем старые webp файлы для этого изображения в кэше
    if (fs.existsSync(targetDir)) {
      const filesInDir = fs.readdirSync(targetDir);
      for (const file of filesInDir) {
        if (file.startsWith(baseName) && file.endsWith('.webp') && file !== hashedWebpName) {
          console.log(`Removing old version: ${path.join(targetDir, file)}`);
          fs.unlinkSync(path.join(targetDir, file));
        }
      }
    }

    // Проверка существования
    if (fs.existsSync(webpPath)) {
      return;
    }

    console.log(`Converting: ${filePath} -> ${webpPath}`);
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
      
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('Starting PNG to WebP conversion with hashing...');
  
  const manifest = {};
  const patterns = ROOT_DIRS.map(dir => `${dir}/**/*.png`);
  const files = await fg(patterns);
  
  if (files.length === 0) {
    console.log('No PNG files found.');
  } else {
    console.log(`Found ${files.length} PNG files.`);
    for (const file of files) {
      await convertPngToWebp(file, manifest);
    }
  }
  
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest updated at ${MANIFEST_PATH}`);
  console.log('Conversion finished.');
}

// Позволяет запускать скрипт напрямую
const isMain = import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain || process.argv[1].endsWith('png-to-webp.mjs')) {
    main().catch(console.error);
}

export { main, convertPngToWebp };
