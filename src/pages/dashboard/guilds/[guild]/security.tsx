import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import LeftMenu from '../../../../components/LeftMenu';
import LoadingPage from '../../../../components/LoadingPage';
import Toggle, { CheckRadio } from '../../../../components/Toggle';
import styles from '../../../../styles/main.module.css';
import dashStyles from '../../../../styles/DashboardLayout.module.css';
import { IUser, IGuild } from '../../../../types';

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
    guild: IGuild;
    config: ISecurityConfig;
}

export default function GuildSecurityDashboard({ user, guild, config }: IProps) {
    const [loading, setLoading] = useState(false);
    const [securityConfig, setSecurityConfig] = useState<ISecurityConfig>(config);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/guilds/${guild.id}/security`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(securityConfig)
            });

            if (response.ok) {
                alert('Security configuration saved successfully!');
            } else {
                alert('Failed to save configuration. Please try again.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('An error occurred while saving. Please try again.');
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
                <title>4EgosBot Dashboard - {guild.name} Security</title>
                <meta name="description" content={`Security configuration for ${guild.name}`} />
            </Head>

            <LeftMenu {...{user, guild, saveButton: true, onSave: handleSave, saving}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🛡️ Security Configuration</h1>
                    <p>Configure security settings for <strong>{guild.name}</strong></p>
                </div>

                {/* Anti-Nuke Protection */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>🚫 Anti-Nuke Protection</h4>
                        <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                            Protect your server from malicious activities and mass actions.
                        </p>
                        
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div>
                                <Toggle
                                    title="Enable Anti-Nuke"
                                    description="Automatically detect and prevent destructive activities"
                                    enabled={securityConfig.antiNuke.enabled}
                                    onChange={(enabled) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, enabled }
                                        }))
                                    }
                                />
                            </div>
                            
                            <div>
                                <Toggle
                                    title="Auto Quarantine"
                                    description="Automatically quarantine suspicious users"
                                    enabled={securityConfig.antiNuke.autoQuarantine}
                                    onChange={(autoQuarantine) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, autoQuarantine }
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Channel Delete Limit
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={securityConfig.antiNuke.channelDeleteLimit}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, channelDeleteLimit: parseInt(e.target.value) || 3 }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Mass Ban Limit
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={securityConfig.antiNuke.massBanLimit}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            antiNuke: { ...prev.antiNuke, massBanLimit: parseInt(e.target.value) || 5 }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heat System */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>🔥 Heat System</h4>
                        <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                            Advanced spam detection system that tracks user behavior patterns.
                        </p>
                        
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div>
                                <Toggle
                                    title="Enable Heat System"
                                    description="Track and respond to spam patterns"
                                    enabled={securityConfig.heatSystem.enabled}
                                    onChange={(enabled) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            heatSystem: { ...prev.heatSystem, enabled }
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Base Threshold
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={securityConfig.heatSystem.baseThreshold}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            heatSystem: { ...prev.heatSystem, baseThreshold: parseInt(e.target.value) || 50 }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Message Spam Heat
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={securityConfig.heatSystem.messageSpamHeat}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            heatSystem: { ...prev.heatSystem, messageSpamHeat: parseInt(e.target.value) || 5 }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification System */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>✅ Verification System</h4>
                        <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                            Control how new members are verified and what checks are performed.
                        </p>
                        
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div>
                                <Toggle
                                    title="Enable Verification"
                                    description="Require new members to be verified"
                                    enabled={securityConfig.verification.enabled}
                                    onChange={(enabled) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            verification: { ...prev.verification, enabled }
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <Toggle
                                    title="Account Age Check"
                                    description="Verify account creation date"
                                    enabled={securityConfig.verification.accountAgeCheck}
                                    onChange={(accountAgeCheck) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            verification: { ...prev.verification, accountAgeCheck }
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Minimum Account Age (Hours)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="720"
                                    value={securityConfig.verification.minimumAgeHours}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            verification: { ...prev.verification, minimumAgeHours: parseInt(e.target.value) || 24 }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>
                                    Verification Mode
                                </label>
                                <select
                                    value={securityConfig.verification.verificationMode}
                                    onChange={(e) => 
                                        setSecurityConfig(prev => ({
                                            ...prev,
                                            verification: { ...prev.verification, verificationMode: e.target.value as 'captcha' | 'manual' | 'disabled' }
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value="disabled">Disabled</option>
                                    <option value="captcha">Captcha Verification</option>
                                    <option value="manual">Manual Approval</option>
                                </select>
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
    const guildId = ctx.params?.guild as string;

    if (!token) {
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(`/dashboard/guilds/${guildId}/security`)}`,
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

        // Fetch guild data
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let guildData = null;
        if (guildsResponse.ok) {
            const guildsDataArray = await guildsResponse.json();
            guildData = guildsDataArray.find((g: any) => g.id === guildId);
        }

        if (!guildData) {
            return {
                redirect: {
                    destination: '/dashboard/guilds',
                    permanent: false,
                }
            };
        }

        // Default security configuration
        const defaultConfig: ISecurityConfig = {
            antiNuke: {
                enabled: true,
                autoQuarantine: false,
                panicMode: false,
                channelDeleteLimit: 3,
                roleDeleteLimit: 3,
                massBanLimit: 5,
                massKickLimit: 10,
                webhookSpamLimit: 3
            },
            heatSystem: {
                enabled: true,
                baseThreshold: 50,
                decayRate: 5,
                messageSpamHeat: 5,
                mentionSpamHeat: 10,
                emojiSpamHeat: 3,
                capsSpamHeat: 2
            },
            verification: {
                enabled: false,
                verificationMode: 'captcha',
                accountAgeCheck: true,
                minimumAgeHours: 24,
                activityMonitoring: false
            }
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

        const guild: IGuild = {
            id: guildData.id,
            name: guildData.name,
            icon: guildData.icon,
            channels: [], // These would be populated by the bot API
            roles: [], // These would be populated by the bot API
            shardID: 0,
            cluserID: '0'
        };

        return {
            props: {
                user,
                guild,
                config: defaultConfig
            }
        };

    } catch (error) {
        console.error('Error fetching data:', error);
        
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            }
        };
    }
};
