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

export default function ConsoleDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Server Console</title>
                <meta name="description" content="Advanced server monitoring and management console" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🖥️ Server Console</h1>
                    <p>Real-time server monitoring, logs, and administrative controls.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📊</div>
                        <h3>Live Statistics</h3>
                        <p>Real-time server performance monitoring</p>
                        <div className={dashStyles.featureItems}>
                            <span>Member activity</span>
                            <span>Bot performance</span>
                            <span>Server health</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📝</div>
                        <h3>System Logs</h3>
                        <p>Comprehensive logging and audit trails</p>
                        <div className={dashStyles.featureItems}>
                            <span>Event logs</span>
                            <span>Error tracking</span>
                            <span>Admin actions</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚡</div>
                        <h3>Quick Actions</h3>
                        <p>Fast access to common administrative tasks</p>
                        <div className={dashStyles.featureItems}>
                            <span>Bulk operations</span>
                            <span>Emergency controls</span>
                            <span>System commands</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🔍</div>
                        <h3>Advanced Search</h3>
                        <p>Powerful search and filtering capabilities</p>
                        <div className={dashStyles.featureItems}>
                            <span>Member lookup</span>
                            <span>Message search</span>
                            <span>Event filtering</span>
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
