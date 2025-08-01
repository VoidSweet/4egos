const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'src/pages/dashboard/billing.tsx',
    'src/pages/dashboard/console.tsx',
    'src/pages/dashboard/economy.tsx',
    'src/pages/dashboard/games.tsx',
    'src/pages/dashboard/leveling.tsx',
    'src/pages/dashboard/moderation.tsx',
    'src/pages/dashboard/profile.tsx',
    'src/pages/dashboard/security.tsx',
    'src/pages/dashboard/servers.tsx',
    'src/pages/dashboard/utilities.tsx',
    'src/pages/dashboard/guilds/[guild]/index.tsx',
    'src/pages/dashboard/guilds/[guild]/moderation.tsx',
    'src/pages/dashboard/guilds/[guild]/modlogs.tsx',
    'src/pages/dashboard/guilds/[guild]/permissions.tsx'
];

files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        console.log(`Fixing ${filePath}...`);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace ctx.req.url with ctx.resolvedUrl with fallback
        content = content.replace(
            /ctx\.req\.url/g,
            `ctx.resolvedUrl || '${filePath.includes('[guild]') ? '/dashboard/guilds/[guild]' : filePath.replace('src/pages', '').replace('.tsx', '')}'`
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('All files fixed!');
