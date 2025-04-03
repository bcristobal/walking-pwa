import styles from './challengeCard.module.css';

interface ChallengeCardProps {
    id: string;
    name: string;
    type: string;
    description: string;
    start_date: string;
    finish_date: string;
    points: string;
}

export default function ChallengeCard({id, name, type, description, start_date, finish_date, points}: ChallengeCardProps) {
  // Determinar el color del tipo de desafío para usar en múltiples lugares
  const getTypeColor = () => {
    switch(type.toLowerCase()) {
      case 'individual': return styles.color_individual;
      case 'collaborative': return styles.color_collaborative;
      case 'competitive': return styles.color_competitive;
      default: return styles.color_other;
    }
  };

  return (
    <div className={styles.challenge_card}>
        <a href={`#/${id}`}>
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
                    
                    <div className={styles.points_wrapper}>
                        <span className={`${styles.points_value} ${getTypeColor()}`}>{points}</span>
                        <span className={styles.points_label}>PUNTOS</span>
                    </div>
                </div>
            </div>
        </a>
    </div>
  );
}