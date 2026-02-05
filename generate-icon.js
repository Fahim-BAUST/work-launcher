const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");

async function generateIcon() {
  const sizes = [256, 128, 64, 48, 32, 16];
  const assetsDir = path.join(__dirname, "assets");

  // Generate PNG icons at different sizes
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // Background - rounded rectangle with gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#4A90E2"); // Blue
    gradient.addColorStop(1, "#7B68EE"); // Purple

    // Draw rounded rectangle background
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw "W" letter for Work
    ctx.fillStyle = "white";
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("W", size / 2, size / 2 + size * 0.05);

    // Add a small rocket/launch icon in bottom right
    const rocketSize = size * 0.25;
    const rocketX = size * 0.72;
    const rocketY = size * 0.72;

    ctx.fillStyle = "#FFD700"; // Gold color
    ctx.beginPath();
    ctx.moveTo(rocketX, rocketY - rocketSize * 0.5);
    ctx.lineTo(rocketX + rocketSize * 0.3, rocketY + rocketSize * 0.3);
    ctx.lineTo(rocketX - rocketSize * 0.3, rocketY + rocketSize * 0.3);
    ctx.closePath();
    ctx.fill();

    // Save PNG
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(path.join(assetsDir, `icon-${size}.png`), buffer);
    console.log(`Created icon-${size}.png`);
  }

  // Create ICO file from multiple PNG sizes
  const pngBuffers = [256, 128, 64, 48, 32, 16].map((size) =>
    fs.readFileSync(path.join(assetsDir, `icon-${size}.png`)),
  );
  const ico = await toIco(pngBuffers);
  fs.writeFileSync(path.join(assetsDir, "icon.ico"), ico);
  console.log("Created icon.ico");

  // Copy 256px as main tray icon
  fs.copyFileSync(
    path.join(assetsDir, "icon-256.png"),
    path.join(assetsDir, "tray-icon.png"),
  );
  console.log("Created tray-icon.png");

  console.log("\nAll icons generated successfully!");
}

generateIcon().catch(console.error);
