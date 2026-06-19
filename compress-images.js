const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIRS = ["./src", "./public"];
const SUPPORTED = [".jpg", ".jpeg", ".png", ".webp"];

// Settings - Quality control
const CONFIG = {
  jpg: { quality: 75 },   // 75% quality - good balance of size vs quality
  png: { quality: 75 },
};

async function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2); // in MB
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const tempPath = filePath + ".tmp";

  try {
    const beforeSize = await getFileSize(filePath);

    // Skip small images (< 50KB) to avoid quality loss on items already optimized
    const stats = fs.statSync(filePath);
    if (stats.size < 50 * 1024) {
      return { before: 0, after: 0, skipped: true };
    }

    if (ext === ".png") {
      await sharp(filePath)
        .png({ quality: CONFIG.png.quality, compressionLevel: 9 })
        .toFile(tempPath);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      await sharp(filePath)
        .jpeg({ quality: CONFIG.jpg.quality, mozjpeg: true })
        .toFile(tempPath);
    } else if (ext === ".webp") {
      await sharp(filePath)
        .webp({ quality: CONFIG.jpg.quality })
        .toFile(tempPath);
    }

    if (fs.existsSync(tempPath)) {
      // Replace original with compressed if compressed is actually smaller
      const tempStats = fs.statSync(tempPath);
      if (tempStats.size < stats.size) {
        fs.renameSync(tempPath, filePath);
        const afterSize = await getFileSize(filePath);
        const saved = (parseFloat(beforeSize) - parseFloat(afterSize)).toFixed(2);
        console.log(`✅ Compressed: ${path.basename(filePath)} | ${beforeSize}MB → ${afterSize}MB | Saved: ${saved}MB`);
        return { before: parseFloat(beforeSize), after: parseFloat(afterSize) };
      } else {
        fs.unlinkSync(tempPath); // compressed version is larger, discard it
        return { before: parseFloat(beforeSize), after: parseFloat(beforeSize), skipped: true };
      }
    }
    return { before: 0, after: 0 };
  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.log(`❌ Failed to compress: ${path.basename(filePath)} - ${err.message}`);
    return { before: 0, after: 0 };
  }
}

async function getAllImages(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    // Ignore node_modules, .next, etc. just to be safe
    if (item === "node_modules" || item === ".next" || item === ".git") continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(await getAllImages(fullPath));
    } else if (SUPPORTED.includes(path.extname(item).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log("🔍 Scanning image assets in src/assets and public...");
  let images = [];
  for (const dir of INPUT_DIRS) {
    const dirImages = await getAllImages(dir);
    images = images.concat(dirImages);
  }
  
  // Remove duplicate paths just in case
  images = [...new Set(images)];
  
  console.log(`📁 Total candidate images found: ${images.length}\n`);
  console.log("⏳ Compressing large images (quality: 75%)...\n");

  let totalBefore = 0;
  let totalAfter = 0;
  let compressedCount = 0;

  for (const img of images) {
    const result = await compressImage(img);
    if (!result.skipped && result.before > 0) {
      totalBefore += result.before;
      totalAfter += result.after;
      compressedCount++;
    }
  }

  const totalSaved = (totalBefore - totalAfter).toFixed(2);
  console.log("\n─────────────────────────────────");
  console.log(`📊 Images Compressed : ${compressedCount}`);
  console.log(`📦 Before size      : ${totalBefore.toFixed(2)} MB`);
  console.log(`📦 After size       : ${totalAfter.toFixed(2)} MB`);
  console.log(`💾 Saved memory     : ${totalSaved} MB`);
  console.log("─────────────────────────────────");
  console.log("✅ Image compression completed!");

  console.log("\n📦 Setting up favicon...");
  try {
    const logoSource = "./src/assets/img/logoXoto.png";
    const faviconDest = "./public/favicon.png";
    if (fs.existsSync(logoSource)) {
      fs.copyFileSync(logoSource, faviconDest);
      console.log(`✅ Successfully copied ${logoSource} -> ${faviconDest}`);
    } else {
      console.log(`⚠️ Logo source not found at ${logoSource}`);
    }
  } catch (err) {
    console.log(`❌ Failed to copy favicon: ${err.message}`);
  }
}

main();
