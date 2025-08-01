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

            <Header {...{user}} />
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
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.resolvedUrl || '/dashboard/console')}`,
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
