import React, { useState, useEffect } from 'react';
import styles from '../styles/DashboardLayout.module.css';

interface BotStatus {
  configured: boolean;
  bot?: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    verified: boolean;
  };
  guilds?: number;
  environment?: {
    nodeEnv: string;
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasRedirectUri: boolean;
  };
  error?: string;
}

interface UserStatus {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    verified: boolean;
  };
  guilds?: {
    total: number;
    manageable: number;
    list: Array<{
      id: string;
      name: string;
      icon: string;
      owner: boolean;
    }>;
  };
  error?: string;
}

export default function BotStatusIndicator() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        // Fetch bot status
        const botResponse = await fetch('/api/bot/status');
        const botData = await botResponse.json();
        setBotStatus(botData);

        // Fetch user auth status
        const userResponse = await fetch('/api/auth/status');
        const userData = await userResponse.json();
        setUserStatus(userData);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) {
    return (
      <div className={styles.statusIndicator}>
        <span>Loading...</span>
      </div>
    );
  }

  const getBotStatusColor = () => {
    if (botStatus?.configured) return '#00ff00';
    return '#ff0000';
  };

  const getUserStatusColor = () => {
    if (userStatus?.authenticated) return '#00ff00';
    return '#ff0000';
  };

  return (
    <div className={styles.statusContainer}>
      <div className={styles.statusItem}>
        <div className={styles.statusHeader}>
          <span 
            className={styles.statusDot} 
            style={{ backgroundColor: getBotStatusColor() }}
          />
          <span>Bot Status</span>
        </div>
        {botStatus?.configured ? (
          <div className={styles.statusDetails}>
            <p>✅ {botStatus.bot?.username}#{botStatus.bot?.discriminator}</p>
            <p>Servers: {botStatus.guilds || 0}</p>
          </div>
        ) : (
          <div className={styles.statusDetails}>
            <p>❌ Bot not configured</p>
            <p>Error: {botStatus?.error}</p>
          </div>
        )}
      </div>

      <div className={styles.statusItem}>
        <div className={styles.statusHeader}>
          <span 
            className={styles.statusDot} 
            style={{ backgroundColor: getUserStatusColor() }}
          />
          <span>User Status</span>
        </div>
        {userStatus?.authenticated ? (
          <div className={styles.statusDetails}>
            <p>✅ {userStatus.user?.username}#{userStatus.user?.discriminator}</p>
            <p>Manageable Servers: {userStatus.guilds?.manageable || 0}</p>
          </div>
        ) : (
          <div className={styles.statusDetails}>
            <p>❌ Not authenticated</p>
            <p>
              <a href="/api/auth/login" className={styles.loginLink}>
                Login with Discord
              </a>
            </p>
          </div>
        )}
      </div>

      {botStatus?.environment && (
        <div className={styles.statusItem}>
          <div className={styles.statusHeader}>
            <span>Configuration</span>
          </div>
          <div className={styles.statusDetails}>
            <p>Environment: {botStatus.environment.nodeEnv}</p>
            <p>Client ID: {botStatus.environment.hasClientId ? '✅' : '❌'}</p>
            <p>Client Secret: {botStatus.environment.hasClientSecret ? '✅' : '❌'}</p>
            <p>Redirect URI: {botStatus.environment.hasRedirectUri ? '✅' : '❌'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
