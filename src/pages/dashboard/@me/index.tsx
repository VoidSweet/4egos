import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Header from '../../../components/Header';
import LeftMenu from '../../../components/LeftMenu';
import LoadingPage from '../../../components/LoadingPage';
import styles from '../../../styles/main.module.css';
import dashStyles from '../../../styles/DashboardLayout.module.css';
import userStyles from '../../../styles/user.module.css';
import { IUser } from '../../../types';

interface IProps {
    user: IUser;
    realUser: any;
}

export default function DashboardMe({ user, realUser }: IProps) {
    const [loading, setLoading] = React.useState(true);
    const [userStats, setUserStats] = React.useState({
        totalXP: 15847,
        level: 28,
        messagesCount: 3421,
        voiceTime: '187h 42m',
        serversCount: realUser?.guilds?.length || 5,
        achievements: ['Welcome Aboard', 'Community Member', 'Active User', 'Voice Chat Pro']
    });

    React.useEffect(() => {
        // Simulate loading user data
        setTimeout(() => setLoading(false), 800);
        
        // Fetch user stats from API
        // fetchUserStats(realUser.id).then(setUserStats);
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    const displayUser = realUser || user;

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - My Profile</title>
                <meta name="description" content="Your personal 4EgosBot profile and statistics" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>👤 My Profile</h1>
                    <p>Your personal 4EgosBot statistics and achievements</p>
                </div>

                <div className={userStyles.profileContainer}>
                    <div className={userStyles.infoCard}>
                        <div className={userStyles.userAvatar}>
                            <img 
                                src={displayUser.avatar ? `https://cdn.discordapp.com/avatars/${displayUser.id}/${displayUser.avatar}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${(parseInt(displayUser.discriminator || '0001') % 5)}.png`}
                                alt={`${displayUser.username}'s avatar`}
                            />
                        </div>
                        <div className={userStyles.userInfo}>
                            <h2>{displayUser.global_name || displayUser.username}</h2>
                            <p className={userStyles.userTag}>@{displayUser.username}#{displayUser.discriminator}</p>
                            <p className={userStyles.levelInfo}>Level {userStats.level} • {userStats.totalXP.toLocaleString()} XP</p>
                            <div className={userStyles.xpBar}>
                                <div 
                                    className={userStyles.xpProgress}
                                    style={{ width: `${(userStats.totalXP % 1000) / 10}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className={userStyles.userBadges}>
                            {displayUser.premium_type && (
                                <div className={userStyles.badge}>
                                    💎 Nitro
                                </div>
                            )}
                            {displayUser.verified && (
                                <div className={userStyles.badge}>
                                    ✅ Verified
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={dashStyles.featureGrid}>
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>📊</div>
                            <h3>Activity Stats</h3>
                            <div className={userStyles.statsList}>
                                <div className={userStyles.statItem}>
                                    <span>Messages Sent</span>
                                    <strong>{userStats.messagesCount.toLocaleString()}</strong>
                                </div>
                                <div className={userStyles.statItem}>
                                    <span>Voice Time</span>
                                    <strong>{userStats.voiceTime}</strong>
                                </div>
                                <div className={userStyles.statItem}>
                                    <span>Servers</span>
                                    <strong>{userStats.serversCount}</strong>
                                </div>
                            </div>
                        </div>

                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🏆</div>
                            <h3>Achievements</h3>
                            <div className={userStyles.achievementsList}>
                                {userStats.achievements.map((achievement, index) => (
                                    <div key={index} className={userStyles.achievementItem}>
                                        🏅 {achievement}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>⚙️</div>
                            <h3>Preferences</h3>
                            <div className={userStyles.preferencesList}>
                                <div className={userStyles.preferenceItem}>
                                    <span>Notifications</span>
                                    <button className={userStyles.toggleButton}>ON</button>
                                </div>
                                <div className={userStyles.preferenceItem}>
                                    <span>DM Commands</span>
                                    <button className={userStyles.toggleButton}>OFF</button>
                                </div>
                                <div className={userStyles.preferenceItem}>
                                    <span>Level Up Announcements</span>
                                    <button className={userStyles.toggleButton}>ON</button>
                                </div>
                            </div>
                        </div>

                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🔗</div>
                            <h3>Account Info</h3>
                            <div className={userStyles.connectionsList}>
                                <div className={userStyles.connectionItem}>
                                    <span>🎮 Discord ID</span>
                                    <span className={userStyles.userId}>{displayUser.id}</span>
                                </div>
                                <div className={userStyles.connectionItem}>
                                    <span>🌍 Locale</span>
                                    <span className={userStyles.connected}>{displayUser.locale || 'en-US'}</span>
                                </div>
                                <div className={userStyles.connectionItem}>
                                    <span>🤖 4EgosBot</span>
                                    <span className={userStyles.connected}>Active</span>
                                </div>
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