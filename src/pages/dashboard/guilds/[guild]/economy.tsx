import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../styles/GuildDashboard.module.css';
import { IUser } from '../../../../types';

interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    memberCount?: number;
    botPresent?: boolean;
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
        jobSystem: {
            enabled: boolean;
            cooldownHours: number;
            jobs: Array<{
                name: string;
                basePay: number;
                variance: number;
                requiredLevel: number;
                successRate: number;
            }>;
        };
    };
    banking: {
        enabled: boolean;
        interestRate: number;
        minimumDeposit: number;
        maximumDeposit: number;
        withdrawalFeePercent: number;
        loanSystem: {
            enabled: boolean;
            maxLoanAmount: number;
            interestRate: number;
            maxDurationDays: number;
        };
    };
    shop: {
        enabled: boolean;
        categories: Array<{
            name: string;
            items: Array<{
                id: string;
                name: string;
                price: number;
                currency: string;
                type: string;
                stock: string | number;
                description: string;
            }>;
        }>;
    };
}

interface EconomyStats {
    totalCirculation: number;
    averageBalance: number;
    richestUser: {
        userId: string;
        username: string;
        balance: number;
    };
    dailyTransactions: number;
    weeklyGrowth: string;
    bankDeposits: number;
    totalLoans: number;
    topUsers: Array<{
        userId: string;
        username: string;
        balance: number;
        rank: number;
    }>;
}

interface IProps {
    user: IUser;
    guild: IGuild;
}

