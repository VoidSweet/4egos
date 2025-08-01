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
}

export default function DashboardMe({ user }: IProps) {
    const [loading, setLoading] = React.useState(true);
    const [userStats, setUserStats] = React.useState({
        totalXP: 12847,
        level: 23,
        messagesCount: 2341,
        voiceTime: '142h 23m',
        serversCount: 3,
        achievements: ['First Message', 'Voice Chat Hero', 'Level 20 Milestone']
    });

    React.useEffect(() => {
        // Simulate loading user data
        setTimeout(() => setLoading(false), 1000);
        
        // In a real application, you would fetch user stats from your API
        // fetchUserStats(user.id).then(setUserStats);
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>AegisBot Dashboard - My Profile</title>
                <meta name="description" content="Your personal AegisBot profile and statistics" />
            </Head>

            <Header {...{user}} />
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>👤 My Profile</h1>
                    <p>Your personal AegisBot statistics and achievements</p>
                </div>

                <div className={userStyles.profileContainer}>
                    <div className={userStyles.infoCard}>
                        <div className={userStyles.userAvatar}>
                            <img 
                                src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`}
                                alt={`${user.username}'s avatar`}
                            />
                        </div>
                        <div className={userStyles.userInfo}>
                            <h2>{user.username}#{user.discriminator}</h2>
                            <p>Level {userStats.level} • {userStats.totalXP} XP</p>
                            <div className={userStyles.xpBar}>
                                <div 
                                    className={userStyles.xpProgress}
                                    style={{ width: `${(userStats.totalXP % 1000) / 10}%` }}
                                ></div>
                            </div>
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
                            <h3>Connected Accounts</h3>
                            <div className={userStyles.connectionsList}>
                                <div className={userStyles.connectionItem}>
                                    <span>🎮 Discord</span>
                                    <span className={userStyles.connected}>Connected</span>
                                </div>
                                <div className={userStyles.connectionItem}>
                                    <span>🤖 AegisBot</span>
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
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        // Use resolvedUrl for proper redirect handling
        const redirectUrl = ctx.resolvedUrl || '/dashboard/@me';
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(redirectUrl)}`,
                permanent: false,
            }
        };
    }

    // In a real application, you would decode the token and fetch user data
    const mockUser: IUser = {
        id: "123456789",
        username: "AegisUser",
        discriminator: "0001",
        avatar: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        verified: true,
        mfa_enabled: true,
        locale: "en-US",
        flags: 0,
        public_flags: 0
    };

    return {
        props: {
            user: mockUser
        }
    };
};