// Application configuration based on environment
export const config = {
  // Base URLs
  baseUrl: process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL || 'https://yourdomain.com'
    : 'http://localhost:3000',
    
  apiUrl: process.env.NODE_ENV === 'production'
    ? process.env.API_BASE_URL || 'https://yourdomain.com/api'
    : 'http://localhost:3000/api',
    
  // Discord OAuth
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.DISCORD_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://yourdomain.com/api/auth/callback'
        : 'http://localhost:3000/api/auth/callback'),
  },
  
  // Bot configuration
  bot: {
    token: process.env.BOT_TOKEN || '',
    prefix: process.env.BOT_PREFIX || '!',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  // Session
  session: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableDebugMode: process.env.NODE_ENV === 'development',
  },
};

export default config;