export default function EconomyPage({ user, guild }: IProps) {
    const router = useRouter();
    const { guild: guildId } = router.query;
    
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [settings, setSettings] = useState<EconomySettings>({
        enabled: true,
        currency: {
            name: 'AegisCoins',
            symbol: '🪙',
            emoji: '<:aegiscoin:123456789>',
            startingBalance: 1000,
            maxBalance: 1000000,
            transferEnabled: true
        },
        incomeSource: {
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
            voiceRewards: {
                enabled: true,
                rewardPerMinute: 2,
                minimumUsers: 2,
                maxPerSession: 120
            },
            jobSystem: {
                enabled: true,
                cooldownHours: 8,
                jobs: [
                    { name: 'Miner', basePay: 200, variance: 50, requiredLevel: 1, successRate: 0.8 },
                    { name: 'Trader', basePay: 350, variance: 100, requiredLevel: 10, successRate: 0.7 },
                    { name: 'Banker', basePay: 500, variance: 75, requiredLevel: 25, successRate: 0.9 }
                ]
            }
        },
        banking: {
            enabled: true,
            interestRate: 0.05,
            minimumDeposit: 100,
            maximumDeposit: 50000,
            withdrawalFeePercent: 0.02,
            loanSystem: {
                enabled: true,
                maxLoanAmount: 10000,
                interestRate: 0.15,
                maxDurationDays: 30
            }
        },
        shop: {
            enabled: true,
            categories: [
                {
                    name: 'Roles',
                    items: [
                        {
                            id: 'vip_role',
                            name: 'VIP Access',
                            price: 5000,
                            currency: 'AegisCoins',
                            type: 'role',
                            stock: 'unlimited',
                            description: 'Get VIP access with special perks!'
                        }
                    ]
                }
            ]
        }
    });
    
    const [stats, setStats] = useState<EconomyStats>({
        totalCirculation: 1500000,
        averageBalance: 2500,
        richestUser: {
            userId: '123456789',
            username: 'EconomyKing',
            balance: 50000
        },
        dailyTransactions: 245,
        weeklyGrowth: '+15%',
        bankDeposits: 750000,
        totalLoans: 25000,
        topUsers: []
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (guildId) {
            fetchEconomySettings();
            fetchEconomyStats();
        }
    }, [guildId]);

    const fetchEconomySettings = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/economy/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching economy settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEconomyStats = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/economy/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching economy stats:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/bot/${guildId}/economy/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Economy settings saved successfully!');
                fetchEconomyStats(); // Refresh stats
            } else {
                alert('Failed to save economy settings');
            }
        } catch (error) {
            console.error('Error saving economy settings:', error);
            alert('Failed to save economy settings');
        } finally {
            setSaving(false);
        }
    };

    const resetEconomy = async () => {
        if (confirm('This will reset ALL economy data including user balances. Are you sure?')) {
            try {
                const response = await fetch(`/api/bot/${guildId}/economy/reset`, {
                    method: 'POST'
                });
                if (response.ok) {
                    alert('Economy reset successfully!');
                    fetchEconomyStats();
                }
            } catch (error) {
                console.error('Error resetting economy:', error);
            }
        }
    };

    const addJob = () => {
        const newJob = {
            name: 'New Job',
            basePay: 100,
            variance: 25,
            requiredLevel: 1,
            successRate: 0.8
        };
        const newSettings = { ...settings };
        newSettings.incomeSource.jobSystem.jobs.push(newJob);
        setSettings(newSettings);
    };

    const removeJob = (index: number) => {
        const newSettings = { ...settings };
        newSettings.incomeSource.jobSystem.jobs.splice(index, 1);
        setSettings(newSettings);
    };

    const updateSetting = (path: string[], value: any) => {
        const newSettings = JSON.parse(JSON.stringify(settings));
        let current = newSettings;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setSettings(newSettings);
    };

    const getGuildIconUrl = () => {
        if (guild.icon) {
            return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
        }
        return '/images/default_server_icon.svg';
    };

    const getUserAvatarUrl = () => {
        if (user.avatar) {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
        }
        return '/images/default_avatar.svg';
    };

    const formatCurrency = (amount: number) => {
        return `${settings.currency.symbol} ${amount.toLocaleString()}`;
    };

    return (
        <>
            <Head>
                <title>Economy System - {guild.name} - Aegis</title>
                <meta name="description" content={`Economy management for ${guild.name}`} />
            </Head>

            <div className={styles.guildDashboard}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Link href="/" className={styles.brand}>
                            🛡️ <span>Aegis</span>
                        </Link>
                        
                        <div className={styles.guildSelector}>
                            <img 
                                src={getGuildIconUrl()} 
                                alt={guild.name}
                                className={styles.guildIcon}
                            />
                            <span className={styles.guildName}>{guild.name}</span>
                            <Link href="/dashboard" className={styles.changeGuild}>
                                <i className="fas fa-exchange-alt"></i>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.userInfo}>
                            <img 
                                src={getUserAvatarUrl()} 
                                alt={user.username}
                                className={styles.userAvatar}
                            />
                            <span className={styles.username}>
                                {user.username}
                                {user.discriminator !== '0' && `#${user.discriminator}`}
                            </span>
                            <button 
                                className={styles.userDropdownBtn}
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                            >
                                <i className="fas fa-chevron-down"></i>
                            </button>
                            
                            {showUserDropdown && (
                                <div className={styles.userDropdown}>
                                    <Link href="/dashboard/@me" className={styles.dropdownItem}>
                                        <i className="fas fa-user"></i>
                                        Profile
                                    </Link>
                                    <Link href="/dashboard/billing" className={styles.dropdownItem}>
                                        <i className="fas fa-credit-card"></i>
                                        Billing
                                    </Link>
                                    <Link href="/dashboard" className={styles.dropdownItem}>
                                        <i className="fas fa-server"></i>
                                        Server Selection
                                    </Link>
                                    <hr className={styles.dropdownDivider} />
                                    <a href="/api/auth/logout" className={styles.dropdownItem}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className={styles.layout}>
                    {/* Sidebar */}
                    <nav className={styles.sidebar}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.sidebarSection}>
                                <h4>Server Management</h4>
                                <div className={styles.sidebarLinks}>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/home`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-home"></i>
                                        <span>Overview</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/settings`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-cog"></i>
                                        <span>General Settings</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/economy`}
                                        className={`${styles.sidebarLink} ${styles.active}`}
                                    >
                                        <i className="fas fa-coins"></i>
                                        <span>Economy</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/leveling`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-chart-line"></i>
                                        <span>Leveling</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/security`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Security</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/moderation`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-gavel"></i>
                                        <span>Moderation</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className={styles.main}>
                        <div className={styles.pageHeader}>
                            <h1>
                                <i className="fas fa-coins"></i>
                                Economy System
                            </h1>
                            <p>Manage your server's complete economic ecosystem</p>
                            <div className={styles.headerActions}>
                                <button
                                    className={`${styles.button} ${styles.buttonDanger}`}
                                    onClick={resetEconomy}
                                >
                                    Reset Economy
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className={styles.tabNavigation}>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'currency' ? styles.active : ''}`}
                                onClick={() => setActiveTab('currency')}
                            >
                                Currency
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'income' ? styles.active : ''}`}
                                onClick={() => setActiveTab('income')}
                            >
                                Income Sources
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'banking' ? styles.active : ''}`}
                                onClick={() => setActiveTab('banking')}
                            >
                                Banking
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'shop' ? styles.active : ''}`}
                                onClick={() => setActiveTab('shop')}
                            >
                                Shop
                            </button>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>
                                <i className="fas fa-spinner fa-spin"></i>
                                Loading economy data...
                            </div>
                        ) : (
                            <div className={styles.tabContent}>
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className={styles.overviewTab}>
                                        <div className={styles.statsGrid}>
                                            <div className={styles.statCard}>
                                                <h3>Total Circulation</h3>
                                                <div className={styles.statValue}>
                                                    {formatCurrency(stats.totalCirculation)}
                                                </div>
                                                <div className={styles.statChange}>
                                                    {stats.weeklyGrowth} this week
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Average Balance</h3>
                                                <div className={styles.statValue}>
                                                    {formatCurrency(stats.averageBalance)}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    Per active user
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Daily Transactions</h3>
                                                <div className={styles.statValue}>
                                                    {stats.dailyTransactions}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    Transactions today
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Bank Deposits</h3>
                                                <div className={styles.statValue}>
                                                    {formatCurrency(stats.bankDeposits)}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    {formatCurrency(stats.totalLoans)} in loans
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.economyOverview}>
                                            <div className={styles.richestUser}>
                                                <h3>💰 Richest User</h3>
                                                <div className={styles.userCard}>
                                                    <strong>{stats.richestUser.username}</strong>
                                                    <span>{formatCurrency(stats.richestUser.balance)}</span>
                                                </div>
                                            </div>

                                            <div className={styles.economyQuickActions}>
                                                <h3>🚀 Quick Actions</h3>
                                                <div className={styles.actionButtons}>
                                                    <button className={styles.actionButton}>
                                                        <i className="fas fa-gift"></i>
                                                        Mass Currency Drop
                                                    </button>
                                                    <button className={styles.actionButton}>
                                                        <i className="fas fa-chart-bar"></i>
                                                        Economic Report
                                                    </button>
                                                    <button className={styles.actionButton}>
                                                        <i className="fas fa-trophy"></i>
                                                        Start Competition
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Currency Tab */}
                                {activeTab === 'currency' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>💰 Currency Settings</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.enabled}
                                                        onChange={(e) => updateSetting(['enabled'], e.target.checked)}
                                                    />
                                                    Enable Economy System
                                                </label>
                                                <span className={styles.helpText}>
                                                    Enable or disable the entire economy system
                                                </span>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="currencyName">Currency Name</label>
                                                    <input
                                                        type="text"
                                                        id="currencyName"
                                                        value={settings.currency.name}
                                                        onChange={(e) => updateSetting(['currency', 'name'], e.target.value)}
                                                        placeholder="e.g., AegisCoins"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="currencySymbol">Currency Symbol</label>
                                                    <input
                                                        type="text"
                                                        id="currencySymbol"
                                                        value={settings.currency.symbol}
                                                        onChange={(e) => updateSetting(['currency', 'symbol'], e.target.value)}
                                                        placeholder="e.g., 🪙"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="startingBalance">Starting Balance</label>
                                                    <input
                                                        type="number"
                                                        id="startingBalance"
                                                        value={settings.currency.startingBalance}
                                                        onChange={(e) => updateSetting(['currency', 'startingBalance'], parseInt(e.target.value))}
                                                        min="0"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="maxBalance">Maximum Balance</label>
                                                    <input
                                                        type="number"
                                                        id="maxBalance"
                                                        value={settings.currency.maxBalance}
                                                        onChange={(e) => updateSetting(['currency', 'maxBalance'], parseInt(e.target.value))}
                                                        min="1000"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.currency.transferEnabled}
                                                        onChange={(e) => updateSetting(['currency', 'transferEnabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Allow User-to-User Transfers
                                                </label>
                                                <span className={styles.helpText}>
                                                    Let users send currency to each other
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Income Sources Tab */}
                                {activeTab === 'income' && (
                                    <div className={styles.settingsForm}>
                                        {/* Daily Bonus */}
                                        <div className={styles.settingsSection}>
                                            <h3>🎁 Daily Bonus</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.incomeSource.dailyBonus.enabled}
                                                        onChange={(e) => updateSetting(['incomeSource', 'dailyBonus', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Daily Bonus
                                                </label>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="dailyAmount">Base Amount</label>
                                                    <input
                                                        type="number"
                                                        id="dailyAmount"
                                                        value={settings.incomeSource.dailyBonus.baseAmount}
                                                        onChange={(e) => updateSetting(['incomeSource', 'dailyBonus', 'baseAmount'], parseInt(e.target.value))}
                                                        min="1"
                                                        disabled={!settings.incomeSource.dailyBonus.enabled}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="streakMultiplier">Streak Multiplier</label>
                                                    <input
                                                        type="number"
                                                        id="streakMultiplier"
                                                        value={settings.incomeSource.dailyBonus.streakMultiplier}
                                                        onChange={(e) => updateSetting(['incomeSource', 'dailyBonus', 'streakMultiplier'], parseFloat(e.target.value))}
                                                        min="1.0" max="3.0" step="0.1"
                                                        disabled={!settings.incomeSource.dailyBonus.enabled}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Rewards */}
                                        <div className={styles.settingsSection}>
                                            <h3>💬 Message Rewards</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.incomeSource.messageRewards.enabled}
                                                        onChange={(e) => updateSetting(['incomeSource', 'messageRewards', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Message Rewards
                                                </label>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="messageReward">Reward per Message</label>
                                                    <input
                                                        type="number"
                                                        id="messageReward"
                                                        value={settings.incomeSource.messageRewards.baseReward}
                                                        onChange={(e) => updateSetting(['incomeSource', 'messageRewards', 'baseReward'], parseInt(e.target.value))}
                                                        min="1"
                                                        disabled={!settings.incomeSource.messageRewards.enabled}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="messageCooldown">Cooldown (seconds)</label>
                                                    <input
                                                        type="number"
                                                        id="messageCooldown"
                                                        value={settings.incomeSource.messageRewards.cooldownSeconds}
                                                        onChange={(e) => updateSetting(['incomeSource', 'messageRewards', 'cooldownSeconds'], parseInt(e.target.value))}
                                                        min="10"
                                                        disabled={!settings.incomeSource.messageRewards.enabled}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job System */}
                                        <div className={styles.settingsSection}>
                                            <h3>💼 Job System</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.incomeSource.jobSystem.enabled}
                                                        onChange={(e) => updateSetting(['incomeSource', 'jobSystem', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Job System
                                                </label>
                                            </div>

                                            <div className={styles.jobsList}>
                                                <div className={styles.jobsHeader}>
                                                    <h4>Available Jobs</h4>
                                                    <button 
                                                        className={styles.addButton}
                                                        onClick={addJob}
                                                        disabled={!settings.incomeSource.jobSystem.enabled}
                                                    >
                                                        Add Job
                                                    </button>
                                                </div>
                                                
                                                {settings.incomeSource.jobSystem.jobs.map((job, index) => (
                                                    <div key={index} className={styles.jobItem}>
                                                        <div className={styles.jobControls}>
                                                            <input
                                                                type="text"
                                                                value={job.name}
                                                                onChange={(e) => {
                                                                    const newJobs = [...settings.incomeSource.jobSystem.jobs];
                                                                    newJobs[index].name = e.target.value;
                                                                    updateSetting(['incomeSource', 'jobSystem', 'jobs'], newJobs);
                                                                }}
                                                                placeholder="Job Name"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={job.basePay}
                                                                onChange={(e) => {
                                                                    const newJobs = [...settings.incomeSource.jobSystem.jobs];
                                                                    newJobs[index].basePay = parseInt(e.target.value);
                                                                    updateSetting(['incomeSource', 'jobSystem', 'jobs'], newJobs);
                                                                }}
                                                                placeholder="Base Pay"
                                                            />
                                                            <button 
                                                                className={styles.removeButton}
                                                                onClick={() => removeJob(index)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Banking Tab */}
                                {activeTab === 'banking' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>🏦 Banking System</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.banking.enabled}
                                                        onChange={(e) => updateSetting(['banking', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Banking System
                                                </label>
                                                <span className={styles.helpText}>
                                                    Allow users to deposit, withdraw, and earn interest
                                                </span>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="interestRate">Interest Rate (%)</label>
                                                    <input
                                                        type="number"
                                                        id="interestRate"
                                                        value={settings.banking.interestRate * 100}
                                                        onChange={(e) => updateSetting(['banking', 'interestRate'], parseFloat(e.target.value) / 100)}
                                                        min="0" max="50" step="0.1"
                                                        disabled={!settings.banking.enabled}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="minDeposit">Minimum Deposit</label>
                                                    <input
                                                        type="number"
                                                        id="minDeposit"
                                                        value={settings.banking.minimumDeposit}
                                                        onChange={(e) => updateSetting(['banking', 'minimumDeposit'], parseInt(e.target.value))}
                                                        min="1"
                                                        disabled={!settings.banking.enabled}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.settingsSubsection}>
                                                <h4>💳 Loan System</h4>
                                                
                                                <div className={styles.formGroup}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.banking.loanSystem.enabled}
                                                            onChange={(e) => updateSetting(['banking', 'loanSystem', 'enabled'], e.target.checked)}
                                                            disabled={!settings.banking.enabled}
                                                        />
                                                        Enable Loan System
                                                    </label>
                                                </div>

                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label htmlFor="maxLoan">Maximum Loan Amount</label>
                                                        <input
                                                            type="number"
                                                            id="maxLoan"
                                                            value={settings.banking.loanSystem.maxLoanAmount}
                                                            onChange={(e) => updateSetting(['banking', 'loanSystem', 'maxLoanAmount'], parseInt(e.target.value))}
                                                            min="100"
                                                            disabled={!settings.banking.loanSystem.enabled}
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label htmlFor="loanInterest">Loan Interest Rate (%)</label>
                                                        <input
                                                            type="number"
                                                            id="loanInterest"
                                                            value={settings.banking.loanSystem.interestRate * 100}
                                                            onChange={(e) => updateSetting(['banking', 'loanSystem', 'interestRate'], parseFloat(e.target.value) / 100)}
                                                            min="0" max="100" step="0.1"
                                                            disabled={!settings.banking.loanSystem.enabled}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Shop Tab */}
                                {activeTab === 'shop' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>🛒 Shop System</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.shop.enabled}
                                                        onChange={(e) => updateSetting(['shop', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Shop System
                                                </label>
                                                <span className={styles.helpText}>
                                                    Let users spend currency on roles, items, and perks
                                                </span>
                                            </div>

                                            <div className={styles.shopPreview}>
                                                <h4>Shop Preview</h4>
                                                <div className={styles.shopCategories}>
                                                    {settings.shop.categories.map((category, categoryIndex) => (
                                                        <div key={categoryIndex} className={styles.shopCategory}>
                                                            <h5>{category.name}</h5>
                                                            <div className={styles.shopItems}>
                                                                {category.items.map((item, itemIndex) => (
                                                                    <div key={itemIndex} className={styles.shopItem}>
                                                                        <div className={styles.itemInfo}>
                                                                            <strong>{item.name}</strong>
                                                                            <span className={styles.itemPrice}>
                                                                                {formatCurrency(item.price)}
                                                                            </span>
                                                                        </div>
                                                                        <p className={styles.itemDescription}>
                                                                            {item.description}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.shopManagement}>
                                                <button className={styles.manageButton}>
                                                    <i className="fas fa-edit"></i>
                                                    Manage Shop Items
                                                </button>
                                                <button className={styles.manageButton}>
                                                    <i className="fas fa-plus"></i>
                                                    Add Category
                                                </button>
                                                <button className={styles.manageButton}>
                                                    <i className="fas fa-chart-bar"></i>
                                                    Sales Analytics
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = parseCookies(context);
    
    if (!cookies.token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        // Fetch user data
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user');
        }
        
        const user = await userResponse.json();
        
        // Get guild data from query
        const guildId = context.query.guild as string;
        
        // Mock guild data for now - in real implementation, fetch from Discord API
        const guild = {
            id: guildId,
            name: 'Sample Server',
            icon: null,
            owner: true,
            permissions: '8',
            memberCount: 150,
            botPresent: true
        };

        return {
            props: {
                user,
                guild,
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};
