import { useEffect, useState } from 'react';
import styles from './welcomeComponent.module.css';

interface UserData {
  username: string;
  total_xp: number;
  total_points: number;
  streak_days: number;
  current_level: number;
  level_name: string;
  xp_for_next_level: number;
  total_challenges: number;
  completed_challenges: number;
  completion_rate: number;
  last_activity: string;
}

export default function WelcomeComponent() {
  const [userData, setUserData] = useState<UserData>({
    username: "admin",
    total_xp: 1300,
    total_points: 1300,
    streak_days: 1,
    current_level: 2,
    level_name: "Novice",
    xp_for_next_level: 1700,
    total_challenges: 5,
    completed_challenges: 4,
    completion_rate: 80,
    last_activity: "2025-04-25T19:13:11.211182"
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateXpProgress = () => {
    const progressPercentage = (userData.total_xp / userData.xp_for_next_level) * 100;
    return Math.min(progressPercentage, 100);
  };

  const calculateChallengeProgress = () => {
    return (userData.completed_challenges / userData.total_challenges) * 100;
  };

  return (
    <div className={styles.welcome_container}>
      <div className={styles.welcome_card}>
        <div className={styles.welcome_header}>
          <h1>
            ¡Bienvenido de nuevo, <span className={styles.username}>{userData.username}</span>!
          </h1>
          <p className={styles.last_activity}>Última actividad: {formatDate(userData.last_activity)}</p>
        </div>

        <div className={styles.info_panels}>
          <div className={styles.progress_panel}>
            <h2>Tu Progreso</h2>
            
            <div className={styles.level_progress}>
              <div className={styles.level_info}>
                <span>Nivel {userData.current_level}: {userData.level_name}</span>
                <span>{userData.total_xp} / {userData.xp_for_next_level} XP</span>
              </div>
              <div className={styles.progress_bar_container}>
                <div 
                  className={`${styles.progress_bar} ${styles.xp_bar}`}
                  style={{ width: `${calculateXpProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className={styles.stats_grid}>
              <div className={styles.stat_card}>
                <p className={styles.stat_label}>Puntos Totales</p>
                <p className={`${styles.stat_value} ${styles.points_value}`}>{userData.total_points}</p>
              </div>
              <div className={styles.stat_card}>
                <p className={styles.stat_label}>Racha Actual</p>
                <p className={`${styles.stat_value} ${styles.streak_value}`}>{userData.streak_days} {userData.streak_days === 1 ? 'día' : 'días'}</p>
              </div>
            </div>
          </div>

          <div className={styles.challenges_panel}>
            <h2>Tus Retos</h2>
            
            <div className={styles.challenge_progress}>
              <div className={styles.challenge_info}>
                <span>Progreso de Retos</span>
                <span>{userData.completed_challenges} / {userData.total_challenges}</span>
              </div>
              <div className={styles.progress_bar_container}>
                <div 
                  className={`${styles.progress_bar} ${styles.challenge_bar}`}
                  style={{ width: `${calculateChallengeProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className={styles.completion_card}>
              <div className={styles.completion_info}>
                <div>
                  <p className={styles.completion_title}>Tasa de Finalización</p>
                  <p className={styles.completion_subtitle}>Has completado el {userData.completion_rate}% de los retos</p>
                </div>
                <div className={styles.completion_rate}>{userData.completion_rate}%</div>
              </div>
            </div>
            
            {userData.total_challenges - userData.completed_challenges > 0 && (
              <div className={styles.pending_alert}>
                <p>
                  ¡Tienes {userData.total_challenges - userData.completed_challenges} {(userData.total_challenges - userData.completed_challenges) === 1 ? 'reto pendiente' : 'retos pendientes'}!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}