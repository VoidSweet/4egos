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

interface EconomySettings {
  enabled: boolean;
  currency: {
    name: string;
    symbol: string;
    emoji: string;
    startingBalance: number;
    maxBalance: number;
    transferEnabled: boolean;
  };
  incomeSource: {
    dailyBonus: {
      enabled: boolean;
      baseAmount: number;
      streakMultiplier: number;
      maxStreakBonus: number;
    };
    messageRewards: {
      enabled: boolean;
      baseReward: number;
      cooldownSeconds: number;
      maxPerDay: number;
    };
    voiceRewards: {
      enabled: boolean;
      rewardPerMinute: number;
      minimumUsers: number;
      maxPerSession: number;
    };
  };
  gambling: {
    enabled: boolean;
    minBet: number;
    maxBet: number;
    houseEdge: number;
  };
  banking: {
    enabled: boolean;
    interestRate: number;
    minimumDeposit: number;
  };
  shop: {
    enabled: boolean;
    categories: Array<{
      name: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        description: string;
      }>;
    }>;
    roles: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
}

interface EconomyStats {
  totalCirculation: number;
  averageBalance: number;
  richestUser: {
    username: string;
    balance: number;
  };
  dailyTransactions: number;
  weeklyGrowth: string;
  bankDeposits: number;
  totalLoans: number;
  topUsers: Array<{
    username: string;
    balance: number;
  }>;
}

