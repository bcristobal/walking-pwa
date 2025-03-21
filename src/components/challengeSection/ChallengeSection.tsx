import { useState, useEffect } from "react";
import ChallengeCard from "../challengeCard/ChallengeCard";

interface Challenge {
    id: string;
    name: string;
    type: string;
    description: string;
    start_date: string;
    finish_date: string;
    points: number;
}

export default function ChallengeSection() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true);
            const apiUrl = "http://127.0.0.1:8000";
            
            try {
                const response = await fetch(`${apiUrl}/games/walking-pwa/challenges?skip=1&limit=4&status=all`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setChallenges(data);
                    console.log("Challenges cargados:", data);
                } else {
                    setError(`Error en la respuesta: ${response.status}`);
                    console.error('Error en la respuesta:', response.status);
                }
            } catch (error) {
                setError(`Error al cargar los desafíos: ${error}`);
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    return (
        <section className="challenge_section">
            <h1>Desafíos</h1>
            {loading && <p>Cargando desafíos...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && challenges.length === 0 && (
                <p>No hay desafíos disponibles</p>
            )}
            <div className="challenge_list">
                {challenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        id={challenge.id}
                        name={challenge.name}
                        type={challenge.type}
                        description={challenge.description}
                        start_date={challenge.start_date}
                        finish_date={challenge.finish_date}
                        points={challenge.points}
                    />
                ))}
            </div>
        </section>
    );
}