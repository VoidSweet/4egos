import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BotStatusIndicator from '../../components/BotStatusIndicator';
import styles from '../../styles/DashboardLayout.module.css';

interface DiagnosticsProps {
  user: any;
}

export default function Diagnostics({ user }: DiagnosticsProps) {
  const [tests, setTests] = useState({
    botToken: { status: 'testing', message: 'Checking bot token...' },
    discordApi: { status: 'testing', message: 'Testing Discord API connection...' },
    oauthConfig: { status: 'testing', message: 'Validating OAuth configuration...' },
    database: { status: 'testing', message: 'Testing database connection...' },
    userAuth: { status: 'testing', message: 'Checking user authentication...' },
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setSuggestions([]); // Clear previous suggestions

    // Test Bot Status
    try {
      const botResponse = await fetch('/api/bot/status');
      const botData = await botResponse.json();
      
      setTests(prev => ({
        ...prev,
        botToken: {
          status: botData.configured ? 'success' : 'error',
          message: botData.configured 
            ? `✅ Bot connected: ${botData.bot?.username}#${botData.bot?.discriminator}`
            : `❌ Bot not configured: ${botData.error}`
        },
        discordApi: {
          status: botData.configured ? 'success' : 'error',
          message: botData.configured 
            ? `✅ Discord API accessible, bot in ${botData.guilds} servers`
            : '❌ Cannot reach Discord API'
        }
      }));

      if (!botData.configured) {
        setSuggestions(prev => [...prev, 
          'Check DISCORD_TOKEN in .env.local',
          'Verify bot token is valid in Discord Developer Portal',
          'Ensure bot has proper permissions',
          'Set DISCORD_CLIENT_ID in environment variables',
          'Set DISCORD_CLIENT_SECRET in environment variables'
        ]);
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        botToken: { status: 'error', message: '❌ Failed to check bot status' },
        discordApi: { status: 'error', message: '❌ Discord API unreachable' }
      }));
    }

    // Test OAuth Configuration and User Authentication
    try {
      const authResponse = await fetch('/api/auth/status');
      const authData = await authResponse.json();
      
      setTests(prev => ({
        ...prev,
        oauthConfig: {
          status: authData.configured ? 'success' : 'warning',
          message: authData.configured 
            ? '✅ OAuth configuration complete'
            : '⚠️ OAuth partially configured'
        },
        userAuth: {
          status: authData.authenticated ? 'success' : 'error',
          message: authData.authenticated 
            ? `✅ User authenticated: ${authData.user?.username}`
            : '❌ User not authenticated'
        }
      }));

      if (!authData.configured) {
        setSuggestions(prev => [...prev,
          'Update OAuth2 redirect URLs in Discord Developer Portal',
          'Verify environment variables are set correctly'
        ]);
      }

      if (!authData.authenticated) {
        setSuggestions(prev => [...prev,
          'Login with Discord to test authentication flow',
          'Check browser cookies are enabled',
          'Verify session token is not expired'
        ]);
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        oauthConfig: { status: 'error', message: '❌ Failed to check OAuth config' },
        userAuth: { status: 'error', message: '❌ Failed to check user authentication' }
      }));
    }

    // Test Database Connection (placeholder)
    setTests(prev => ({
      ...prev,
      database: {
        status: 'warning',
        message: '⚠️ Database connection not tested (implement based on your DB)'
      }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '🔄';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#00ff00';
      case 'error': return '#ff0000';
      case 'warning': return '#ffaa00';
      case 'testing': return '#0088ff';
      default: return '#888888';
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Bot Diagnostics</h1>
        
        <div className={styles.section}>
          <h2>System Status</h2>
          <BotStatusIndicator />
        </div>

        <div className={styles.section}>
          <h2>Diagnostic Tests</h2>
          <div className={styles.diagnosticsList}>
            {Object.entries(tests).map(([key, test]) => (
              <div key={key} className={styles.diagnosticItem}>
                <span 
                  className={styles.diagnosticIcon}
                  style={{ color: getStatusColor(test.status) }}
                >
                  {getStatusIcon(test.status)}
                </span>
                <div className={styles.diagnosticContent}>
                  <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                  <p>{test.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className={styles.section}>
            <h2>Troubleshooting Suggestions</h2>
            <ul className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <li key={index} className={styles.suggestion}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.section}>
          <h2>Environment Variables Checklist</h2>
          <div className={styles.envChecklist}>
            <div className={styles.envCategory}>
              <h3>Discord Configuration</h3>
              <ul>
                <li>DISCORD_TOKEN - Bot token from Discord Developer Portal</li>
                <li>DISCORD_CLIENT_ID - Application ID from Discord Developer Portal</li>
                <li>DISCORD_CLIENT_SECRET - Client secret from Discord Developer Portal</li>
                <li>DISCORD_REDIRECT_URI - OAuth2 redirect URL</li>
              </ul>
            </div>
            
            <div className={styles.envCategory}>
              <h3>Authentication</h3>
              <ul>
                <li>NEXTAUTH_URL - Your application URL</li>
                <li>NEXTAUTH_SECRET - Random secret for JWT signing</li>
              </ul>
            </div>
            
            <div className={styles.envCategory}>
              <h3>Database (Optional)</h3>
              <ul>
                <li>DATABASE_URL - Database connection string</li>
              </ul>
            </div>
          </div>
        </div>

        <button 
          className={styles.refreshButton}
          onClick={runDiagnostics}
        >
          🔄 Run Diagnostics Again
        </button>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      user: null, // Will be fetched client-side
    },
  };
};
