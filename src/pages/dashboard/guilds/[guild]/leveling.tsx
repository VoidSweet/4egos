import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

interface LevelingSettings {
  enabled: boolean;
  xpPerMessage: number;
  cooldownSeconds: number;
  levelUpMessage: string;
  maxLevel: number;
}

interface Props {
  guildId: string;
}

export default function LevelingPage({ guildId }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<LevelingSettings>({
    enabled: true,
    xpPerMessage: 15,
    cooldownSeconds: 60,
    levelUpMessage: 'Congratulations {user}, you reached level {level}!',
    maxLevel: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) {
      fetchLevelingSettings();
    }
  }, [guildId]);

  const fetchLevelingSettings = async () => {
    try {
      const response = await fetch(`/api/bot/${guildId}/leveling`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch leveling settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch(`/api/bot/${guildId}/leveling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        // Show success message
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className="dark-content-header">
          <h1 className="dark-content-title">⬆️ Leveling System</h1>
          <p className="dark-content-subtitle">Loading leveling settings...</p>
        </div>
        <div className="dark-content-body">
          <div className="dark-card">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>⏳</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Loading Settings</h3>
              <p style={{ color: 'var(--text-muted)' }}>Fetching your leveling configuration...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout guildId={guildId}>
      {/* Content Header */}
      <div className="dark-content-header">
        <h1 className="dark-content-title">⬆️ Leveling System</h1>
        <p className="dark-content-subtitle">Configure experience points and level rewards for your server</p>
      </div>

      {/* Content Body */}
      <div className="dark-content-body">
        {/* Stats Grid */}
        <div className="dark-stats-grid">
          <div className="dark-stat-card">
            <div className="dark-stat-icon blue">
              📈
            </div>
            <div>
              <div className="dark-stat-number">{settings.enabled ? 'Enabled' : 'Disabled'}</div>
              <div className="dark-stat-label">Leveling Status</div>
              <div className="dark-stat-sublabel">System Status</div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon green">
              ⚡
            </div>
            <div>
              <div className="dark-stat-number">{settings.xpPerMessage}</div>
              <div className="dark-stat-label">XP Per Message</div>
              <div className="dark-stat-sublabel">Experience Points</div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon yellow">
              ⏰
            </div>
            <div>
              <div className="dark-stat-number">{settings.cooldownSeconds}s</div>
              <div className="dark-stat-label">XP Cooldown</div>
              <div className="dark-stat-sublabel">Between Messages</div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon purple">
              🎯
            </div>
            <div>
              <div className="dark-stat-number">{settings.maxLevel}</div>
              <div className="dark-stat-label">Max Level</div>
              <div className="dark-stat-sublabel">Level Cap</div>
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Basic Settings */}
          <div className="dark-card">
            <div className="dark-card-header">
              <h2 className="dark-card-title">⚙️ Basic Settings</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Enable Leveling System
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                    style={{ 
                      width: '18px', 
                      height: '18px',
                      accentColor: 'var(--accent-blue)'
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {settings.enabled ? 'Leveling is enabled' : 'Leveling is disabled'}
                  </span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  XP Per Message
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.xpPerMessage}
                  onChange={(e) => setSettings({ ...settings, xpPerMessage: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  How much XP users gain per message (1-100)
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  XP Cooldown (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  value={settings.cooldownSeconds}
                  onChange={(e) => setSettings({ ...settings, cooldownSeconds: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Cooldown between XP gains (0-3600 seconds)
                </small>
              </div>
            </div>
          </div>

          {/* Level Settings */}
          <div className="dark-card">
            <div className="dark-card-header">
              <h2 className="dark-card-title">🎯 Level Settings</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Maximum Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.maxLevel}
                  onChange={(e) => setSettings({ ...settings, maxLevel: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Maximum level users can reach (1-1000)
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Level Up Message
                </label>
                <textarea
                  value={settings.levelUpMessage}
                  onChange={(e) => setSettings({ ...settings, levelUpMessage: e.target.value })}
                  placeholder="Congratulations {user}, you reached level {level}!"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Use {`{user}`} for username and {`{level}`} for level number
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="dark-card">
          <div className="dark-card-header">
            <h2 className="dark-card-title">💾 Save Changes</h2>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              className="dark-btn dark-btn-primary"
              onClick={handleSaveSettings}
              style={{ minWidth: '150px' }}
            >
              💾 Save Settings
            </button>
            <button 
              className="dark-btn dark-btn-secondary"
              onClick={() => window.location.reload()}
              style={{ minWidth: '150px' }}
            >
              🔄 Reset Changes
            </button>
            <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '14px' }}>
              💡 Changes will take effect immediately after saving
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { ['__SessionLuny']: token } = parseCookies(context);
    const { guild } = context.query;
    const guildId = guild as string;
    
    if (!token) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false,
        }
      };
    }

    return {
      props: {
        guildId
      }
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      }
    };
  }
};
