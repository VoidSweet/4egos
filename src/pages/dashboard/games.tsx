import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from '../../styles/DashboardLayout.module.css';

interface Game {
  id: string;
  name: string;
  description: string;
  players: number;
  status: 'active' | 'maintenance' | 'offline';
}

interface GamesProps {
  // Add any server-side props here
}

export default function Games({}: GamesProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual endpoint
        const mockGames: Game[] = [
          {
            id: '1',
            name: 'Truth or Dare',
            description: 'Classic truth or dare game with custom questions',
            players: 156,
            status: 'active'
          },
          {
            id: '2',
            name: 'Trivia Quiz',
            description: 'Test your knowledge with various trivia categories',
            players: 89,
            status: 'active'
          },
          {
            id: '3',
            name: 'Word Association',
            description: 'Quick thinking word game for server members',
            players: 34,
            status: 'maintenance'
          }
        ];
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGames(mockGames);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const getStatusColor = (status: Game['status']) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'maintenance':
        return '#f59e0b';
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: Game['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'Maintenance';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.pageContainer}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading games...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Games Dashboard</h1>
          <p className={styles.pageDescription}>
            Manage and monitor bot games and activities
          </p>
        </div>

        <div className={styles.section}>
          <h2>Available Games</h2>
          <div className={styles.gamesGrid}>
            {games.map((game) => (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameHeader}>
                  <h3 className={styles.gameName}>{game.name}</h3>
                  <span 
                    className={styles.gameStatus}
                    style={{ backgroundColor: getStatusColor(game.status) }}
                  >
                    {getStatusText(game.status)}
                  </span>
                </div>
                
                <p className={styles.gameDescription}>{game.description}</p>
                
                <div className={styles.gameStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Active Players:</span>
                    <span className={styles.statValue}>{game.players}</span>
                  </div>
                </div>

                <div className={styles.gameActions}>
                  <button 
                    className={styles.button}
                    disabled={game.status !== 'active'}
                  >
                    Configure
                  </button>
                  <button 
                    className={styles.buttonSecondary}
                    disabled={game.status !== 'active'}
                  >
                    View Stats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {games.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No games available</h3>
            <p>Games will appear here when they are configured and active.</p>
          </div>
        )}

        <div className={styles.section}>
          <h2>Game Settings</h2>
          <div className={styles.settingsGrid}>
            <div className={styles.settingCard}>
              <h4>Auto-Start Games</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Automatically start games when conditions are met</span>
              </label>
            </div>

            <div className={styles.settingCard}>
              <h4>Game Notifications</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Send notifications when games start or end</span>
              </label>
            </div>

            <div className={styles.settingCard}>
              <h4>Player Limits</h4>
              <div className={styles.inputGroup}>
                <label>Maximum players per game:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  defaultValue="20"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Add any server-side data fetching here
  return {
    props: {},
  };
};