export default function EconomyPage({ user, guild }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState<EconomySettings>({
    enabled: true,
    currency: {
      name: 'Coins',
      symbol: '🪙',
      emoji: '🪙',
      startingBalance: 1000,
      maxBalance: 1000000,
      transferEnabled: true
    },
    incomeSource: {
      dailyBonus: {
        enabled: true,
        baseAmount: 100,
        streakMultiplier: 1.1,
        maxStreakBonus: 500
      },
      messageRewards: {
        enabled: true,
        baseReward: 5,
        cooldownSeconds: 60,
        maxPerDay: 500
      },
      voiceRewards: {
        enabled: true,
        rewardPerMinute: 2,
        minimumUsers: 2,
        maxPerSession: 100
      }
    },
    gambling: {
      enabled: true,
      minBet: 10,
      maxBet: 1000,
      houseEdge: 0.05
    },
    banking: {
      enabled: true,
      interestRate: 0.05,
      minimumDeposit: 100
    },
    shop: {
      enabled: true,
      categories: [
        {
          name: 'Items',
          items: [
            { id: '1', name: 'Lucky Charm', price: 500, description: 'Increases luck in gambling' }
          ]
        }
      ],
      roles: []
    }
  });

  const [stats, setStats] = useState<EconomyStats>({
    totalCirculation: 1500000,
    averageBalance: 2500,
    richestUser: {
      username: 'EconomyKing',
      balance: 50000
    },
    dailyTransactions: 150,
    weeklyGrowth: '+12.5%',
    bankDeposits: 750000,
    totalLoans: 125000,
    topUsers: [
      { username: 'EconomyKing', balance: 50000 },
      { username: 'CoinCollector', balance: 35000 },
      { username: 'MoneyMaker', balance: 28000 }
    ]
  });

  useEffect(() => {
    // Load economy settings
    const loadSettings = async () => {
      try {
        // API call would go here
        setLoading(false);
      } catch (error) {
        console.error('Failed to load economy settings:', error);
        setLoading(false);
      }
    };

    if (guild?.id) {
      loadSettings();
    }
  }, [guild?.id]);

  const handleSave = async () => {
    try {
      // API call to save settings would go here
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSettings = (path: string, value: any) => {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading economy settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Economy System - {guild.name} | 4egos Bot</title>
        <meta name="description" content={`Manage economy system for ${guild.name}`} />
      </Head>

      <DashboardLayout>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href={`/dashboard/guilds/${guild.id}`}>{guild.name}</Link>
              <span>/</span>
              <span>Economy</span>
            </div>
            <h1>Economy System</h1>
            <p>Configure your server's economy system, currency, and income sources.</p>
          </div>

          <div className={styles.tabContainer}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'currency' ? styles.active : ''}`}
                onClick={() => setActiveTab('currency')}
              >
                Currency
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'income' ? styles.active : ''}`}
                onClick={() => setActiveTab('income')}
              >
                Income Sources
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'gambling' ? styles.active : ''}`}
                onClick={() => setActiveTab('gambling')}
              >
                Gambling
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'banking' ? styles.active : ''}`}
                onClick={() => setActiveTab('banking')}
              >
                Banking
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'shop' ? styles.active : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                Shop
              </button>
            </div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.section}>
                <h2>Economy Overview</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h3>Total Circulation</h3>
                    <p className={styles.statValue}>{stats.totalCirculation.toLocaleString()}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Average Balance</h3>
                    <p className={styles.statValue}>{stats.averageBalance.toLocaleString()}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Richest User</h3>
                    <p className={styles.statValue}>{stats.richestUser.username}</p>
                    <p className={styles.statSubValue}>{stats.richestUser.balance.toLocaleString()}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Daily Transactions</h3>
                    <p className={styles.statValue}>{stats.dailyTransactions}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Weekly Growth</h3>
                    <p className={styles.statValue}>{stats.weeklyGrowth}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Bank Deposits</h3>
                    <p className={styles.statValue}>{stats.bankDeposits.toLocaleString()}</p>
                  </div>
                </div>

                <div className={styles.section}>
                  <h3>Top Users</h3>
                  <div className={styles.userList}>
                    {stats.topUsers.map((user, index) => (
                      <div key={index} className={styles.userItem}>
                        <span className={styles.rank}>#{index + 1}</span>
                        <span className={styles.username}>{user.username}</span>
                        <span className={styles.balance}>{user.balance.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'currency' && (
              <div className={styles.section}>
                <h2>Currency Settings</h2>
                <div className={styles.formGroup}>
                  <label>Currency Name</label>
                  <input
                    type="text"
                    value={settings.currency.name}
                    onChange={(e) => updateSettings('currency.name', e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency.symbol}
                    onChange={(e) => updateSettings('currency.symbol', e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency Emoji</label>
                  <input
                    type="text"
                    value={settings.currency.emoji}
                    onChange={(e) => updateSettings('currency.emoji', e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Starting Balance</label>
                  <input
                    type="number"
                    value={settings.currency.startingBalance}
                    onChange={(e) => updateSettings('currency.startingBalance', parseInt(e.target.value))}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Maximum Balance</label>
                  <input
                    type="number"
                    value={settings.currency.maxBalance}
                    onChange={(e) => updateSettings('currency.maxBalance', parseInt(e.target.value))}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={settings.currency.transferEnabled}
                      onChange={(e) => updateSettings('currency.transferEnabled', e.target.checked)}
                    />
                    Enable user-to-user transfers
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className={styles.section}>
                <h2>Income Sources</h2>
                
                <div className={styles.subsection}>
                  <h3>Daily Bonus</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.incomeSource.dailyBonus.enabled}
                        onChange={(e) => updateSettings('incomeSource.dailyBonus.enabled', e.target.checked)}
                      />
                      Enable daily bonus
                    </label>
                  </div>
                  {settings.incomeSource.dailyBonus.enabled && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Base Amount</label>
                        <input
                          type="number"
                          value={settings.incomeSource.dailyBonus.baseAmount}
                          onChange={(e) => updateSettings('incomeSource.dailyBonus.baseAmount', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Streak Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.incomeSource.dailyBonus.streakMultiplier}
                          onChange={(e) => updateSettings('incomeSource.dailyBonus.streakMultiplier', parseFloat(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Max Streak Bonus</label>
                        <input
                          type="number"
                          value={settings.incomeSource.dailyBonus.maxStreakBonus}
                          onChange={(e) => updateSettings('incomeSource.dailyBonus.maxStreakBonus', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.subsection}>
                  <h3>Message Rewards</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.incomeSource.messageRewards.enabled}
                        onChange={(e) => updateSettings('incomeSource.messageRewards.enabled', e.target.checked)}
                      />
                      Enable message rewards
                    </label>
                  </div>
                  {settings.incomeSource.messageRewards.enabled && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Base Reward</label>
                        <input
                          type="number"
                          value={settings.incomeSource.messageRewards.baseReward}
                          onChange={(e) => updateSettings('incomeSource.messageRewards.baseReward', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Cooldown (seconds)</label>
                        <input
                          type="number"
                          value={settings.incomeSource.messageRewards.cooldownSeconds}
                          onChange={(e) => updateSettings('incomeSource.messageRewards.cooldownSeconds', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Max Per Day</label>
                        <input
                          type="number"
                          value={settings.incomeSource.messageRewards.maxPerDay}
                          onChange={(e) => updateSettings('incomeSource.messageRewards.maxPerDay', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.subsection}>
                  <h3>Voice Rewards</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.incomeSource.voiceRewards.enabled}
                        onChange={(e) => updateSettings('incomeSource.voiceRewards.enabled', e.target.checked)}
                      />
                      Enable voice channel rewards
                    </label>
                  </div>
                  {settings.incomeSource.voiceRewards.enabled && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Reward Per Minute</label>
                        <input
                          type="number"
                          value={settings.incomeSource.voiceRewards.rewardPerMinute}
                          onChange={(e) => updateSettings('incomeSource.voiceRewards.rewardPerMinute', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Minimum Users Required</label>
                        <input
                          type="number"
                          value={settings.incomeSource.voiceRewards.minimumUsers}
                          onChange={(e) => updateSettings('incomeSource.voiceRewards.minimumUsers', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Max Per Session</label>
                        <input
                          type="number"
                          value={settings.incomeSource.voiceRewards.maxPerSession}
                          onChange={(e) => updateSettings('incomeSource.voiceRewards.maxPerSession', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gambling' && (
              <div className={styles.section}>
                <h2>Gambling Settings</h2>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={settings.gambling.enabled}
                      onChange={(e) => updateSettings('gambling.enabled', e.target.checked)}
                    />
                    Enable gambling features
                  </label>
                </div>
                {settings.gambling.enabled && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Minimum Bet</label>
                      <input
                        type="number"
                        value={settings.gambling.minBet}
                        onChange={(e) => updateSettings('gambling.minBet', parseInt(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Maximum Bet</label>
                      <input
                        type="number"
                        value={settings.gambling.maxBet}
                        onChange={(e) => updateSettings('gambling.maxBet', parseInt(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>House Edge (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.gambling.houseEdge}
                        onChange={(e) => updateSettings('gambling.houseEdge', parseFloat(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'banking' && (
              <div className={styles.section}>
                <h2>Banking Settings</h2>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={settings.banking.enabled}
                      onChange={(e) => updateSettings('banking.enabled', e.target.checked)}
                    />
                    Enable banking system
                  </label>
                </div>
                {settings.banking.enabled && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.banking.interestRate}
                        onChange={(e) => updateSettings('banking.interestRate', parseFloat(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Minimum Deposit</label>
                      <input
                        type="number"
                        value={settings.banking.minimumDeposit}
                        onChange={(e) => updateSettings('banking.minimumDeposit', parseInt(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className={styles.section}>
                <h2>Shop Settings</h2>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={settings.shop.enabled}
                      onChange={(e) => updateSettings('shop.enabled', e.target.checked)}
                    />
                    Enable shop system
                  </label>
                </div>
                {settings.shop.enabled && (
                  <div className={styles.subsection}>
                    <h3>Shop Categories</h3>
                    <p>Configure shop categories and items here.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.actionBar}>
            <button onClick={handleSave} className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const { guild } = context.query;

  // Simulate authentication check
  if (!cookies.accessToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Simulate user and guild data
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
