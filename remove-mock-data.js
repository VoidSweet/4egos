    const fs = require('fs');
const path = require('path');

// Files that contain mock data
const filesToFix = [
    'src/pages/dashboard/security.tsx',
    'src/pages/dashboard/economy.tsx',
    'src/pages/dashboard/games.tsx',
    'src/pages/dashboard/leveling.tsx',
    'src/pages/dashboard/moderation.tsx',
    'src/pages/dashboard/billing.tsx',
    'src/pages/dashboard/utilities.tsx',
    'src/pages/dashboard/console.tsx',
    'src/pages/dashboard/profile.tsx',
    'src/pages/dashboard/servers.tsx',
    'src/pages/dashboard/@me/index.tsx'
];

console.log('Removing mock data from dashboard pages...');

filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace mock data export with real authentication check
        const realServerSideProps = `
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    
    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }

    try {
        // Fetch real user data from Discord
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': \`Bearer \${token}\` }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        
        return {
            props: {
                user: {
                    id: userData.id,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    verified: userData.verified,
                    public_flags: userData.public_flags
                }
            }
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }
};`;

        // Remove mock data and replace with real data fetching
        content = content.replace(/export const getServerSideProps[\s\S]*?};/g, realServerSideProps);
        
        // Remove mock user data comments and variables
        content = content.replace(/\/\/.*[Mm]ock.*\n/g, '');
        content = content.replace(/const mock\w+.*?};/gs, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
});

console.log('Mock data removed from all dashboard pages!');
