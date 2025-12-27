const fs = require('fs');
const path = require('path');

const versionData = {
    version: new Date().getTime().toString(),
    buildDate: new Date().toISOString()
};

const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Write version.json to public
fs.writeFileSync(
    path.join(publicDir, 'version.json'),
    JSON.stringify(versionData, null, 2)
);

// Write version.ts to src for client-side usage
// This allows the client to know "What version am I?"
const versionContent = `export const APP_VERSION = "${versionData.version}";\nexport const BUILD_DATE = "${versionData.buildDate}";\n`;
fs.writeFileSync(
    path.join(srcDir, 'version.ts'),
    versionContent
);

console.log(`✅ Version generated: ${versionData.version}`);
