const fs = require('fs');
const { join } = require('path');

const index = fs.readFileSync(join(__dirname, 'index.html')).toString();
const readme = fs.readFileSync(join(__dirname, 'readme.html')).toString();

// remove first 2 lines
const [,,...content] = readme.split('\n');

const html = index.replace(
        '<div id="content">content</div>',
        `<div id="content">${content.join('\n')}</div>`,
    );

fs.writeFileSync(join(__dirname, '../docs/index.html'), html);