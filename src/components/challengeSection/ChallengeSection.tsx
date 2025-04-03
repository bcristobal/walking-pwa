import { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { GamificationService } from '../../services/gamificationService';
import ChallengeCard from '../challengeCard/ChallengeCard';
import styles from './challengeSection.module.css';

interface Challenge {
  id: string;
  name: string;
  type: string;
  description: string;
  start_date: string;
  finish_date: string;
  points: number;
}

interface ChallengesResponse {
  items: Challenge[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export default function ChallengeSection() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [status, setStatus] = useState<string>('active');
  const limit = 6;

  useEffect(() => {
    fetchChallenges();
  }, [page, status]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }
      
      const response = await GamificationService.fetchChallenges(token, page * limit, limit, status);
      console.log('Challenges response:', response);
      
      if (response && Array.isArray(response.items)) {
        setChallenges(response.items);
        setTotalPages(response.pages || 1);
      } else if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        setChallenges(response);
        setTotalPages(1);
      } else {
        console.error('Formato de respuesta inesperado:', response);
        setError('Formato de respuesta no reconocido');
      }
    } catch (err) {
      console.error('Error al cargar desafíos:', err);
      setError(`Error al cargar los desafíos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }
      
      await GamificationService.acceptChallenge(token, challengeId);
      // Refrescar la lista después de aceptar un desafío
      fetchChallenges();
      
    } catch (err) {
      console.error('Error al aceptar el desafío:', err);
      setError(`Error al aceptar el desafío: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setLoading(false);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch (e) {
      return dateString; // Si hay error, devolver el string original
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(0); // Resetear a la primera página al cambiar el filtro
  };

  return (
    <div className={styles.challenge_section}>
      <div className={styles.section_header}>
        <h1 className={styles.section_title}>Desafíos Disponibles</h1>
        <p className={styles.section_description}>
          Explora y participa en los desafíos disponibles para mejorar tu experiencia
        </p>
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filter_button} ${status === 'active' ? styles.active : ''}`}
          onClick={() => handleStatusChange('active')}
        >
          Activos
        </button>
        <button 
          className={`${styles.filter_button} ${status === 'upcoming' ? styles.active : ''}`}
          onClick={() => handleStatusChange('upcoming')}
        >
          Próximos
        </button>
        <button 
          className={`${styles.filter_button} ${status === 'completed' ? styles.active : ''}`}
          onClick={() => handleStatusChange('completed')}
        >
          Completados
        </button>
      </div>

      {loading && (
        <div className={styles.loading_state}>
          <span className={styles.loading_spinner}></span>
          <p>Cargando desafíos...</p>
        </div>
      )}

      {error && (
        <div className={styles.error_state}>
          <p className={styles.error_message}>{error}</p>
          <button 
            className={styles.retry_button}
            onClick={() => fetchChallenges()}
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {!loading && !error && challenges.length === 0 && (
        <div className={styles.empty_state}>
          <p className={styles.empty_message}>No hay desafíos disponibles en este momento</p>
        </div>
      )}

      <div className={styles.challenges_grid}>
        {challenges.map((challenge) => (
          <div key={challenge.id} className={styles.challenge_card_container}>
            <ChallengeCard
              id={challenge.id}
              name={challenge.name || 'Sin nombre'}
              type={challenge.type || 'individual'}
              description={challenge.description || 'Sin descripción'}
              start_date={formatDate(challenge.start_date || '')}
              finish_date={formatDate(challenge.finish_date || '')}
              points={`${challenge.points}`}
            />
            <button 
              className={styles.accept_button}
              onClick={() => handleAcceptChallenge(challenge.id)}
            >
              Participar
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pagination_button}
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
          >
            &lt; Anterior
          </button>
          <span className={styles.page_indicator}>
            Página {page + 1} de {totalPages}
          </span>
          <button 
            className={styles.pagination_button}
            disabled={page === totalPages - 1}
            onClick={() => handlePageChange(page + 1)}
          >
            Siguiente &gt;
          </button>
        </div>
      )}
    </div>
  );
}