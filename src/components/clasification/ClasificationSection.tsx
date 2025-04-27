import { useEffect, useState } from 'react';
import { GamificationService } from '../../services/gamificationService'
import styles from './clasificationSection.module.css'

interface UserRanking {
  rank: number;
  username: string;
  points: number;
}

export default function ClassificationSection() {
    const [ranking, setRanking] = useState<UserRanking[]>([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await GamificationService.fetchClassification();
                setRanking(data);
            } catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };
        
        fetchRanking();
    }, []);

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Clasificación</h2>
            <div className="classification-container">
                <table className="classification-table">
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Usuario</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((user) => (
                            <tr key={user.username}>
                                <td>{user.rank}</td>
                                <td>{user.username}</td>
                                <td>{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}