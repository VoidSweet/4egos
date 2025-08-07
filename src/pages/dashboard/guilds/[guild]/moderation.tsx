import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/DashboardLayout.module.css';

interface ModerationProps {
  guildId: string;
}

export default function Moderation({ guildId }: ModerationProps) {
  const [moderationChannel, setModerationChannel] = useState('');
  const [punishmentChannel, setPunishmentChannel] = useState('');
  const [mandatoryReason, setMandatoryReason] = useState(false);
  const [autoModeration, setAutoModeration] = useState(false);
  const [logBansNotByBot, setLogBansNotByBot] = useState(false);
  const [logKicksNotByBot, setLogKicksNotByBot] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/moderation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moderationChannel,
          punishmentChannel,
          mandatoryReason,
          autoModeration,
          logBansNotByBot,
          logKicksNotByBot,
        }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <DashboardLayout guildId={guildId}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Moderation Settings</h1>
        
        <div className={styles.section}>
          <h2>Moderation Logs Channel</h2>
          <select 
            className={styles.select}
            value={moderationChannel}
            onChange={(e) => setModerationChannel(e.target.value)}
          >
            <option value="">Select Channel</option>
            <option value="general">general</option>
            <option value="mod-logs">mod-logs</option>
          </select>
          <p className={styles.description}>
            Channel where moderation logs will be sent.
            <br />
            <code style={{color: "var(--success-color)"}}>+ Shows author, user, reason, id and link to punishment log</code>
          </p>
        </div>

        <div className={styles.section}>
          <h2>Punishment Channel</h2>
          <select 
            className={styles.select}
            value={punishmentChannel}
            onChange={(e) => setPunishmentChannel(e.target.value)}
          >
            <option value="">Select Channel</option>
            <option value="general">general</option>
            <option value="punishments">punishments</option>
          </select>
          <p className={styles.description}>
            Channel where punishment messages will be sent.
            <br />
            <code style={{color: "var(--success-color)"}}>+ Customization possible (BETA)</code>
          </p>
        </div>

        <div className={styles.section}>
          <h2>Moderation Options</h2>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={mandatoryReason}
              onChange={(e) => setMandatoryReason(e.target.checked)}
            />
            <strong>Require reason for punishments</strong>
          </label>
          <p className={styles.description}>
            Make it mandatory to provide a reason when applying punishments.
            This only applies to users without the &quot;Punish without reason&quot; permission.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={autoModeration}
              onChange={(e) => setAutoModeration(e.target.checked)}
            />
            <strong>Enable Auto-Moderation</strong>
          </label>
          <p className={styles.description}>
            Automatically moderate messages based on configured rules.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={logBansNotByBot}
              onChange={(e) => setLogBansNotByBot(e.target.checked)}
            />
            <strong>Log bans not made by the bot</strong>
          </label>
          <p className={styles.description}>
            Record in the modlogs and punishment channels when a ban is applied that wasn&apos;t done by the bot.
            <br />To show the reason and author, you need to give the bot &quot;View Audit Log&quot; permission.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={logKicksNotByBot}
              onChange={(e) => setLogKicksNotByBot(e.target.checked)}
            />
            <strong>Log kicks not made by the bot</strong>
          </label>
          <p className={styles.description}>
            Record in the modlogs and punishment channels when a kick is applied that wasn&apos;t done by the bot.
          </p>
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
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