import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function UtilitiesDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Utilities</title>
                <meta name="description" content="Essential server utilities and management tools" />
            </Head>

            <Header {...{user}} />
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🔧 Server Utilities</h1>
                    <p>Essential tools for server management, automation, and member engagement.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🔔</div>
                        <h3>Notification System</h3>
                        <p>Smart notification and announcement management</p>
                        <div className={dashStyles.featureItems}>
                            <span>Auto-announcements</span>
                            <span>Event reminders</span>
                            <span>Welcome messages</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📋</div>
                        <h3>Channel Management</h3>
                        <p>Advanced channel creation and organization</p>
                        <div className={dashStyles.featureItems}>
                            <span>Auto-channels</span>
                            <span>Category organization</span>
                            <span>Permission sync</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚙️</div>
                        <h3>Server Tools</h3>
                        <p>Comprehensive server maintenance utilities</p>
                        <div className={dashStyles.featureItems}>
                            <span>Backup system</span>
                            <span>Bulk operations</span>
                            <span>Migration tools</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎯</div>
                        <h3>Custom Commands</h3>
                        <p>Create and manage custom server commands</p>
                        <div className={dashStyles.featureItems}>
                            <span>Command builder</span>
                            <span>Response templates</span>
                            <span>Permission controls</span>
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
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.req.url)}`,
                permanent: false,
            }
        };
    }

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
            user: mockUser
        }
    };
};
