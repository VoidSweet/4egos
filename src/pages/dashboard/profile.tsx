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

export default function ProfileDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - User Profile</title>
                <meta name="description" content="Manage your personal profile and preferences" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>👤 User Profile</h1>
                    <p>Manage your personal settings, preferences, and activity history.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚙️</div>
                        <h3>Account Settings</h3>
                        <p>Configure your account preferences</p>
                        <div className={dashStyles.featureItems}>
                            <span>Privacy settings</span>
                            <span>Notification preferences</span>
                            <span>Display options</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📊</div>
                        <h3>Activity Summary</h3>
                        <p>View your server activity and statistics</p>
                        <div className={dashStyles.featureItems}>
                            <span>Message count</span>
                            <span>Voice time</span>
                            <span>XP progress</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🏆</div>
                        <h3>Achievements</h3>
                        <p>Track your accomplishments and badges</p>
                        <div className={dashStyles.featureItems}>
                            <span>Earned badges</span>
                            <span>Level milestones</span>
                            <span>Special rewards</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🔒</div>
                        <h3>Security</h3>
                        <p>Manage your account security settings</p>
                        <div className={dashStyles.featureItems}>
                            <span>Two-factor auth</span>
                            <span>Login history</span>
                            <span>Connected accounts</span>
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
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.resolvedUrl || '/dashboard/profile')}`,
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
