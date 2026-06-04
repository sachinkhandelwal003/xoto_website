const fs = require("fs");
const path = require("path");

const CODE_DIRS = ["./src"];

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

const largeImages = [
  "homepageimage2-min.png",
  "homepageimage2.png",
  "homepage.png",
  "trainning.jpg",
  "registergarden.jpg",
  "CardsBg.jpg",
  "lastt.jpg",
  "custom-icon.jpg"
];

let occurrences = [];

CODE_DIRS.forEach(dir => {
  scanDir(dir, (file) => {
    if (!file.endsWith(".js") && !file.endsWith(".jsx") && !file.endsWith(".css")) return;
    const text = fs.readFileSync(file, "utf8");
    
    largeImages.forEach(imgName => {
      if (text.toLowerCase().includes(imgName.toLowerCase())) {
        const lines = text.split("\n");
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes(imgName.toLowerCase())) {
            occurrences.push({
              file,
              image: imgName,
              line: idx + 1,
              content: line.trim()
            });
          }
        });
      }
    });
  });
});

console.log("Image usages in codebase:");
console.log("────────────────────────────────────────────────");
occurrences.forEach(occ => {
  console.log(`- ${occ.image} used in [${occ.file}:${occ.line}]:`);
  console.log(`    ${occ.content}`);
});
