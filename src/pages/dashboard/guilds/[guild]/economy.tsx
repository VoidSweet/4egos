import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/guild.module.css';

interface EconomySettings {
  currency: {
    name: string;
    symbol: string;
    startingBalance: number;
    maxBalance: number;
  };
  dailyRewards: {
    enabled: boolean;
    amount: number;
    cooldown: number;
  };
  workCommands: {
    enabled: boolean;
    minReward: number;
    maxReward: number;
    cooldown: number;
  };
  gambling: {
    enabled: boolean;
    minBet: number;
    maxBet: number;
  };
  shop: {
    enabled: boolean;
    items: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      role?: string;
    }>;
  };
}

export default function EconomyPage() {
  const router = useRouter();
  const { guild } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guildData, setGuildData] = useState<any>(null);
  const [settings, setSettings] = useState<EconomySettings>({
    currency: {
      name: 'Coins',
      symbol: '🪙',
      startingBalance: 100,
      maxBalance: 1000000
    },
    dailyRewards: {
      enabled: true,
      amount: 50,
      cooldown: 86400
    },
    workCommands: {
      enabled: true,
      minReward: 10,
      maxReward: 100,
      cooldown: 3600
    },
    gambling: {
      enabled: false,
      minBet: 10,
      maxBet: 1000
    },
    shop: {
      enabled: false,
      items: []
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

  const updateCurrencySetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [field]: value
      }
    }));
  };

  const updateDailyRewardsSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      dailyRewards: {
        ...prev.dailyRewards,
        [field]: value
      }
    }));
  };

  const updateWorkCommandsSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      workCommands: {
        ...prev.workCommands,
        [field]: value
      }
    }));
  };

  const updateGamblingSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      gambling: {
        ...prev.gambling,
        [field]: value
      }
    }));
  };

  const updateShopSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      shop: {
        ...prev.shop,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className="loading">Loading economy settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Economy Settings</h1>
          <p>Configure currency, rewards, and shop systems for your server</p>
        </div>

        <div className="dark-stats-grid">
          {/* Currency Settings */}
          <div className="dark-card">
            <h3>Currency Configuration</h3>
            <div className={styles.settingGroup}>
              <label>Currency Name</label>
              <input
                type="text"
                value={settings.currency.name}
                onChange={(e) => updateCurrencySetting('name', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Currency Symbol</label>
              <input
                type="text"
                value={settings.currency.symbol}
                onChange={(e) => updateCurrencySetting('symbol', e.target.value)}
                className={styles.input}
                maxLength={5}
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Starting Balance</label>
              <input
                type="number"
                value={settings.currency.startingBalance}
                onChange={(e) => updateCurrencySetting('startingBalance', parseInt(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Maximum Balance</label>
              <input
                type="number"
                value={settings.currency.maxBalance}
                onChange={(e) => updateCurrencySetting('maxBalance', parseInt(e.target.value))}
                className={styles.input}
                min="1000"
              />
            </div>
          </div>

          {/* Daily Rewards */}
          <div className="dark-card">
            <h3>Daily Rewards</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.dailyRewards.enabled}
                  onChange={(e) => updateDailyRewardsSetting('enabled', e.target.checked)}
                />
                Enable Daily Rewards
              </label>
            </div>
            {settings.dailyRewards.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Daily Amount</label>
                  <input
                    type="number"
                    value={settings.dailyRewards.amount}
                    onChange={(e) => updateDailyRewardsSetting('amount', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Cooldown (seconds)</label>
                  <input
                    type="number"
                    value={settings.dailyRewards.cooldown}
                    onChange={(e) => updateDailyRewardsSetting('cooldown', parseInt(e.target.value))}
                    className={styles.input}
                    min="3600"
                  />
                </div>
              </>
            )}
          </div>

          {/* Work Commands */}
          <div className="dark-card">
            <h3>Work Commands</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.workCommands.enabled}
                  onChange={(e) => updateWorkCommandsSetting('enabled', e.target.checked)}
                />
                Enable Work Commands
              </label>
            </div>
            {settings.workCommands.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Minimum Reward</label>
                  <input
                    type="number"
                    value={settings.workCommands.minReward}
                    onChange={(e) => updateWorkCommandsSetting('minReward', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Maximum Reward</label>
                  <input
                    type="number"
                    value={settings.workCommands.maxReward}
                    onChange={(e) => updateWorkCommandsSetting('maxReward', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Cooldown (seconds)</label>
                  <input
                    type="number"
                    value={settings.workCommands.cooldown}
                    onChange={(e) => updateWorkCommandsSetting('cooldown', parseInt(e.target.value))}
                    className={styles.input}
                    min="60"
                  />
                </div>
              </>
            )}
          </div>

          {/* Gambling */}
          <div className="dark-card">
            <h3>Gambling</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.gambling.enabled}
                  onChange={(e) => updateGamblingSetting('enabled', e.target.checked)}
                />
                Enable Gambling Commands
              </label>
            </div>
            {settings.gambling.enabled && (
              <>
                <div className={styles.settingGroup}>
                  <label>Minimum Bet</label>
                  <input
                    type="number"
                    value={settings.gambling.minBet}
                    onChange={(e) => updateGamblingSetting('minBet', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>Maximum Bet</label>
                  <input
                    type="number"
                    value={settings.gambling.maxBet}
                    onChange={(e) => updateGamblingSetting('maxBet', parseInt(e.target.value))}
                    className={styles.input}
                    min="1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Shop System */}
          <div className="dark-card">
            <h3>Shop System</h3>
            <div className={styles.settingGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.shop.enabled}
                  onChange={(e) => updateShopSetting('enabled', e.target.checked)}
                />
                Enable Shop System
              </label>
            </div>
            {settings.shop.enabled && (
              <div className={styles.settingGroup}>
                <p>Shop items configuration will be available in a future update.</p>
              </div>
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