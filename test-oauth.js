// Quick OAuth Configuration Test
const config = {
  production: {
    clientId: '1398326650558742528',
    redirectUri: 'https://4egis.gr/api/auth/callback',
    baseUrl: 'https://4egis.gr',
    // Test OAuth URL
    oauthUrl: `https://discord.com/api/oauth2/authorize?client_id=1398326650558742528&scope=identify+guilds&redirect_uri=${encodeURIComponent('https://4egis.gr/api/auth/callback')}&response_type=code`
  }
};

console.log('🔧 OAuth Configuration Test');
console.log('==========================');
console.log('Client ID:', config.production.clientId);
console.log('Redirect URI:', config.production.redirectUri);
console.log('Encoded URI:', encodeURIComponent(config.production.redirectUri));
console.log('');
console.log('✅ OAuth Test URL:');
console.log(config.production.oauthUrl);
console.log('');
console.log('📋 Checklist:');
console.log('□ Discord App has redirect URI: https://4egis.gr/api/auth/callback');
console.log('□ Vercel env vars set: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET');
console.log('□ Vercel env vars set: NEXTAUTH_URL=https://4egis.gr');
console.log('□ Vercel env vars set: DISCORD_REDIRECT_URI=https://4egis.gr/api/auth/callback');
