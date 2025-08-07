import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/DashboardLayout.module.css';

interface EconomyProps {
  guildId: string;
}

export default function Economy({ guildId }: EconomyProps) {
  const [dailyReward, setDailyReward] = useState(100);
  const [shopEnabled, setShopEnabled] = useState(false);
  const [currencyName, setCurrencyName] = useState('coins');

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Economy Settings</h1>
        
        <div className={styles.section}>
          <h2>Currency Settings</h2>
          <label>
            Currency Name:
            <input
              type="text"
              value={currencyName}
              onChange={(e) => setCurrencyName(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.section}>
          <h2>Daily Rewards</h2>
          <label>
            Daily Reward Amount:
            <input
              type="number"
              value={dailyReward}
              onChange={(e) => setDailyReward(Number(e.target.value))}
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.section}>
          <h2>Shop Settings</h2>
          <label>
            <input
              type="checkbox"
              checked={shopEnabled}
              onChange={(e) => setShopEnabled(e.target.checked)}
            />
            Enable Shop System
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