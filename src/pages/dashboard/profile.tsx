import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Image from 'next/image';
import LeftMenu from '../../components/LeftMenu';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function ProfileDashboard({ user }: IProps) {
    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - User Profile</title>
                <meta name="description" content="Manage your user profile and preferences" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>👤 User Profile</h1>
                    <p>Manage your profile settings and bot preferences.</p>
                </div>

                <div className={dashStyles.profileSection}>
                    <div className={dashStyles.profileCard}>
                        <div className={dashStyles.profileHeader}>
                            <div className={dashStyles.profileAvatar}>
                                {user.avatar ? (
                                    <Image
                                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
                                        alt={user.username}
                                        width={80}
                                        height={80}
                                    />
                                ) : (
                                    <div className={dashStyles.defaultAvatar}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={dashStyles.profileInfo}>
                                <h3>{user.username}</h3>
                                <p>#{user.discriminator}</p>
                                <div className={dashStyles.profileBadges}>
                                    {user.verified && <span className={dashStyles.badge}>✅ Verified</span>}
                                    <span className={dashStyles.badge}>🆓 Free User</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={dashStyles.settingsGrid}>
                        <div className={dashStyles.settingCard}>
                            <h4>🔔 Notifications</h4>
                            <p>Control what notifications you receive</p>
                            <div className={dashStyles.settingOptions}>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Email notifications
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Discord DM alerts
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    Marketing emails
                                </label>
                            </div>
                        </div>

                        <div className={dashStyles.settingCard}>
                            <h4>🌙 Theme Preferences</h4>
                            <p>Customize your dashboard appearance</p>
                            <div className={dashStyles.themeOptions}>
                                <button className={`${dashStyles.themeButton} ${dashStyles.active}`}>
                                    🌞 Light
                                </button>
                                <button className={dashStyles.themeButton}>
                                    🌙 Dark
                                </button>
                                <button className={dashStyles.themeButton}>
                                    🎨 Auto
                                </button>
                            </div>
                        </div>

                        <div className={dashStyles.settingCard}>
                            <h4>🔐 Privacy & Security</h4>
                            <p>Manage your privacy settings</p>
                            <div className={dashStyles.settingOptions}>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Show in public leaderboards
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Allow data analytics
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    Share usage statistics
                                </label>
                            </div>
                        </div>

                        <div className={dashStyles.settingCard}>
                            <h4>📊 Data Export</h4>
                            <p>Download your data and account information</p>
                            <div className={dashStyles.exportActions}>
                                <button className={dashStyles.exportButton}>
                                    📥 Export User Data
                                </button>
                                <button className={dashStyles.exportButton}>
                                    📋 Download Activity Log
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={dashStyles.dangerZone}>
                        <h4>⚠️ Danger Zone</h4>
                        <p>Irreversible actions that affect your account</p>
                        <div className={dashStyles.dangerActions}>
                            <button className={dashStyles.clearDataButton}>
                                Clear All Data
                            </button>
                            <button className={dashStyles.deleteAccountButton}>
                                Delete Account
                            </button>
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
