import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/guild.module.css';

interface IUser {
  id: string;
  username: string;
  avatar: string;
}

interface IGuildRole {
  id: string;
  name: string;
  permissions: string[];
}

interface IGuild {
  id: string;
  name: string;
  icon: string;
  roles: IGuildRole[];
}

interface IProps {
  guildId: string;
}

const permissionsNames = {
  LUNAR_BAN_MEMBERS: 'Ban Members',
  LUNAR_KICK_MEMBERS: 'Kick Members',
  LUNAR_MUTE_MEMBERS: 'Mute Members',
  LUNAR_ADV_MEMBERS: 'Warn Members',
  LUNAR_NOT_REASON: 'Punish without Reason',
  LUNAR_VIEW_HISTORY: 'View History',
  LUNAR_MANAGE_HISTORY: 'Manage History',
};

export default function GuildPermissions({ guildId }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [guild, setGuild] = useState<IGuild | null>(null);
  const [permissions, setPermissions] = useState<[string, number][]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/guilds/${guildId}/permissions`);
        if (response.ok) {
          const data = await response.json();
          setGuild(data.guild);
          setPermissions(data.permissions || []);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch guild permissions:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (guildId) {
      fetchGuildData();
    }
  }, [guildId, router]);

  const handlePermissionChange = async (roleId: string, permission: string, value: boolean) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleId,
          permission,
          value,
        }),
      });

      if (response.ok) {
        // Update local state
        setPermissions(prev => 
          prev.map(([id, perms]) => 
            id === roleId 
              ? [id, value ? perms | (1 << Object.keys(permissionsNames).indexOf(permission)) : perms & ~(1 << Object.keys(permissionsNames).indexOf(permission))]
              : [id, perms]
          )
        );
      }
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading permissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!guild) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className={styles.error}>
          <h2>Guild not found</h2>
          <p>Unable to load guild permissions.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout guildId={guildId}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Permissions - {guild.name}</h1>
          <p>Configure role-based permissions for bot commands</p>
        </div>

        <div className={styles.content}>
          <div className={styles.roleSelector}>
            <label htmlFor="role-select">Select Role:</label>
            <select 
              id="role-select"
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a role...</option>
              {guild.roles?.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRole && (
            <div className={styles.permissionsGrid}>
              <h3>Permissions for {guild.roles?.find(r => r.id === selectedRole)?.name}</h3>
              <div className={styles.permissionsList}>
                {Object.entries(permissionsNames).map(([key, name]) => {
                  const rolePermissions = permissions.find(([id]) => id === selectedRole)?.[1] || 0;
                  const hasPermission = (rolePermissions & (1 << Object.keys(permissionsNames).indexOf(key))) !== 0;
                  
                  return (
                    <div key={key} className={styles.permissionItem}>
                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={hasPermission}
                          onChange={(e) => handlePermissionChange(selectedRole, key, e.target.checked)}
                          className={styles.checkbox}
                        />
                        <span className={styles.permissionName}>{name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {permissions.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No permissions configured</h3>
              <p>Permissions will appear here once roles are set up.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { guild } = context.params || {};
  
  return {
    props: {
      guildId: guild as string,
    },
  };
};