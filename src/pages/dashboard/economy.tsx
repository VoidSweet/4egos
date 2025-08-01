import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Header from '../../components/Header';
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

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSaving(false);
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

            <Header {...{user}} />
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>💰 Economy System</h1>
                    <p>Manage your server's complete economic ecosystem with detailed analytics.</p>
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
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.req.url)}`,
                permanent: false,
            }
        };
    }

    const mockStats: IEconomyStats = {
        totalCirculation: 1500000,
        averageBalance: 2500,
        richestUser: {
            username: "EconomyKing",
            balance: 50000
        },
        dailyTransactions: 245,
        weeklyGrowth: "+15%",
        bankDeposits: 750000,
        totalLoans: 25000
    };

    const mockConfig: IEconomyConfig = {
        enabled: true,
        primaryCurrency: {
            name: "AegisCoins",
            symbol: "🪙",
            startingBalance: 1000,
            maxBalance: 1000000
        },
        dailyBonus: {
            enabled: true,
            baseAmount: 100,
            streakMultiplier: 1.1,
            maxStreakBonus: 2.0
        },
        messageRewards: {
            enabled: true,
            baseReward: 5,
            cooldownSeconds: 60,
            maxPerDay: 500
        },
        banking: {
            enabled: true,
            interestRate: 0.05,
            minimumDeposit: 100,
            maximumDeposit: 50000
        }
    };

    const mockUser: IUser = {
        id: "123456789",
        username: "AegisAdmin",
        discriminator: "0001",
        avatar: null,
        verified: true,
        mfa_enabled: true,
        locale: "en-US",
        flags: 0,
        public_flags: 0
    };

    return {
        props: {
            user: mockUser,
            stats: mockStats,
            config: mockConfig
        }
    };
};
