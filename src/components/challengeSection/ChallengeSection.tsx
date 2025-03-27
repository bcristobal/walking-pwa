import React from 'react';
import ChallengeCard from '../challengeCard/ChallengeCard';
import { ChallengesProvider, useChallenges } from './ChallengesContext';
import styles from './challengeSection.module.css'

const ChallengeList: React.FC<{ title: string, challenges: any[], type: 'available' | 'accepted' }> = ({ 
    title, 
    challenges, 
    type 
}) => {
    const { acceptChallenge } = useChallenges();

    return (
        <div className="challenge-list-section">
            <h2>{title}</h2>
            {challenges.length === 0 ? (
                <p>No hay desafíos {type === 'available' ? 'disponibles' : 'aceptados'}</p>
            ) : (
                <div className="challenge-list-grid">
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="challenge-list-item">
                            <ChallengeCard
                                id={challenge.id}
                                name={challenge.name}
                                type={challenge.type}
                                description={challenge.description}
                                start_date={challenge.start_date}
                                finish_date={challenge.finish_date}
                                points={challenge.points}
                            />
                            {type === 'available' && (
                                <button 
                                    onClick={() => acceptChallenge(challenge.id)}
                                    className="accept-challenge-btn"
                                >
                                    Aceptar Desafío
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ChallengesSection() {
    const { availableChallenges, acceptedChallenges, loading, error } = useChallenges();

    if (loading) return <div>Cargando desafíos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="challenges-container">
            <ChallengeList 
                title="Desafíos Disponibles" 
                challenges={availableChallenges} 
                type="available" 
            />
            <ChallengeList 
                title="Desafíos Aceptados" 
                challenges={acceptedChallenges} 
                type="accepted" 
            />
        </div>
    );
}

export const ChallengesSectionWithProvider: React.FC = () => (
    <ChallengesProvider>
        <ChallengesSection />
    </ChallengesProvider>
);