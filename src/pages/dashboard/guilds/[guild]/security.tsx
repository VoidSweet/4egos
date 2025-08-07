import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/guild.module.css';

interface SecuritySettings {
  antiSpam: {
    enabled: boolean;
    messageLimit: number;
    timeWindow: number;
  };
  antiRaid: {
    enabled: boolean;
    joinLimit: number;
    timeWindow: number;
  };
  verification: {
    enabled: boolean;
    level: number;
    roleId: string;
  };
  autoMod: {
    enabled: boolean;
    deleteInvites: boolean;
    deleteMassMentions: boolean;
  };
}

export default function SecurityPage() {
  const router = useRouter();
  const { guild } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    antiSpam: {
      enabled: false,
      messageLimit: 5,
      timeWindow: 10
    },
    antiRaid: {
      enabled: false,
      joinLimit: 10,
      timeWindow: 60
    },
    verification: {
      enabled: false,
      level: 1,
      roleId: ''
    },
    autoMod: {
      enabled: false,
      deleteInvites: false,
      deleteMassMentions: false
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

  const updateAntiSpamSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      antiSpam: {
        ...prev.antiSpam,
        [field]: value
      }
    }));
  };

  const updateAntiRaidSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      antiRaid: {
        ...prev.antiRaid,
        [field]: value
      }
    }));
  };

  const updateVerificationSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [field]: value
      }
    }));
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className="loading">Loading security settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Security Settings</h1>
          <p>Configure anti-spam, anti-raid, and verification systems</p>
        </div>

        <div className="dark-stats-grid">
          {/* Anti-Spam */}
          <div className="dark-card">
            <h3>Anti-Spam Protection</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.antiSpam.enabled}
                  onChange={(e) => updateAntiSpamSetting('enabled', e.target.checked)}
                />
                Enable Anti-Spam
              </label>
            </div>
            {settings.antiSpam.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Message Limit</label>
                  <input
                    type="number"
                    value={settings.antiSpam.messageLimit}
                    onChange={(e) => updateAntiSpamSetting('messageLimit', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                    max="20"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Time Window (seconds)</label>
                  <input
                    type="number"
                    value={settings.antiSpam.timeWindow}
                    onChange={(e) => updateAntiSpamSetting('timeWindow', parseInt(e.target.value))}
                    className={styles.input}
                    min="5"
                    max="60"
                  />
                </div>
              </>
            )}
          </div>

          {/* Anti-Raid */}
          <div className="dark-card">
            <h3>Anti-Raid Protection</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.antiRaid.enabled}
                  onChange={(e) => updateAntiRaidSetting('enabled', e.target.checked)}
                />
                Enable Anti-Raid
              </label>
            </div>
            {settings.antiRaid.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Join Limit</label>
                  <input
                    type="number"
                    value={settings.antiRaid.joinLimit}
                    onChange={(e) => updateAntiRaidSetting('joinLimit', parseInt(e.target.value))}
                    className={styles.input}
                    min="5"
                    max="50"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Time Window (seconds)</label>
                  <input
                    type="number"
                    value={settings.antiRaid.timeWindow}
                    onChange={(e) => updateAntiRaidSetting('timeWindow', parseInt(e.target.value))}
                    className={styles.input}
                    min="30"
                    max="300"
                  />
                </div>
              </>
            )}
          </div>

          {/* Verification */}
          <div className="dark-card">
            <h3>Member Verification</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.verification.enabled}
                  onChange={(e) => updateVerificationSetting('enabled', e.target.checked)}
                />
                Enable Verification
              </label>
            </div>
            {settings.verification.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Verification Level</label>
                  <select
                    value={settings.verification.level}
                    onChange={(e) => updateVerificationSetting('level', parseInt(e.target.value))}
                    className={styles.input}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                </div>
                <div className={styles.settingGroup}>
                  <label>Verified Role ID</label>
                  <input
                    type="text"
                    value={settings.verification.roleId}
                    onChange={(e) => updateVerificationSetting('roleId', e.target.value)}
                    className={styles.input}
                    placeholder="Role ID to assign after verification"
                  />
                </div>
              </>
            )}
          </div>

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
                      checked={settings.autoMod.deleteInvites}
                      onChange={(e) => updateAutoModSetting('deleteInvites', e.target.checked)}
                    />
                    Delete Discord Invites
                  </label>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.autoMod.deleteMassMentions}
                      onChange={(e) => updateAutoModSetting('deleteMassMentions', e.target.checked)}
                    />
                    Delete Mass Mentions
                  </label>
                </div>
              </>
            )}
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