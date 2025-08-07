import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/guild.module.css';

interface ModerationSettings {
  autoMod: {
    enabled: boolean;
    antiSpam: boolean;
    badWords: boolean;
    linksBlocked: boolean;
  };
  logging: {
    enabled: boolean;
    channelId: string;
    logBans: boolean;
    logKicks: boolean;
    logMutes: boolean;
    logDeletes: boolean;
  };
  punishments: {
    warningsBeforeMute: number;
    mutesDuration: number;
    warningsBeforeBan: number;
  };
  channels: {
    modLog: string;
    memberLog: string;
  };
}

export default function ModerationPage() {
  const router = useRouter();
  const { guild } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ModerationSettings>({
    autoMod: {
      enabled: true,
      antiSpam: true,
      badWords: false,
      linksBlocked: false
    },
    logging: {
      enabled: true,
      channelId: '',
      logBans: true,
      logKicks: true,
      logMutes: true,
      logDeletes: false
    },
    punishments: {
      warningsBeforeMute: 3,
      mutesDuration: 300,
      warningsBeforeBan: 5
    },
    channels: {
      modLog: '',
      memberLog: ''
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('__SessionLuny='));

      if (!sessionCookie) {
        router.push('/login');
        return;
      }

      // Load guild data and settings
      setLoading(false);
    };

    if (guild) {
      checkAuth();
    }
  }, [guild, router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateAutoModSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      autoMod: {
        ...prev.autoMod,
        [field]: value
      }
    }));
  };

  const updateLoggingSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      logging: {
        ...prev.logging,
        [field]: value
      }
    }));
  };

  const updatePunishmentsSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      punishments: {
        ...prev.punishments,
        [field]: value
      }
    }));
  };

  const updateChannelsSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className="loading">Loading moderation settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Moderation Settings</h1>
          <p>Configure automated moderation, logging, and punishment systems</p>
        </div>

        <div className="dark-stats-grid">
          {/* Auto Moderation */}
          <div className="dark-card">
            <h3>Auto Moderation</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.autoMod.enabled}
                  onChange={(e) => updateAutoModSetting('enabled', e.target.checked)}
                />
                Enable Auto Moderation
              </label>
            </div>
            {settings.autoMod.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.autoMod.antiSpam}
                      onChange={(e) => updateAutoModSetting('antiSpam', e.target.checked)}
                    />
                    Anti-Spam Protection
                  </label>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.autoMod.badWords}
                      onChange={(e) => updateAutoModSetting('badWords', e.target.checked)}
                    />
                    Bad Words Filter
                  </label>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.autoMod.linksBlocked}
                      onChange={(e) => updateAutoModSetting('linksBlocked', e.target.checked)}
                    />
                    Block Suspicious Links
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Logging Settings */}
          <div className="dark-card">
            <h3>Moderation Logging</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.logging.enabled}
                  onChange={(e) => updateLoggingSetting('enabled', e.target.checked)}
                />
                Enable Logging
              </label>
            </div>
            {settings.logging.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Log Channel ID</label>
                  <input
                    type="text"
                    value={settings.logging.channelId}
                    onChange={(e) => updateLoggingSetting('channelId', e.target.value)}
                    className={styles.input}
                    placeholder="Channel ID for logs"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.logging.logBans}
                      onChange={(e) => updateLoggingSetting('logBans', e.target.checked)}
                    />
                    Log Bans
                  </label>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.logging.logKicks}
                      onChange={(e) => updateLoggingSetting('logKicks', e.target.checked)}
                    />
                    Log Kicks
                  </label>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.logging.logMutes}
                      onChange={(e) => updateLoggingSetting('logMutes', e.target.checked)}
                    />
                    Log Mutes
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Punishment Settings */}
          <div className="dark-card">
            <h3>Punishment Configuration</h3>
            <div className={styles.settingGroup}>
              <label>Warnings Before Mute</label>
              <input
                type="number"
                value={settings.punishments.warningsBeforeMute}
                onChange={(e) => updatePunishmentsSetting('warningsBeforeMute', parseInt(e.target.value))}
                className={styles.input}
                min="1"
                max="10"
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Mute Duration (seconds)</label>
              <input
                type="number"
                value={settings.punishments.mutesDuration}
                onChange={(e) => updatePunishmentsSetting('mutesDuration', parseInt(e.target.value))}
                className={styles.input}
                min="60"
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Warnings Before Ban</label>
              <input
                type="number"
                value={settings.punishments.warningsBeforeBan}
                onChange={(e) => updatePunishmentsSetting('warningsBeforeBan', parseInt(e.target.value))}
                className={styles.input}
                min="1"
                max="20"
              />
            </div>
          </div>

          {/* Channel Configuration */}
          <div className="dark-card">
            <h3>Channel Settings</h3>
            <div className={styles.settingGroup}>
              <label>Moderation Log Channel</label>
              <input
                type="text"
                value={settings.channels.modLog}
                onChange={(e) => updateChannelsSetting('modLog', e.target.value)}
                className={styles.input}
                placeholder="Channel ID for mod logs"
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Member Log Channel</label>
              <input
                type="text"
                value={settings.channels.memberLog}
                onChange={(e) => updateChannelsSetting('memberLog', e.target.value)}
                className={styles.input}
                placeholder="Channel ID for member logs"
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`${styles.button} ${styles.primary}`}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}