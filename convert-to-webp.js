const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const FILES_TO_CONVERT = [
  "src/assets/img/homepageimage2-min.png",
  "src/assets/img/homepage.png",
  "src/assets/img/trainning.jpg",
  "src/assets/img/registergarden.jpg",
  "src/assets/img/CardsBg.jpg",
  "src/components/Contactxoto/photo-1477959858617-67f85cf4f1df.png",
  "src/assets/img/lastt.jpg",
  "src/assets/img/custom-icon.jpg",
  "src/assets/img/ecommercebanner.png",
  "src/assets/img/landscap/LED.jpeg",
  "src/components/AII/Screenshot 2025-11-25 160027.png",
  "src/assets/img/heroImg.jpg",
  "src/assets/img/interior.jpg"
];

function scanDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    callback(dir);
  } else if (stat.isDirectory()) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === "node_modules" || item === ".next" || item === ".git") continue;
      scanDir(path.join(dir, item), callback);
    }
  }
}

async function convertFile(file) {
  const absolutePath = path.resolve(file);
  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠️ File does not exist: ${file}`);
    return null;
  }

  const ext = path.extname(file);
  const baseWithoutExt = path.basename(file, ext);
  const dir = path.dirname(file);
  const webpFile = path.join(dir, `${baseWithoutExt}.webp`);
  const absoluteWebpPath = path.resolve(webpFile);

  const beforeSize = fs.statSync(absolutePath).size;

  try {
    await sharp(absolutePath)
      .webp({ quality: 75 })
      .toFile(absoluteWebpPath);

    const afterSize = fs.statSync(absoluteWebpPath).size;
    const beforeMB = (beforeSize / (1024 * 1024)).toFixed(2);
    const afterMB = (afterSize / (1024 * 1024)).toFixed(2);

    console.log(`✅ Converted ${file} -> ${webpFile} (${beforeMB} MB -> ${afterMB} MB)`);
    return {
      original: file,
      webp: webpFile,
      originalBase: path.basename(file),
      webpBase: path.basename(webpFile),
      beforeSize,
      afterSize
    };
  } catch (err) {
    console.error(`❌ Failed to convert ${file}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting image conversion to WebP...");
  const results = [];
  
  for (const file of FILES_TO_CONVERT) {
    const res = await convertFile(file);
    if (res) results.push(res);
  }

  if (results.length === 0) {
    console.log("No files converted successfully.");
    return;
  }

  console.log("\n📝 Updating code references in src/ directory...");
  let filesUpdated = 0;
  
  scanDir("./src", (codeFile) => {
    const ext = path.extname(codeFile);
    if (![".js", ".jsx", ".ts", ".tsx", ".css"].includes(ext)) return;

    let content = fs.readFileSync(codeFile, "utf8");
    let changed = false;

    for (const res of results) {
      // Replace references to the image base name (e.g. "homepage.png" -> "homepage.webp")
      // We do a case-insensitive check and replace
      const originalRegex = new RegExp(res.originalBase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      if (originalRegex.test(content)) {
        content = content.replace(originalRegex, res.webpBase);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(codeFile, content, "utf8");
      console.log(`  Updated references in: ${codeFile}`);
      filesUpdated++;
    }
  });

  console.log(`\nUpdated references in ${filesUpdated} code files.`);

  console.log("\n🗑️ Cleaning up original files...");
  for (const res of results) {
    try {
      fs.unlinkSync(path.resolve(res.original));
      console.log(`  Deleted original: ${res.original}`);
    } catch (err) {
      console.error(`  Failed to delete ${res.original}: ${err.message}`);
    }
  }

  const totalBefore = results.reduce((acc, curr) => acc + curr.beforeSize, 0);
  const totalAfter = results.reduce((acc, curr) => acc + curr.afterSize, 0);
  const saved = totalBefore - totalAfter;

  console.log("\n─────────────────────────────────");
  console.log(`📊 Total Images Converted : ${results.length}`);
  console.log(`📦 Before Size          : ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`📦 After Size           : ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`💾 Total Saved          : ${(saved / (1024 * 1024)).toFixed(2)} MB`);
  console.log("─────────────────────────────────");
  console.log("🎉 All done!");
}

main();
