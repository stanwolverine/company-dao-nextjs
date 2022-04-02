// flowbite.js file is needed to make flowbite components interactive.
// We want to serve this file to our website. but since it is inside node_modules we have problem serving it.
// Solution: copy /node_modules/flowbite/dist/flowbite.js to /public/scripts/flowbite.js
const fs = require('fs');
const path = require('path');

function main() {
    const originalFilePath = path.join(__dirname, "..", "node_modules", "flowbite", "dist", "flowbite.js");

    if (!fs.existsSync(originalFilePath)) {
        throw new Error(`Original flowbite.js file doesn't exist at: ${originalFilePath}`);
    }

    const destinationDir = path.resolve(__dirname, '..', 'public', 'scripts');

    if (!fs.existsSync(destinationDir)) {
        console.log(`${destinationDir} doesn't exist. creating...`);
        fs.mkdirSync(destinationDir);
    }
  
    const destinationFilePath = path.join(destinationDir, "flowbite.js");

    fs.copyFileSync(originalFilePath, destinationFilePath);
}

main();
