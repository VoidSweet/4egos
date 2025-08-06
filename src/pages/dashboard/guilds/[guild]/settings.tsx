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

interface GuildSettings {
    prefix: string;
    autoRole: string | null;
    welcomeChannel: string | null;
    logsChannel: string | null;
    muteRole: string | null;
    language: string;
    timezone: string;
}

interface IProps {
    user: IUser;
    guild: IGuild;
}

export default function GeneralSettings({ user, guild }: IProps) {
    const router = useRouter();
    const { guild: guildId } = router.query;
    
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [settings, setSettings] = useState<GuildSettings>({
        prefix: '!',
        autoRole: null,
        welcomeChannel: null,
        logsChannel: null,
        muteRole: null,
        language: 'en',
        timezone: 'UTC'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [channels, setChannels] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        if (guildId) {
            fetchGuildSettings();
            fetchGuildChannels();
            fetchGuildRoles();
        }
    }, [guildId]);

    const fetchGuildSettings = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching guild settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGuildChannels = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/channels`);
            if (response.ok) {
                const data = await response.json();
                setChannels(data);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    };

    const fetchGuildRoles = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/roles`);
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/bot/${guildId}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
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
                <title>General Settings - {guild.name} - Aegis</title>
                <meta name="description" content={`General settings for ${guild.name}`} />
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

                <div className={styles.layout}>
                    {/* Sidebar Navigation */}
                    <div className={styles.sidebar}>
                        <nav className={styles.navigation}>
                            <Link href={`/dashboard/guilds/${guildId}`} className={styles.homeLink}>
                                <i className="fas fa-home"></i>
                                <span>Home</span>
                            </Link>

                            <div className={styles.modulesList}>
                                <div className={styles.moduleLabel}>GENERAL</div>
                                
                                <div className={styles.module}>
                                    <div className={styles.moduleItems}>
                                        <Link 
                                            href={`/dashboard/guilds/${guildId}/settings`}
                                            className={`${styles.moduleItem} ${styles.active}`}
                                        >
                                            <i className="fas fa-cog"></i>
                                            <span>General Settings</span>
                                        </Link>
                                        <Link 
                                            href={`/dashboard/guilds/${guildId}/auto-moderation`}
                                            className={styles.moduleItem}
                                        >
                                            <i className="fas fa-shield-alt"></i>
                                            <span>Auto Moderation</span>
                                        </Link>
                                        <Link 
                                            href={`/dashboard/guilds/${guildId}/moderation`}
                                            className={styles.moduleItem}
                                        >
                                            <i className="fas fa-gavel"></i>
                                            <span>Moderation</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className={styles.main}>
                        <div className={styles.pageHeader}>
                            <h1>
                                <i className="fas fa-cog"></i>
                                General Settings
                            </h1>
                            <p>Configure basic settings for your server</p>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>
                                <i className="fas fa-spinner fa-spin"></i>
                                Loading settings...
                            </div>
                        ) : (
                            <div className={styles.settingsForm}>
                                {/* Basic Settings */}
                                <div className={styles.settingsSection}>
                                    <h3>Basic Configuration</h3>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prefix">Command Prefix</label>
                                        <input
                                            type="text"
                                            id="prefix"
                                            value={settings.prefix}
                                            onChange={(e) => setSettings({...settings, prefix: e.target.value})}
                                            placeholder="!"
                                            maxLength={5}
                                        />
                                        <span className={styles.helpText}>
                                            The prefix used to trigger bot commands (e.g., !help)
                                        </span>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="language">Language</label>
                                        <select
                                            id="language"
                                            value={settings.language}
                                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="pt">Portuguese</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="timezone">Timezone</label>
                                        <select
                                            id="timezone"
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Europe/Paris">Paris</option>
                                            <option value="Asia/Tokyo">Tokyo</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Channel Settings */}
                                <div className={styles.settingsSection}>
                                    <h3>Channel Configuration</h3>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="welcomeChannel">Welcome Channel</label>
                                        <select
                                            id="welcomeChannel"
                                            value={settings.welcomeChannel || ''}
                                            onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value || null})}
                                        >
                                            <option value="">No welcome channel</option>
                                            {channels.filter(c => c.type === 0).map(channel => (
                                                <option key={channel.id} value={channel.id}>
                                                    #{channel.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="logsChannel">Moderation Logs Channel</label>
                                        <select
                                            id="logsChannel"
                                            value={settings.logsChannel || ''}
                                            onChange={(e) => setSettings({...settings, logsChannel: e.target.value || null})}
                                        >
                                            <option value="">No logs channel</option>
                                            {channels.filter(c => c.type === 0).map(channel => (
                                                <option key={channel.id} value={channel.id}>
                                                    #{channel.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Role Settings */}
                                <div className={styles.settingsSection}>
                                    <h3>Role Configuration</h3>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="autoRole">Auto Role</label>
                                        <select
                                            id="autoRole"
                                            value={settings.autoRole || ''}
                                            onChange={(e) => setSettings({...settings, autoRole: e.target.value || null})}
                                        >
                                            <option value="">No auto role</option>
                                            {roles.filter(r => !r.managed && r.name !== '@everyone').map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className={styles.helpText}>
                                            Role automatically assigned to new members
                                        </span>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="muteRole">Mute Role</label>
                                        <select
                                            id="muteRole"
                                            value={settings.muteRole || ''}
                                            onChange={(e) => setSettings({...settings, muteRole: e.target.value || null})}
                                        >
                                            <option value="">No mute role</option>
                                            {roles.filter(r => !r.managed && r.name !== '@everyone').map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className={styles.helpText}>
                                            Role used for muting members
                                        </span>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className={styles.saveSection}>
                                    <button 
                                        className={styles.saveButton}
                                        onClick={saveSettings}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i>
                                                Save Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                destination: '/api/auth/login?state=' + encodeURIComponent(`/dashboard/guilds/${guildId}/settings`),
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

        return {
            props: {
                user,
                guild: {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon,
                    owner: guild.owner,
                    permissions: guild.permissions
                }
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
