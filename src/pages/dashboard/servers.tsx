import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';

import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function ServersDashboard({ user }: IProps) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>AegisBot Dashboard - My Servers</title>
                <meta name="description" content="Manage all your Discord servers with AegisBot" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🏢 My Servers</h1>
                    <p>Manage all your Discord servers where AegisBot is active.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎮</div>
                        <h3>Gaming Community</h3>
                        <p>Main gaming server with 1,247 members</p>
                        <div className={dashStyles.featureItems}>
                            <span>All features enabled</span>
                            <span>Premium active</span>
                            <span>High activity</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>💼</div>
                        <h3>Developer Hub</h3>
                        <p>Development and coding community</p>
                        <div className={dashStyles.featureItems}>
                            <span>Security focused</span>
                            <span>Utility features</span>
                            <span>Moderate activity</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎨</div>
                        <h3>Art Community</h3>
                        <p>Creative and artistic server</p>
                        <div className={dashStyles.featureItems}>
                            <span>Gallery features</span>
                            <span>Event management</span>
                            <span>Growing community</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>➕</div>
                        <h3>Add New Server</h3>
                        <p>Invite AegisBot to another server</p>
                        <div className={dashStyles.featureItems}>
                            <span>Easy setup</span>
                            <span>Quick configuration</span>
                            <span>24/7 support</span>
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
    }

    

    return {
        props: {
            user: mockUser
        }
    };
};
