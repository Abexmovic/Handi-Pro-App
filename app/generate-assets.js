const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appDir = 'C:\\Users\\HP\\Desktop\\Handi-Pro\\app';
const iconSrc = path.join(appDir, 'resources', 'icon.jpeg');

console.log('Generating Android icon and splash screen resources from icon.jpeg...');

// Android resource folders
const resDir = path.join(appDir, 'android', 'app', 'src', 'main', 'res');

const mipmapDirs = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

const drawableDirs = [
  'drawable',
  'drawable-land-mdpi',
  'drawable-land-hdpi',
  'drawable-land-xhdpi',
  'drawable-land-xxhdpi',
  'drawable-land-xxxhdpi',
  'drawable-port-mdpi',
  'drawable-port-hdpi',
  'drawable-port-xhdpi',
  'drawable-port-xxhdpi',
  'drawable-port-xxxhdpi'
];

// Helper to write icon and splash files
const iconData = fs.readFileSync(iconSrc);

// 1. Copy icon into all mipmaps as ic_launcher.png and ic_launcher_round.png
for (const dir of mipmapDirs) {
  const targetDir = path.join(resDir, dir);
  if (fs.existsSync(targetDir)) {
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), iconData);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), iconData);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), iconData);
  }
}

// 2. Copy splash into drawables
for (const dir of drawableDirs) {
  const targetDir = path.join(resDir, dir);
  if (fs.existsSync(targetDir)) {
    fs.writeFileSync(path.join(targetDir, 'splash.png'), iconData);
  }
}

// 3. iOS AppIcon & Splash
const iosAppIconDir = path.join(appDir, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
if (fs.existsSync(iosAppIconDir)) {
  fs.writeFileSync(path.join(iosAppIconDir, 'AppIcon-512@2x.png'), iconData);
  // Copy for any other images in appiconset
  for (const f of fs.readdirSync(iosAppIconDir)) {
    if (f.endsWith('.png')) {
      fs.writeFileSync(path.join(iosAppIconDir, f), iconData);
    }
  }
}

const iosSplashDir = path.join(appDir, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
if (fs.existsSync(iosSplashDir)) {
  for (const f of fs.readdirSync(iosSplashDir)) {
    if (f.endsWith('.png')) {
      fs.writeFileSync(path.join(iosSplashDir, f), iconData);
    }
  }
}

console.log('Icons and splash screens deployed to Android & iOS project assets.');
