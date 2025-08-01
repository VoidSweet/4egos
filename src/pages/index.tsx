import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/home.module.css';

export default function HomePage() {
    return (
        <>
            <Head>
                <title>AegisBot Dashboard - Discord Server Management</title>
                <meta name="description" content="Professional Discord bot dashboard for complete server management" />
            </Head>
            
            <div className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            🛡️ <span className={styles.brandText}>AegisBot</span> Dashboard
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Professional Discord server management with advanced security, 
                            economy system, moderation tools, and comprehensive analytics.
                        </p>
                        
                        <div className={styles.heroButtons}>
                            <Link href="/dashboard">
                                <a className={styles.primaryBtn}>
                                    <i className="fas fa-tachometer-alt"></i>
                                    Access Dashboard
                                </a>
                            </Link>
                            <Link href="/invite">
                                <a className={styles.secondaryBtn}>
                                    <i className="fab fa-discord"></i>
                                    Invite Bot
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Comprehensive Server Management</h2>
                    
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🛡️</div>
                            <h3>Advanced Security</h3>
                            <p>Anti-nuke protection, heat-based spam detection, and intelligent verification system.</p>
                            <ul>
                                <li>Real-time threat monitoring</li>
                                <li>Auto-quarantine system</li>
                                <li>Whitelist management</li>
                                <li>Panic mode protection</li>
                            </ul>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>💰</div>
                            <h3>Economy System</h3>
                            <p>Complete economic ecosystem with banking, jobs, shop system, and detailed analytics.</p>
                            <ul>
                                <li>Multi-currency support</li>
                                <li>Banking with interest</li>
                                <li>Job system & daily rewards</li>
                                <li>Custom shop integration</li>
                            </ul>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📈</div>
                            <h3>Leveling & XP</h3>
                            <p>Engaging progression system with role rewards, leaderboards, and competitions.</p>
                            <ul>
                                <li>Customizable XP rates</li>
                                <li>Automatic role rewards</li>
                                <li>Weekly competitions</li>
                                <li>Global leaderboards</li>
                            </ul>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔨</div>
                            <h3>Moderation Tools</h3>
                            <p>Professional moderation suite with auto-mod, warning system, and detailed logging.</p>
                            <ul>
                                <li>Smart auto-moderation</li>
                                <li>Warning escalation</li>
                                <li>Punishment management</li>
                                <li>Complete audit logs</li>
                            </ul>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎮</div>
                            <h3>Games & Entertainment</h3>
                            <p>Interactive games with economy integration, tournaments, and special events.</p>
                            <ul>
                                <li>Trivia & word games</li>
                                <li>Casino games</li>
                                <li>Daily challenges</li>
                                <li>Seasonal events</li>
                            </ul>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🛠️</div>
                            <h3>Utility Features</h3>
                            <p>Essential server utilities including welcome system, reaction roles, and tickets.</p>
                            <ul>
                                <li>Custom welcome messages</li>
                                <li>Reaction role system</li>
                                <li>Ticket support system</li>
                                <li>Custom commands</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Trusted by Discord Communities</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>10,000+</div>
                            <div className={styles.statLabel}>Servers Protected</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>2M+</div>
                            <div className={styles.statLabel}>Users Managed</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>99.9%</div>
                            <div className={styles.statLabel}>Uptime</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>24/7</div>
                            <div className={styles.statLabel}>Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.cta}>
                <div className={styles.container}>
                    <h2>Ready to Transform Your Discord Server?</h2>
                    <p>Join thousands of server owners who trust AegisBot for professional Discord management.</p>
                    <Link href="/login">
                        <a className={styles.ctaBtn}>
                            <i className="fab fa-discord"></i>
                            Get Started Now
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
}
