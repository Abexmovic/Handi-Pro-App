const fs = require('fs');
const path = require('path');

// Resolve directories dynamically relative to this script's location (app folder)
const appDir = __dirname;
const srcDir = path.resolve(appDir, '..');
const destWww = path.resolve(appDir, 'www');

// Copy CSS
let css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
fs.writeFileSync(path.join(destWww, 'css', 'style.css'), css);

// Copy JS
let js = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');
fs.writeFileSync(path.join(destWww, 'js', 'script.js'), js);

// Copy Images
const srcImg = path.join(srcDir, 'Images');
const destImg = path.join(destWww, 'Images');
if (!fs.existsSync(destImg)) fs.mkdirSync(destImg, { recursive: true });

for (const file of fs.readdirSync(srcImg)) {
  fs.copyFileSync(path.join(srcImg, file), path.join(destImg, file));
}

// Copy Videos
const srcVideos = path.join(srcDir, 'videos');
const destVideos = path.join(destWww, 'videos');
if (!fs.existsSync(destVideos)) fs.mkdirSync(destVideos, { recursive: true });

for (const file of fs.readdirSync(srcVideos)) {
  fs.copyFileSync(path.join(srcVideos, file), path.join(destVideos, file));
}

// Adapt index.html for app/www
let indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(
  '<link rel="stylesheet" href="./style.css">',
  '<link rel="stylesheet" href="css/style.css">\n    <link rel="stylesheet" href="css/mobile.css">'
);
indexHtml = indexHtml.replace(
  '<script src="./script.js"></script>',
  '<script src="js/script.js"></script>\n    <script src="js/mobile-bridge.js"></script>'
);
fs.writeFileSync(path.join(destWww, 'index.html'), indexHtml);

// Adapt register.html for app/www
let regHtml = fs.readFileSync(path.join(srcDir, 'register.html'), 'utf8');
regHtml = regHtml.replace(
  '<link rel="stylesheet" href="style.css">',
  '<link rel="stylesheet" href="css/style.css">\n    <link rel="stylesheet" href="css/mobile.css">'
);
// Remove duplicate supabase script tag
regHtml = regHtml.replace('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</body>', '</body>');
regHtml = regHtml.replace(
  '<script src="script.js"></script>',
  '<script src="js/script.js"></script>\n    <script src="js/mobile-bridge.js"></script>'
);
fs.writeFileSync(path.join(destWww, 'register.html'), regHtml);

console.log('Adapted www files created successfully in app/www.');
