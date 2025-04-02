import { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { GamificationService } from '../../services/gamificationService';
import ChallengeCard from '../challengeCard/ChallengeCard';
import styles from './myChallengeSection.module.css';

interface Challenge {
  id: string;
  name: string;
  type: string;
  description: string;
  start_date: string;
  finish_date: string;
  points: number;
}

export default function MyChallengeSection() {
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    const fetchMyChallenges = async () => {
      try {
        setLoading(true);
        const token = AuthService.getToken();
        
        if (!token) {
          setError('No estás autenticado');
          setLoading(false);
          return;
        }
        
        console.log('Fetching challenges with token:', token);
        const rawData = await GamificationService.fetchMyChallenges(token);
        console.log('API response:', rawData);
        
        // Guardar la respuesta completa para debugging
        setResponseData(rawData);
        
        // Verificar si la respuesta tiene la estructura esperada
        if (Array.isArray(rawData)) {
          setMyChallenges(rawData);
        } else if (rawData && Array.isArray(rawData.items || rawData.challenges || rawData.data)) {
          // Intentar diferentes propiedades comunes para arrays de desafíos
          const challenges = rawData.items || rawData.challenges || rawData.data;
          setMyChallenges(challenges);
        } else {
          console.error('Formato de respuesta inesperado:', rawData);
          setError('Formato de respuesta no reconocido');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error detallado al cargar desafíos:', err);
        setError(`Error al cargar tus desafíos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchMyChallenges();
  }, []);

  // Función de ayuda para formatear fechas si es necesario
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch (e) {
      return dateString; // Si hay error, devolver el string original
    }
  };

  return (
    <div className={styles.challenge_section}>
      <div className={styles.section_header}>
        <h1 className={styles.section_title}>Mis Desafíos</h1>
        <p className={styles.section_description}>
          Estos son los desafíos en los que estás participando actualmente
        </p>
      </div>

      {loading && (
        <div className={styles.loading_state}>
          <span className={styles.loading_spinner}></span>
          <p>Cargando tus desafíos...</p>
        </div>
      )}

      {error && (
        <div className={styles.error_state}>
          <p className={styles.error_message}>{error}</p>
          <button 
            className={styles.retry_button}
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {!loading && !error && myChallenges.length === 0 && (
        <div className={styles.empty_state}>
          <p className={styles.empty_message}>No tienes desafíos activos actualmente</p>
          <a href="/challenges" className={styles.browse_button}>
            Explorar desafíos disponibles
          </a>
        </div>
      )}

      <div className={styles.challenges_grid}>
        {myChallenges.map((challenge) => {
          // Verificar que challenge tenga todas las propiedades necesarias
          if (!challenge || !challenge.id) {
            console.warn('Challenge inválido:', challenge);
            return null;
          }
          
          return (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              name={challenge.name || 'Sin nombre'}
              type={challenge.type || 'individual'}
              description={challenge.description || 'Sin descripción'}
              start_date={formatDate(challenge.start_date || '')}
              finish_date={formatDate(challenge.finish_date || '')}
              points={challenge.points || 0}
            />
          );
        })}
      </div>

    </div>
  );
}