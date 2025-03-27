import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Challenge, ChallengeParticipation } from './challenge-types';
import { AuthService } from '../../services/authService';

interface ChallengesContextType {
    acceptedChallenges: ChallengeParticipation[];
    availableChallenges: Challenge[];
    loading: boolean;
    error: string | null;
    acceptChallenge: (challengeId: string) => Promise<void>;
}

const ChallengesContext = createContext<ChallengesContextType>({
    acceptedChallenges: [],
    availableChallenges: [],
    loading: true,
    error: null,
    acceptChallenge: async () => {}
});

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [acceptedChallenges, setAcceptedChallenges] = useState<ChallengeParticipation[]>([]);
    const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChallenges = async () => {
        setLoading(true);
        const token = AuthService.getToken();
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }

        try {
            // Fetch available challenges
            const availableChallengesResponse = await fetch('http://127.0.0.1:8000/gamification-api/games/walking-pwa/challenges?skip=0&limit=10&status=new', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });

            // Fetch user's accepted challenges
            const acceptedChallengesResponse = await fetch('http://127.0.0.1:8000/gamification-api/games/walking-pwa/my-challenges', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });

            if (availableChallengesResponse.ok && acceptedChallengesResponse.ok) {
                const availableChallengesData = await availableChallengesResponse.json();
                const acceptedChallengesData = await acceptedChallengesResponse.json();

                setAvailableChallenges(availableChallengesData);
                setAcceptedChallenges(acceptedChallengesData);
            } else {
                setError('Failed to fetch challenges');
            }
        } catch (error) {
            setError(`Error fetching challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const acceptChallenge = async (challengeId: string) => {
        const token = AuthService.getToken();
        if (!token) {
            setError('No authentication token found');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/gamification-api/games/walking-pwa/challenges/${challengeId}/participations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "dificulty": "easy",
                }),
            });

            if (response.ok) {
                // Refresh challenges after accepting
                await fetchChallenges();
            } else {
                const errorData = await response.json();
                setError(`Failed to accept challenge: ${errorData.detail}`);
            }
        } catch (error) {
            setError(`Error accepting challenge: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    return (
        <ChallengesContext.Provider value={{
            acceptedChallenges,
            availableChallenges,
            loading,
            error,
            acceptChallenge
        }}>
            {children}
        </ChallengesContext.Provider>
    );
};

export const useChallenges = () => useContext(ChallengesContext);