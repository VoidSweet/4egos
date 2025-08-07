import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import styles from '../../../styles/DashboardLayout.module.css';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const [username, setUsername] = useState('User#1234');
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>User Profile</h1>
        
        <div className={styles.section}>
          <h2>Account Information</h2>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              <img 
                src="https://cdn.discordapp.com/embed/avatars/0.png" 
                alt="Profile Avatar"
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.userInfo}>
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  readOnly
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </label>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Preferences</h2>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <strong>Enable Notifications</strong>
          </label>
          <p className={styles.description}>
            Receive notifications about important updates and activities.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <strong>Dark Mode</strong>
          </label>
          <p className={styles.description}>
            Use dark theme for the dashboard interface.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Servers Managed</h3>
              <span className={styles.statNumber}>5</span>
            </div>
            <div className={styles.statCard}>
              <h3>Commands Used</h3>
              <span className={styles.statNumber}>1,234</span>
            </div>
            <div className={styles.statCard}>
              <h3>Member Since</h3>
              <span className={styles.statNumber}>Jan 2024</span>
            </div>
          </div>
        </div>

        <button className={styles.saveButton}>
          Save Profile
        </button>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      user: null,
    },
  };
};
