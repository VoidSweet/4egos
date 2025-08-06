import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DiscordLoginButton from '../components/DiscordLoginButton';
import styles from '../styles/Login.module.css';

export default function Login() {
    return (
        <>
            <Head>
                <title>Login - AegisBot Dashboard</title>
                <meta name="description" content="Login to access your AegisBot dashboard" />
            </Head>
            
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        <h1>🛡️ AegisBot</h1>
                        <h2>Login to Dashboard</h2>
                        <p>Secure access to your Discord server management</p>
                    </div>

                    <div className={styles.loginContent}>
                        <DiscordLoginButton 
                            size="large"
                            className={styles.discordLoginBtn}
                            redirectTo="/dashboard"
                        >
                            <i className="fab fa-discord"></i>
                            Continue with Discord
                        </DiscordLoginButton>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <i className="fas fa-shield-alt"></i>
                                <span>Advanced Security</span>
                            </div>
                            <div className={styles.feature}>
                                <i className="fas fa-coins"></i>
                                <span>Economy System</span>
                            </div>
                            <div className={styles.feature}>
                                <i className="fas fa-chart-line"></i>
                                <span>Real-time Analytics</span>
                            </div>
                            <div className={styles.feature}>
                                <i className="fas fa-cogs"></i>
                                <span>Easy Configuration</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.loginFooter}>
                        <p>
                            Don&apos;t have AegisBot in your server?{' '}
                            <Link href="/invite">
                                Invite it now
                            </Link>
                        </p>
                        <p>
                            <Link href="/">
                                ← Back to Home
                            </Link>
                        </p>
                    </div>
                </div>

                <div className={styles.backgroundPattern}></div>
            </div>
        </>
    );
}
