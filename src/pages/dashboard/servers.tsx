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

            <Header {...{user}} />
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
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.resolvedUrl || '/dashboard/servers')}`,
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
