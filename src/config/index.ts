// Application configuration based on environment
export const config = {
  // Base URLs
  baseUrl: process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL || 'https://4egis.gr'
    : 'http://localhost:3000',
    
  apiUrl: process.env.NODE_ENV === 'production'
    ? process.env.DASHBOARD_API_URL || 'https://4egis.gr/api'
    : 'http://localhost:3000/api',
    
  // Discord OAuth
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '1398326650558742528',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.DISCORD_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://4egis.gr/api/auth/callback'
        : 'http://localhost:3000/api/auth/callback'),
  },
  
  // Bot configuration
  bot: {
    token: process.env.DISCORD_TOKEN || '',
    prefix: process.env.DEFAULT_PREFIX || '!',
    syncCommands: process.env.SYNC_COMMANDS === 'true',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? process.env.POSTGRES_URL_NO_SSL || ''
        : 'sqlite:///data/aegis.db'),
    host: process.env.POSTGRES_HOST || '',
    noSsl: process.env.POSTGRES_URL_NO_SSL || '',
  },
  
  // External API
  dashboardApi: {
    url: process.env.DASHBOARD_API_URL || 'https://4egis.gr/api',
    key: process.env.DASHBOARD_API_KEY || '',
    syncEnabled: process.env.ENABLE_DASHBOARD_SYNC === 'true',
  },
  
  // AI Configuration
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    enabled: process.env.AI_ENABLED === 'true',
  },
  
  // Bot Settings
  leveling: {
    maxXpPerMessage: parseInt(process.env.MAX_XP_PER_MESSAGE || '25'),
    minXpPerMessage: parseInt(process.env.MIN_XP_PER_MESSAGE || '15'),
    xpCooldown: parseInt(process.env.XP_COOLDOWN || '60'),
    enabled: process.env.LEVELING_ENABLED === 'true',
  },
  
  // Moderation Settings
  moderation: {
    autoRolePersist: process.env.AUTO_ROLE_PERSIST === 'true',
    logChannelName: process.env.LOG_CHANNEL_NAME || 'aegis-logs',
    enabled: process.env.MODERATION_ENABLED === 'true',
  },
  
  // Webhooks
  webhooks: {
    moderation: process.env.MODERATION_WEBHOOK || '',
    joinLeave: process.env.JOIN_LEAVE_WEBHOOK || '',
    levelUp: process.env.LEVEL_UP_WEBHOOK || '',
    auditLog: process.env.AUDIT_LOG_WEBHOOK || '',
  },
  
  // Session & Auth
  session: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
    extAuthSecret: process.env.EXTAUTH_SECRET || '',
  },
  
  // Analytics & Monitoring
  analytics: {
    stackPublishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || '',
    neonProjectId: process.env.NEON_PROJECT_ID || '',
  },
  
  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || '',
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableDebugMode: process.env.DEBUG === 'true',
    reactionRolesEnabled: process.env.REACTION_ROLES_ENABLED === 'true',
  },
  
  // Development
  development: {
    devGuildId: process.env.DEV_GUILD_ID || '',
  },
};

export default config;
