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
}

export default function SecuritySettings({ user, guild }: IProps) {
    const router = useRouter();
    const { guild: guildId } = router.query;
    
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [securityConfig, setSecurityConfig] = useState<ISecurityConfig>({
        antiNuke: {
            enabled: true,
            autoQuarantine: true,
            panicMode: false,
            channelDeleteLimit: 5,
            roleDeleteLimit: 3,
            massBanLimit: 10,
            massKickLimit: 15,
            webhookSpamLimit: 20
        },
        heatSystem: {
            enabled: true,
            baseThreshold: 100,
            decayRate: 10,
            messageSpamHeat: 15,
            mentionSpamHeat: 25,
            emojiSpamHeat: 10,
            capsSpamHeat: 20
        },
        verification: {
            enabled: false,
            verificationMode: 'captcha',
            accountAgeCheck: true,
            minimumAgeHours: 24,
            activityMonitoring: false
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSecurityConfig();
    }, [guildId]);

    const fetchSecurityConfig = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/security`);
            if (response.ok) {
                const config = await response.json();
                setSecurityConfig(config);
            }
        } catch (error) {
            console.error('Error fetching security config:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSecurityConfig = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/bot/${guildId}/security`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(securityConfig),
            });

            if (response.ok) {
                alert('Security settings saved successfully!');
            } else {
                alert('Failed to save security settings');
            }
        } catch (error) {
            console.error('Error saving security settings:', error);
            alert('Failed to save security settings');
        } finally {
            setSaving(false);
        }
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

    return (
        <>
            <Head>
                <title>Security Settings - {guild.name} - Aegis</title>
                <meta name="description" content={`Security settings for ${guild.name}`} />
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
                                        href={`/dashboard/guilds/${guild.id}`}
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
                                        href={`/dashboard/guilds/${guild.id}/security`}
                                        className={`${styles.sidebarLink} ${styles.active}`}
                                    >
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Security Settings</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/moderation`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-gavel"></i>
                                        <span>Moderation</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/economy`}
                                        className={styles.sidebarLink}
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
                                </div>
                            </div>

                            <div className={styles.sidebarSection}>
                                <h4>Bot Management</h4>
                                <div className={styles.sidebarLinks}>
                                    <a 
                                        href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1398326650558742528'}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                                        className={styles.sidebarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fas fa-plus"></i>
                                        <span>Invite Bot</span>
                                    </a>
                                    <Link 
                                        href="/support"
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-life-ring"></i>
                                        <span>Support</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className={styles.main}>
                        <div className={styles.pageHeader}>
                            <h1>🛡️ Security Settings</h1>
                            <p>Configure advanced security settings for {guild.name}</p>
                        </div>

                        {loading ? (
                            <div className={styles.settingsSection}>
                                Loading security settings...
                            </div>
                        ) : (
                            <div className={styles.settingsContainer}>
                                {/* Anti-Nuke Protection */}
                                <div className={styles.settingsSection}>
                                    <h3>🚫 Anti-Nuke Protection</h3>
                                    <p className={styles.sectionDescription}>
                                        Protect your server from malicious activities and mass destructive actions.
                                    </p>
                                    
                                    <div className={styles.settingsGrid}>
                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Enable Anti-Nuke Protection</label>
                                                <span className={styles.settingDescription}>
                                                    Automatically detect and prevent destructive activities
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={securityConfig.antiNuke.enabled}
                                                        onChange={(e) => 
                                                            setSecurityConfig(prev => ({
                                                                ...prev,
                                                                antiNuke: { ...prev.antiNuke, enabled: e.target.checked }
                                                            }))
                                                        }
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Auto Quarantine</label>
                                                <span className={styles.settingDescription}>
                                                    Automatically quarantine suspicious users
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={securityConfig.antiNuke.autoQuarantine}
                                                        onChange={(e) => 
                                                            setSecurityConfig(prev => ({
                                                                ...prev,
                                                                antiNuke: { ...prev.antiNuke, autoQuarantine: e.target.checked }
                                                            }))
                                                        }
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Channel Delete Limit</label>
                                                <span className={styles.settingDescription}>
                                                    Maximum channels that can be deleted before triggering protection
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={securityConfig.antiNuke.channelDeleteLimit}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            antiNuke: { ...prev.antiNuke, channelDeleteLimit: parseInt(e.target.value) }
                                                        }))
                                                    }
                                                    className={styles.numberInput}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Role Delete Limit</label>
                                                <span className={styles.settingDescription}>
                                                    Maximum roles that can be deleted before triggering protection
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="25"
                                                    value={securityConfig.antiNuke.roleDeleteLimit}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            antiNuke: { ...prev.antiNuke, roleDeleteLimit: parseInt(e.target.value) }
                                                        }))
                                                    }
                                                    className={styles.numberInput}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Heat System */}
                                <div className={styles.settingsSection}>
                                    <h3>🔥 Heat Detection System</h3>
                                    <p className={styles.sectionDescription}>
                                        Advanced spam detection with escalating consequences based on user behavior.
                                    </p>
                                    
                                    <div className={styles.settingsGrid}>
                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Enable Heat System</label>
                                                <span className={styles.settingDescription}>
                                                    Track user activity and apply escalating moderation
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={securityConfig.heatSystem.enabled}
                                                        onChange={(e) => 
                                                            setSecurityConfig(prev => ({
                                                                ...prev,
                                                                heatSystem: { ...prev.heatSystem, enabled: e.target.checked }
                                                            }))
                                                        }
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Base Threshold</label>
                                                <span className={styles.settingDescription}>
                                                    Heat level before moderation actions are triggered
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <input
                                                    type="number"
                                                    min="50"
                                                    max="500"
                                                    value={securityConfig.heatSystem.baseThreshold}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            heatSystem: { ...prev.heatSystem, baseThreshold: parseInt(e.target.value) }
                                                        }))
                                                    }
                                                    className={styles.numberInput}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Message Spam Heat</label>
                                                <span className={styles.settingDescription}>
                                                    Heat points added for rapid message sending
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="50"
                                                    value={securityConfig.heatSystem.messageSpamHeat}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            heatSystem: { ...prev.heatSystem, messageSpamHeat: parseInt(e.target.value) }
                                                        }))
                                                    }
                                                    className={styles.numberInput}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification System */}
                                <div className={styles.settingsSection}>
                                    <h3>✅ Verification System</h3>
                                    <p className={styles.sectionDescription}>
                                        Advanced user verification to prevent spam and unauthorized access.
                                    </p>
                                    
                                    <div className={styles.settingsGrid}>
                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Enable Verification</label>
                                                <span className={styles.settingDescription}>
                                                    Require new members to verify before accessing the server
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={securityConfig.verification.enabled}
                                                        onChange={(e) => 
                                                            setSecurityConfig(prev => ({
                                                                ...prev,
                                                                verification: { ...prev.verification, enabled: e.target.checked }
                                                            }))
                                                        }
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Verification Mode</label>
                                                <span className={styles.settingDescription}>
                                                    Choose how users should verify their identity
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <select
                                                    value={securityConfig.verification.verificationMode}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            verification: { ...prev.verification, verificationMode: e.target.value as 'captcha' | 'manual' | 'disabled' }
                                                        }))
                                                    }
                                                    className={styles.selectInput}
                                                >
                                                    <option value="captcha">CAPTCHA</option>
                                                    <option value="manual">Manual Review</option>
                                                    <option value="disabled">Disabled</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Account Age Check</label>
                                                <span className={styles.settingDescription}>
                                                    Require accounts to be older than specified time
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={securityConfig.verification.accountAgeCheck}
                                                        onChange={(e) => 
                                                            setSecurityConfig(prev => ({
                                                                ...prev,
                                                                verification: { ...prev.verification, accountAgeCheck: e.target.checked }
                                                            }))
                                                        }
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <label>Minimum Account Age (hours)</label>
                                                <span className={styles.settingDescription}>
                                                    Required account age in hours
                                                </span>
                                            </div>
                                            <div className={styles.settingControl}>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="8760"
                                                    value={securityConfig.verification.minimumAgeHours}
                                                    onChange={(e) => 
                                                        setSecurityConfig(prev => ({
                                                            ...prev,
                                                            verification: { ...prev.verification, minimumAgeHours: parseInt(e.target.value) }
                                                        }))
                                                    }
                                                    className={styles.numberInput}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className={styles.saveContainer}>
                                    <button 
                                        onClick={saveSecurityConfig}
                                        disabled={saving}
                                        className={styles.saveButton}
                                    >
                                        {saving ? 'Saving...' : 'Save Security Settings'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx);
    const { guild: guildId } = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login?state=' + encodeURIComponent(`/dashboard/guilds/${guildId}/security`),
                permanent: false,
            }
        };
    }

    try {
        // Fetch user data
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch user guilds to find the specific guild
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!guildsResponse.ok) {
            throw new Error('Failed to fetch guilds data');
        }

        const guildsData = await guildsResponse.json();
        const guild = guildsData.find((g: any) => g.id === guildId);

        if (!guild) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            };
        }

        // Check if user has admin permissions
        const hasAdminPermissions = guild.owner || 
            (parseInt(guild.permissions) & 0x8) === 0x8 || // ADMINISTRATOR
            (parseInt(guild.permissions) & 0x20) === 0x20;   // MANAGE_SERVER

        if (!hasAdminPermissions) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            };
        }

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

        const enhancedGuild = {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            owner: guild.owner,
            permissions: guild.permissions,
            memberCount: 0,
            botPresent: false
        };

        return {
            props: {
                user,
                guild: enhancedGuild
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
