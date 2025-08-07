import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/DashboardLayout.module.css';

interface IUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

interface IGuild {
  id: string;
  name: string;
  icon: string;
  permissions: string[];
}

interface IProps {
  user: IUser;
  guild: IGuild;
}

interface SecuritySettings {
  antiSpam: {
    enabled: boolean;
    messageLimit: number;
    timeWindow: number;
    punishment: 'mute' | 'kick' | 'ban';
  };
  antiRaid: {
    enabled: boolean;
    joinLimit: number;
    timeWindow: number;
    lockdown: boolean;
  };
  verification: {
    enabled: boolean;
    accountAge: number;
    captcha: boolean;
  };
  autoMod: {
    enabled: boolean;
    filterWords: boolean;
    filterInvites: boolean;
    filterLinks: boolean;
  };
}

export default function SecurityPage({ user, guild }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [settings, setSettings] = useState<SecuritySettings>({
    antiSpam: {
      enabled: true,
      messageLimit: 5,
      timeWindow: 10,
      punishment: 'mute'
    },
    antiRaid: {
      enabled: true,
      joinLimit: 10,
      timeWindow: 60,
      lockdown: false
    },
    verification: {
      enabled: false,
      accountAge: 7,
      captcha: false
    },
    autoMod: {
      enabled: true,
      filterWords: true,
      filterInvites: true,
      filterLinks: false
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // API call would go here
        setLoading(false);
      } catch (error) {
        console.error('Failed to load security settings:', error);
        setLoading(false);
      }
    };

    if (guild?.id) {
      loadSettings();
    }
  }, [guild?.id]);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // API call to save settings would go here
      console.log('Settings saved:', settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading security settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Security Settings - {guild.name} | 4egos Bot</title>
        <meta name="description" content={`Manage security settings for ${guild.name}`} />
      </Head>

      <DashboardLayout>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href={`/dashboard/guilds/${guild.id}`}>{guild.name}</Link>
              <span>/</span>
              <span>Security</span>
            </div>
            <h1>🔒 Security Settings</h1>
            <p>Configure your server's security and protection features</p>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Security Protection</h2>
              
              {/* Anti-Spam */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>🚫 Anti-Spam Protection</h3>
                    <p>Prevent message spam and flooding</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.antiSpam.enabled}
                      onChange={(e) => updateSetting('antiSpam.enabled', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {settings.antiSpam.enabled && (
                  <div className={styles.cardContent}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Message Limit</label>
                        <input
                          type="number"
                          value={settings.antiSpam.messageLimit}
                          onChange={(e) => updateSetting('antiSpam.messageLimit', parseInt(e.target.value))}
                          className={styles.input}
                          min="1"
                          max="20"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Time Window (seconds)</label>
                        <input
                          type="number"
                          value={settings.antiSpam.timeWindow}
                          onChange={(e) => updateSetting('antiSpam.timeWindow', parseInt(e.target.value))}
                          className={styles.input}
                          min="1"
                          max="60"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Punishment</label>
                        <select
                          value={settings.antiSpam.punishment}
                          onChange={(e) => updateSetting('antiSpam.punishment', e.target.value)}
                          className={styles.select}
                        >
                          <option value="mute">Mute</option>
                          <option value="kick">Kick</option>
                          <option value="ban">Ban</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Anti-Raid */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>🛡️ Anti-Raid Protection</h3>
                    <p>Protect against coordinated attacks and mass joins</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.antiRaid.enabled}
                      onChange={(e) => updateSetting('antiRaid.enabled', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {settings.antiRaid.enabled && (
                  <div className={styles.cardContent}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Join Limit</label>
                        <input
                          type="number"
                          value={settings.antiRaid.joinLimit}
                          onChange={(e) => updateSetting('antiRaid.joinLimit', parseInt(e.target.value))}
                          className={styles.input}
                          min="1"
                          max="50"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Time Window (seconds)</label>
                        <input
                          type="number"
                          value={settings.antiRaid.timeWindow}
                          onChange={(e) => updateSetting('antiRaid.timeWindow', parseInt(e.target.value))}
                          className={styles.input}
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={settings.antiRaid.lockdown}
                          onChange={(e) => updateSetting('antiRaid.lockdown', e.target.checked)}
                        />
                        Enable automatic server lockdown during raids
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>✅ Member Verification</h3>
                    <p>Verify new members before granting access</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.verification.enabled}
                      onChange={(e) => updateSetting('verification.enabled', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {settings.verification.enabled && (
                  <div className={styles.cardContent}>
                    <div className={styles.formGroup}>
                      <label>Minimum Account Age (days)</label>
                      <input
                        type="number"
                        value={settings.verification.accountAge}
                        onChange={(e) => updateSetting('verification.accountAge', parseInt(e.target.value))}
                        className={styles.input}
                        min="0"
                        max="365"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={settings.verification.captcha}
                          onChange={(e) => updateSetting('verification.captcha', e.target.checked)}
                        />
                        Require CAPTCHA verification
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto-Moderation */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>🤖 Auto-Moderation</h3>
                    <p>Automatically filter unwanted content</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.autoMod.enabled}
                      onChange={(e) => updateSetting('autoMod.enabled', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {settings.autoMod.enabled && (
                  <div className={styles.cardContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={settings.autoMod.filterWords}
                          onChange={(e) => updateSetting('autoMod.filterWords', e.target.checked)}
                        />
                        Filter inappropriate words and phrases
                      </label>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={settings.autoMod.filterInvites}
                          onChange={(e) => updateSetting('autoMod.filterInvites', e.target.checked)}
                        />
                        Block Discord server invites
                      </label>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={settings.autoMod.filterLinks}
                          onChange={(e) => updateSetting('autoMod.filterLinks', e.target.checked)}
                        />
                        Filter suspicious links
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionBar}>
            <button 
              onClick={() => router.push(`/dashboard/guilds/${guild.id}`)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className={styles.saveButton}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {saveStatus !== 'idle' && (
            <div className={`${styles.notification} ${styles[saveStatus]}`}>
              {saveStatus === 'saved' && '✅ Changes saved successfully!'}
              {saveStatus === 'error' && '❌ Error saving changes. Please try again.'}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const { guild } = context.query;

  if (!cookies.accessToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user: IUser = {
    id: '123456789',
    username: 'TestUser',
    avatar: 'avatar.png',
    discriminator: '1234',
  };

  const guildData: IGuild = {
    id: guild as string,
    name: 'Test Server',
    icon: 'guild_icon.png',
    permissions: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  };

  return {
    props: {
      user,
      guild: guildData,
    },
  };
};
