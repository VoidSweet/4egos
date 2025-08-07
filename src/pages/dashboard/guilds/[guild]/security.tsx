import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/DashboardLayout.module.css';

interface SecurityProps {
  guildId: string;
}

export default function Security({ guildId }: SecurityProps) {
  const [antiSpam, setAntiSpam] = useState(false);
  const [antiRaid, setAntiRaid] = useState(false);
  const [verification, setVerification] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Security Settings</h1>
        
        <div className={styles.section}>
          <h2>Anti-Spam</h2>
          <label>
            <input
              type="checkbox"
              checked={antiSpam}
              onChange={(e) => setAntiSpam(e.target.checked)}
            />
            Enable Anti-Spam Protection
          </label>
        </div>

        <div className={styles.section}>
          <h2>Anti-Raid</h2>
          <label>
            <input
              type="checkbox"
              checked={antiRaid}
              onChange={(e) => setAntiRaid(e.target.checked)}
            />
            Enable Anti-Raid Protection
          </label>
        </div>

        <div className={styles.section}>
          <h2>Verification</h2>
          <label>
            <input
              type="checkbox"
              checked={verification}
              onChange={(e) => setVerification(e.target.checked)}
            />
            Enable Member Verification
          </label>
        </div>

        <button className={styles.saveButton}>
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { guild } = context.params!;
  
  return {
    props: {
      guildId: guild as string,
    },
  };
};