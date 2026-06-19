const https = require("https");

const videoUrl = "https://xotostaging.s3.me-central-1.amazonaws.com/properties/1776514026285-1768043300370-mortgage2+%282%29.mp4";

const req = https.request(videoUrl, { method: "HEAD" }, (res) => {
  const sizeBytes = res.headers["content-length"];
  if (sizeBytes) {
    const sizeMb = (parseInt(sizeBytes, 10) / (1024 * 1024)).toFixed(2);
    console.log(`Video size: ${sizeMb} MB (${sizeBytes} bytes)`);
  } else {
    console.log("Could not retrieve content-length header.");
  }
});

req.on("error", (e) => {
  console.error("Error fetching video metadata:", e);
});

req.end();
