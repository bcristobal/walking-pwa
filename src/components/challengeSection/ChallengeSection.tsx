import { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { GamificationService } from '../../services/gamificationService';
import AddChallengeCard from '../addChallengeCard/AddChallengeCard';
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
  const [status, setStatus] = useState<string>('ongoing'); // Estado inicial para los filtros
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
      
      // Ensure we're passing the correct parameters to the service
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
      const token = AuthService.getToken();
      
      if (!token) {
        setError('No estás autenticado');
        return;
      }
      
      setLoading(true);
      
      // Proper error handling for the accept challenge call
      try {
        await GamificationService.acceptChallenge(token, challengeId);
        window.location.href = '/challenges';
        // Success notification could be added here
      } catch (acceptError) {
        console.error('Error en GamificationService.acceptChallenge:', acceptError);
        setError(`Error al aceptar el desafío: ${acceptError instanceof Error ? acceptError.message : 'Error desconocido'}`);
        return; // Return early if there's an error
      }
      
      // Refrescar la lista después de aceptar un desafío
      await fetchChallenges();
    } catch (err) {
      console.error('Error al procesar la aceptación del desafío:', err);
      setError(`Error al procesar la solicitud: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
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
          className={`${styles.filter_button} ${status === 'ongoing' ? styles.active : ''}`}
          onClick={() => handleStatusChange('ongoing')}
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
          className={`${styles.filter_button} ${status === 'past' ? styles.active : ''}`}
          onClick={() => handleStatusChange('past')}
        >
          Pasados
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
            onClick={() => {
              setError(null);
              fetchChallenges();
            }}
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
            <AddChallengeCard
              id={challenge.id}
              name={challenge.name || 'Sin nombre'}
              type={challenge.type || 'individual'}
              description={challenge.description || 'Sin descripción'}
              start_date={formatDate(challenge.start_date || '')}
              finish_date={formatDate(challenge.finish_date || '')}
              points={`${challenge.points}`}
              onAddChallenge={handleAcceptChallenge}
              status={status} // Pass the current status to the component
            />
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