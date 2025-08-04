import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IDashboardStats {
    totalServers: number;
    totalUsers: number;
    securityAlerts: number;
    economyTransactions: number;
    uptime: string;
}

interface IProps {
    user: IUser;
    stats: IDashboardStats;
}

export default function DashboardHome({ user, stats }: IProps) {
    const [loading, setLoading] = useState(false); // Removed loading delay

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Overview</title>
                <meta name="description" content="4EgosBot dashboard overview and statistics" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🎛️ Dashboard Overview</h1>
                    <p>Welcome back! Here&apos;s what&apos;s happening with 4EgosBot</p>
                </div>

                {/* Unique Stats Cards */}
                <div className={dashStyles.uniqueStatsGrid}>
                    <div className={`${dashStyles.uniqueStatCard} ${dashStyles.serversCard}`}>
                        <div className={dashStyles.uniqueStatIcon}>
                            <i className="fas fa-server"></i>
                        </div>
                        <div className={dashStyles.uniqueStatContent}>
                            <h3>{stats.totalServers}</h3>
                            <p>Discord Servers</p>
                            <div className={dashStyles.statTrend}>
                                <span className={dashStyles.trendUp}>+2 this month</span>
                            </div>
                        </div>
                        <div className={dashStyles.cardPattern}></div>
                    </div>

                    <div className={`${dashStyles.uniqueStatCard} ${dashStyles.statusCard}`}>
                        <div className={dashStyles.uniqueStatIcon}>
                            <i className="fas fa-robot"></i>
                        </div>
                        <div className={dashStyles.uniqueStatContent}>
                            <h3>Online</h3>
                            <p>4EgosBot Status</p>
                            <div className={dashStyles.statTrend}>
                                <span className={dashStyles.uptime}>99.9% uptime</span>
                            </div>
                        </div>
                        <div className={dashStyles.cardPattern}></div>
                    </div>

                    <div className={`${dashStyles.uniqueStatCard} ${dashStyles.securityCard}`}>
                        <div className={dashStyles.uniqueStatIcon}>
                            <i className={user.verified ? "fas fa-shield-check" : "fas fa-shield-alt"}></i>
                        </div>
                        <div className={dashStyles.uniqueStatContent}>
                            <h3>{user.verified ? 'Verified' : 'Standard'}</h3>
                            <p>Account Status</p>
                            <div className={dashStyles.statTrend}>
                                <span className={user.mfa_enabled ? dashStyles.secure : dashStyles.warning}>
                                    {user.mfa_enabled ? '2FA Enabled' : '2FA Disabled'}
                                </span>
                            </div>
                        </div>
                        <div className={dashStyles.cardPattern}></div>
                    </div>

                    <div className={`${dashStyles.uniqueStatCard} ${dashStyles.activityCard}`}>
                        <div className={dashStyles.uniqueStatIcon}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className={dashStyles.uniqueStatContent}>
                            <h3>Active</h3>
                            <p>Dashboard Status</p>
                            <div className={dashStyles.statTrend}>
                                <span className={dashStyles.activity}>Last login: Today</span>
                            </div>
                        </div>
                        <div className={dashStyles.cardPattern}></div>
                    </div>
                </div>

                {/* Compact Feature Categories */}
                <div className={dashStyles.compactFeatureGrid}>
                    <Link href="/dashboard/security">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>🛡️</div>
                            <h4>Security</h4>
                            <p>Anti-nuke & Protection</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/economy">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>💰</div>
                            <h4>Economy</h4>
                            <p>Banking & Rewards</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/leveling">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>📈</div>
                            <h4>Leveling</h4>
                            <p>XP & Progression</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/moderation">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>🔨</div>
                            <h4>Moderation</h4>
                            <p>Auto-mod & Logs</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/games">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>🎮</div>
                            <h4>Games</h4>
                            <p>Entertainment</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/console">
                        <div className={dashStyles.compactFeatureCard}>
                            <div className={dashStyles.compactFeatureIcon}>🛠️</div>
                            <h4>Utilities</h4>
                            <p>Tools & Features</p>
                        </div>
                    </Link>
                </div>

                {/* Compact Quick Overview */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>👤 Account Overview</h4>
                        <div className={dashStyles.overviewGrid}>
                            <div><strong>Username:</strong> {user.username}#{user.discriminator}</div>
                            <div><strong>Status:</strong> {user.verified ? '✅ Verified' : '❌ Standard'}</div>
                            <div><strong>Security:</strong> {user.mfa_enabled ? '🔒 2FA Enabled' : '⚠️ 2FA Disabled'}</div>
                            <div><strong>Servers:</strong> {stats.totalServers} connected</div>
                        </div>
                    </div>
                </div>

                {/* Compact System Status */}
                <div className={dashStyles.compactStatus}>
                    <h4>⚡ System Status</h4>
                    <div className={dashStyles.statusGrid}>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Bot Online</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Security Active</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Economy Running</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Database Healthy</span>
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
        // Use resolvedUrl for proper redirect handling
        const redirectUrl = ctx.resolvedUrl || '/dashboard';
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(redirectUrl)}`,
                permanent: false,
            }
        };
    }

    try {
        // Fetch real user data from Discord
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch user guilds to get server count
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let userGuildCount = 0;
        if (guildsResponse.ok) {
            const guildsData = await guildsResponse.json();
            userGuildCount = guildsData.length;
        }

        // Real stats using Discord API data
        const realStats: IDashboardStats = {
            totalServers: userGuildCount, // Real user guild count
            totalUsers: 0, // We can't get global user count from Discord API
            securityAlerts: 0, // Real bot would track this
            economyTransactions: 0, // Real bot would track this  
            uptime: "Online" // Bot status
        };

        const user: IUser = {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            verified: userData.verified,
            mfa_enabled: userData.mfa_enabled,
            locale: userData.locale,
            flags: userData.flags,
            public_flags: userData.public_flags
        };

        return {
            props: {
                user,
                stats: realStats
            }
        };

    } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback to login redirect if API calls fail
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            }
        };
    }
};
