import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import Toggle, { CheckRadio } from '../../components/Toggle';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IEconomyStats {
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
}

interface IEconomyConfig {
    enabled: boolean;
    primaryCurrency: {
        name: string;
        symbol: string;
        startingBalance: number;
        maxBalance: number;
    };
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
    banking: {
        enabled: boolean;
        interestRate: number;
        minimumDeposit: number;
        maximumDeposit: number;
    };
}

interface IProps {
    user: IUser;
    stats: IEconomyStats;
    config: IEconomyConfig;
}

export default function EconomyDashboard({ user, stats, config }: IProps) {
    const [loading, setLoading] = useState(true);
    const [economyConfig, setEconomyConfig] = useState<IEconomyConfig>(config);
    const [saving, setSaving] = useState(false);
    const [selectedGuildId, setSelectedGuildId] = useState<string>('');
    const [userGuilds, setUserGuilds] = useState<any[]>([]);

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const response = await fetch('/api/discord/guilds');
                if (response.ok) {
                    const guilds = await response.json();
                    setUserGuilds(guilds.filter((g: any) => g.permissions_new & 0x20));
                }
            } catch (error) {
                console.error('Failed to fetch guilds:', error);
            }
        };
        fetchGuilds();
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleGuildSelect = async (guildId: string) => {
        setSelectedGuildId(guildId);
        setLoading(true);
        try {
            const response = await fetch(`/api/guilds/${guildId}/economy`);
            if (response.ok) {
                const guildConfig = await response.json();
                setEconomyConfig(guildConfig);
            }
        } catch (error) {
            console.error('Failed to fetch guild economy config:', error);
        } finally {
            setLoading(false);
        }
    };

    const isConfigDisabled = !selectedGuildId;

    const handleSave = async () => {
        if (!selectedGuildId) {
            alert('Please select a server first!');
            return;
        }
        setSaving(true);
        try {
            const response = await fetch(`/api/guilds/${selectedGuildId}/economy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(economyConfig)
            });
            if (response.ok) {
                alert('Economy settings saved successfully!');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>AegisBot Dashboard - Economy System</title>
                <meta name="description" content="Comprehensive economy management for Discord servers" />
            </Head>

            <LeftMenu {...{user}} saveButton={!!selectedGuildId} onSave={handleSave} saving={saving} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>💰 Economy System</h1>
                    <p>Manage your server's complete economic ecosystem with detailed analytics.</p>
                </div>

                {/* Server Selection */}
                <div className={dashStyles.serverSelection}>
                    <h3>Select a Server to Configure:</h3>
                    <select 
                        value={selectedGuildId} 
                        onChange={(e) => handleGuildSelect(e.target.value)}
                        className={dashStyles.serverSelect}
                    >
                        <option value="">Choose a server...</option>
                        {userGuilds.map(guild => (
                            <option key={guild.id} value={guild.id}>
                                {guild.name}
                            </option>
                        ))}
                    </select>
                    {!selectedGuildId && (
                        <p className={dashStyles.helpText}>
                            ⚠️ Please select a server to configure economy settings.
                        </p>
                    )}
                </div>

                {/* Economy Stats */}
                <div className={dashStyles.statsGrid}>
                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>💰</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.totalCirculation.toLocaleString()}</h3>
                            <p>Total Circulation</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>📊</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.averageBalance.toLocaleString()}</h3>
                            <p>Average Balance</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🏆</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.richestUser.balance.toLocaleString()}</h3>
                            <p>Richest User</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>📈</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.weeklyGrowth}</h3>
                            <p>Weekly Growth</p>
                        </div>
                    </div>
                </div>

                {/* Economy Configuration */}
                <div className={styles['small-card']}>
                    <h2>🎛️ Economy Configuration</h2>
                    
                    <CheckRadio>
                        <Toggle 
                            defaultChecked={economyConfig.enabled}
                            disabled={isConfigDisabled}
                            onChange={(checked) => setEconomyConfig(prev => ({
                                ...prev,
                                enabled: checked
                            }))}
                        />
                        <label><strong>Enable Economy System</strong></label>
                        <p>Allow users to earn, spend, and manage virtual currency</p>
                    </CheckRadio>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                padding: '15px 40px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Save Economy Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className={dashStyles.activitySection}>
                    <h2>💸 Recent Transactions</h2>
                    <div className={dashStyles.activityGrid}>
                        <div className={dashStyles.activityCard}>
                            <h4>💰 Daily Bonuses</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>2 min ago</span>
                                <span>User claimed daily bonus (+150 AegisCoins)</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>5 min ago</span>
                                <span>7-day streak bonus (+300 AegisCoins)</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>8 min ago</span>
                                <span>Daily bonus claimed (+100 AegisCoins)</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>🏪 Shop Purchases</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>3 min ago</span>
                                <span>VIP Role purchased (-5000 AegisCoins)</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>12 min ago</span>
                                <span>Custom Color Role (-2000 AegisCoins)</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>18 min ago</span>
                                <span>Lottery Ticket purchased (-100 AegisCoins)</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>🏦 Banking Activity</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>1 min ago</span>
                                <span>Bank deposit: +10000 AegisCoins</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>6 min ago</span>
                                <span>Interest payment: +25 AegisCoins</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>15 min ago</span>
                                <span>Bank withdrawal: -5000 AegisCoins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    
    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }

    try {
        // Fetch real user data from Discord
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        
        return {
            props: {
                user: {
                    id: userData.id,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    verified: userData.verified,
                    public_flags: userData.public_flags
                }
            }
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }
};
    }

    

    

    

    return {
        props: {
            user: mockUser,
            stats: mockStats,
            config: mockConfig
        }
    };
};
