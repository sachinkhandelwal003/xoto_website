const fs = require("fs");
const path = require("path");

const ASSET_DIRS = ["./src/assets", "./public"];
const CODE_DIRS = ["./src", "./next.config.mjs", "./tailwind.config.js"];
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".bmp", ".ico"];

// Load all code file contents into memory
function loadCodebaseFiles(dirs) {
  let contents = [];
  
  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    
    if (stat.isFile()) {
      const ext = path.extname(dir).toLowerCase();
      // Only scan text-based code/config files
      if ([".js", ".jsx", ".css", ".json", ".mjs", ".html"].includes(ext)) {
        try {
          contents.push({
            path: dir,
            text: fs.readFileSync(dir, "utf8")
          });
        } catch (e) {
          // ignore read errors
        }
      }
    } else if (stat.isDirectory()) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item === "node_modules" || item === ".next" || item === ".git") continue;
        scan(path.join(dir, item));
      }
    }
  }

  for (const dir of dirs) {
    scan(dir);
  }
  return contents;
}

// Recursively find all image files
function findImages(dirs) {
  let images = [];
  
  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    
    if (stat.isFile()) {
      const ext = path.extname(dir).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(dir);
      }
    } else if (stat.isDirectory()) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item === "node_modules" || item === ".next" || item === ".git") continue;
        scan(path.join(dir, item));
      }
    }
  }

  for (const dir of dirs) {
    scan(dir);
  }
  return images;
}

function isImageUsed(imagePath, codebase) {
  const filename = path.basename(imagePath); // e.g., "logo.png"
  const ext = path.extname(imagePath);
  const basename = path.basename(imagePath, ext); // e.g., "logo"
  
  // Clean up filenames and search queries
  const cleanFilename = filename.toLowerCase();
  const cleanBasename = basename.toLowerCase();
  
  for (const file of codebase) {
    const text = file.text.toLowerCase();
    
    // 1. Direct search for full filename (e.g. "logo.png")
    if (text.includes(cleanFilename)) {
      return true;
    }
    
    // 2. Direct search for basename if it's long enough to avoid false positives (e.g. "homepageimage2")
    if (cleanBasename.length >= 4) {
      // Check if basename is used inside quotes or in path-like structures
      if (
        text.includes(`/${cleanBasename}`) || 
        text.includes(`"${cleanBasename}"`) || 
        text.includes(`'${cleanBasename}'`) ||
        text.includes(`\`${cleanBasename}\``)
      ) {
        return true;
      }
    }
  }
  
  return false;
}

function main() {
  console.log("🔍 Scanning codebase for references...");
  const codebase = loadCodebaseFiles(CODE_DIRS);
  console.log(`📁 Loaded ${codebase.length} code & config files.`);
  
  console.log("\n🔍 Finding all image assets...");
  const images = findImages(ASSET_DIRS);
  console.log(`🖼️ Found ${images.length} image files under assets/public folders.`);
  
  console.log("\n⏳ Identifying unused images...");
  
  let unusedImages = [];
  let totalUnusedSize = 0;
  
  for (const img of images) {
    if (!isImageUsed(img, codebase)) {
      const stats = fs.statSync(img);
      unusedImages.push(img);
      totalUnusedSize += stats.size;
    }
  }
  
  if (unusedImages.length === 0) {
    console.log("✨ All images are currently used in the codebase. Nothing to delete!");
    return;
  }
  
  console.log(`\n🗑️ Found ${unusedImages.length} unused image files.`);
  console.log(`💾 Total space to recover: ${(totalUnusedSize / (1024 * 1024)).toFixed(2)} MB\n`);
  
  console.log("⏳ Deleting unused images...");
  for (const img of unusedImages) {
    try {
      fs.unlinkSync(img);
      console.log(`Deleted: ${img}`);
    } catch (e) {
      console.log(`❌ Failed to delete: ${img} - ${e.message}`);
    }
  }
  
  console.log("\n─────────────────────────────────");
  console.log(`✅ Cleaned up ${unusedImages.length} unused images!`);
  console.log(`💾 Recovered space: ${(totalUnusedSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log("─────────────────────────────────");
}

main();
