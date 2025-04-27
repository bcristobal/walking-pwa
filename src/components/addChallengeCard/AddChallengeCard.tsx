import styles from './addChallengeCard.module.css';

interface AddChallengeCardProps {
  id: string;
  name: string;
  type: string;
  description: string;
  start_date: string;
  finish_date: string;
  points: string;
  onAddChallenge: (id: string) => void;
  status?: string; // Add status prop to determine if challenge is past
}

export default function AddChallengeCard({
  id, 
  name, 
  type, 
  description, 
  start_date, 
  finish_date, 
  points,
  onAddChallenge,
  status = 'ongoing' // Default to ongoing if not provided
}: AddChallengeCardProps) {
  // Determinar el color del tipo de desafío
  const getTypeColor = () => {
    switch(type.toLowerCase()) {
      case 'individual': return styles.color_individual;
      case 'collaborative': return styles.color_collaborative;
      case 'competitive': return styles.color_competitive;
      default: return styles.color_other;
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddChallenge(id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Aquí iría la lógica para ver detalles
  };

  return (
    <div className={styles.challenge_card}>
      <div className={`${styles.card_header} ${getTypeColor()}`}>
        <div className={styles.header_content}>
          <h2 className={styles.challenge_title}>{name}</h2>
          <span className={styles.challenge_type}>{type}</span>
        </div>
      </div>
                
      <div className={styles.card_body}>
        <p className={styles.challenge_description}>{description}</p>
        
        <div className={styles.challenge_metadata}>
          <div className={styles.date_container}>
            <div className={styles.date_group}>
              <span className={styles.date_label}>DESDE</span>
              <span className={styles.date_value}>{start_date}</span>
            </div>
            <div className={styles.date_divider}></div>
            <div className={styles.date_group}>
              <span className={styles.date_label}>HASTA</span>
              <span className={styles.date_value}>{finish_date}</span>
            </div>
          </div>
          
          <div className={styles.footer_container}>
            <div className={styles.points_wrapper}>
              <span className={`${styles.points_value} ${getTypeColor()}`}>{points}</span>
              <span className={styles.points_label}>PUNTOS</span>
            </div>
          </div>
        </div>
        
        <div className={styles.buttons_container}>
          {status !== 'past' && (
            <button 
              className={`${styles.add_button} ${getTypeColor()}`}
              onClick={handleAddClick}
              aria-label="Añadir a mis retos"
            >
              <span>Añadir +</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}