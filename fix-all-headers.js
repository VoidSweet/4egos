const fs = require('fs');
const path = require('path');

const dashboardPages = [
    'src/pages/dashboard/games.tsx',
    'src/pages/dashboard/leveling.tsx',
    'src/pages/dashboard/moderation.tsx',
    'src/pages/dashboard/billing.tsx',
    'src/pages/dashboard/utilities.tsx',
    'src/pages/dashboard/console.tsx',
    'src/pages/dashboard/profile.tsx',
    'src/pages/dashboard/servers.tsx',
    'src/pages/dashboard/guilds/[guild]/modlogs.tsx',
    'src/pages/dashboard/guilds/[guild]/moderation.tsx',
    'src/pages/dashboard/guilds/[guild]/index.tsx'
];

dashboardPages.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove Header import
        content = content.replace(/import Header from ['"'][^'"]+Header['"'];\n?/g, '');
        
        // Remove Header component usage
        content = content.replace(/<Header[^>]*\/>/g, '');
        content = content.replace(/<Header[^>]*>[^<]*<\/Header>/g, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('All dashboard pages fixed!');
