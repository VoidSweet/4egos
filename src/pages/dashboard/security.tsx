import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import Toggle, { CheckRadio } from '../../components/Toggle';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import securityStyles from '../../styles/security.module.css';
import { IUser } from '../../types';

interface ISecurityConfig {
    antiNuke: {
        enabled: boolean;
        autoQuarantine: boolean;
        panicMode: boolean;
        channelDeleteLimit: number;
        roleDeleteLimit: number;
        massBanLimit: number;
        massKickLimit: number;
        webhookSpamLimit: number;
    };
    heatSystem: {
        enabled: boolean;
        baseThreshold: number;
        decayRate: number;
        messageSpamHeat: number;
        mentionSpamHeat: number;
        emojiSpamHeat: number;
        capsSpamHeat: number;
    };
    verification: {
        enabled: boolean;
        verificationMode: 'captcha' | 'manual' | 'disabled';
        accountAgeCheck: boolean;
        minimumAgeHours: number;
        activityMonitoring: boolean;
    };
}

interface IProps {
    user: IUser;
    config: ISecurityConfig;
}

export default function SecurityDashboard({ user, config }: IProps) {
    const [loading, setLoading] = useState(true);
    const [securityConfig, setSecurityConfig] = useState<ISecurityConfig>(config);
    const [saving, setSaving] = useState(false);
    const [selectedGuildId, setSelectedGuildId] = useState<string>('');
    const [userGuilds, setUserGuilds] = useState<any[]>([]);

    useEffect(() => {
        // Fetch user's guilds for server selection
        const fetchGuilds = async () => {
            try {
                const response = await fetch('/api/discord/guilds');
                if (response.ok) {
                    const guilds = await response.json();
                    setUserGuilds(guilds.filter((g: any) => g.permissions_new & 0x20)); // MANAGE_GUILD permission
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
            // Fetch guild-specific security configuration
            const response = await fetch(`/api/guilds/${guildId}/security`);
            
            if (response.ok) {
                const guildConfig = await response.json();
                setSecurityConfig(guildConfig);
            }
        } catch (error) {
            console.error('Failed to fetch guild security config:', error);
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
            const response = await fetch(`/api/guilds/${selectedGuildId}/security`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(securityConfig)
            });

            if (response.ok) {
                alert('Security settings saved successfully!');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Save error:', error);
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
                <title>AegisBot Dashboard - Security Management</title>
                <meta name="description" content="Comprehensive security management for Discord servers" />
            </Head>

            <LeftMenu {...{user}} saveButton={!!selectedGuildId} onSave={handleSave} saving={saving} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🛡️ Security Management</h1>
                    <p>Protect your Discord server with advanced security features and monitoring.</p>
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
                            ⚠️ Please select a server to configure security settings.
                        </p>
                    )}
                </div>

                {/* Security Overview Stats */}
                <div className={dashStyles.statsGrid}>
                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>⚡</div>
                        <div className={dashStyles.statContent}>
                            <h3>Active</h3>
                            <p>Protection Status</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🚨</div>
                        <div className={dashStyles.statContent}>
                            <h3>247</h3>
                            <p>Threats Blocked Today</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🔒</div>
                        <div className={dashStyles.statContent}>
                            <h3>3</h3>
                            <p>Users Quarantined</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>👥</div>
                        <div className={dashStyles.statContent}>
                            <h3>15</h3>
                            <p>Whitelisted Users</p>
                        </div>
                    </div>
                </div>

                {/* Anti-Nuke Protection */}
                <div className={securityStyles.securitySection}>
                    <h2>🚫 Anti-Nuke Protection</h2>
                    <p>Protect your server from malicious attacks and mass deletions.</p>
                    
                    <div className={securityStyles.configCard}>
                        <div className={securityStyles.configRow}>
                            <CheckRadio>
                                <Toggle 
                                    defaultChecked={securityConfig.antiNuke.enabled}
                                    disabled={isConfigDisabled}
                                    onChange={(checked) => setSecurityConfig(prev => ({
                                        ...prev,
                                        antiNuke: { ...prev.antiNuke, enabled: checked }
                                    }))}
                                />
                                <label><strong>Enable Anti-Nuke Protection</strong></label>
                                <p>Automatically detect and prevent server nuking attempts</p>
                            </CheckRadio>
                        </div>

                        <div className={securityStyles.configRow}>
                            <CheckRadio>
                                <Toggle 
                                    defaultChecked={securityConfig.antiNuke.autoQuarantine}
                                    disabled={isConfigDisabled}
                                    onChange={(checked) => setSecurityConfig(prev => ({
                                        ...prev,
                                        antiNuke: { ...prev.antiNuke, autoQuarantine: checked }
                                    }))}
                                />
                                <label><strong>Auto-Quarantine Attackers</strong></label>
                                <p>Automatically quarantine users who trigger protection</p>
                            </CheckRadio>
                        </div>

                        <div className={securityStyles.configGroup}>
                            <h4>Detection Limits</h4>
                            <div className={securityStyles.limitGrid}>
                                <div className={securityStyles.limitItem}>
                                    <label>Channel Deletes (per 30s)</label>
                                    <input 
                                        type="number" 
                                        value={securityConfig.antiNuke.channelDeleteLimit}
                                        onChange={(e) => setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, channelDeleteLimit: parseInt(e.target.value) }
                                        }))}
                                        min="1" 
                                        max="20" 
                                    />
                                </div>

                                <div className={securityStyles.limitItem}>
                                    <label>Role Deletes (per 30s)</label>
                                    <input 
                                        type="number" 
                                        value={securityConfig.antiNuke.roleDeleteLimit}
                                        onChange={(e) => setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, roleDeleteLimit: parseInt(e.target.value) }
                                        }))}
                                        min="1" 
                                        max="20" 
                                    />
                                </div>

                                <div className={securityStyles.limitItem}>
                                    <label>Mass Bans (per 30s)</label>
                                    <input 
                                        type="number" 
                                        value={securityConfig.antiNuke.massBanLimit}
                                        onChange={(e) => setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, massBanLimit: parseInt(e.target.value) }
                                        }))}
                                        min="1" 
                                        max="50" 
                                    />
                                </div>

                                <div className={securityStyles.limitItem}>
                                    <label>Mass Kicks (per 60s)</label>
                                    <input 
                                        type="number" 
                                        value={securityConfig.antiNuke.massKickLimit}
                                        onChange={(e) => setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, massKickLimit: parseInt(e.target.value) }
                                        }))}
                                        min="1" 
                                        max="100" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className={securityStyles.saveSection}>
                    <button 
                        className={securityStyles.saveButton}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Saving Configuration...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i>
                                Save Security Settings
                            </>
                        )}
                    </button>
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
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.resolvedUrl || '/dashboard/security')}`,
                permanent: false,
            }
        };
    }

    // Mock security configuration
    const mockConfig: ISecurityConfig = {
        antiNuke: {
            enabled: true,
            autoQuarantine: true,
            panicMode: false,
            channelDeleteLimit: 3,
            roleDeleteLimit: 3,
            massBanLimit: 5,
            massKickLimit: 10,
            webhookSpamLimit: 3,
        },
        heatSystem: {
            enabled: true,
            baseThreshold: 100,
            decayRate: 0.1,
            messageSpamHeat: 10,
            mentionSpamHeat: 15,
            emojiSpamHeat: 5,
            capsSpamHeat: 8,
        },
        verification: {
            enabled: true,
            verificationMode: 'captcha',
            accountAgeCheck: true,
            minimumAgeHours: 24,
            activityMonitoring: true,
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
            config: mockConfig
        }
    };
};
