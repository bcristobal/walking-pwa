export class GamificationService {
    private static API_URL = 'http://127.0.0.1:8000/gamification-api/games/walking-pwa'

    static fetchChallenges = async (token: string, skip: number, limit: number, status: string) => {
        try {
            const availableChallengesResponse = await fetch(GamificationService.API_URL+'/challenges?skip='+skip+'&limit='+limit+'&status='+status, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
            const availableChallengesData = await availableChallengesResponse.json();
            return availableChallengesData;
                
        } catch (error) {
            console.error(`Error fetching available challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };


    static fetchMyChallenges = async (token: String) => {
        try {
            const availableChallengesResponse = await fetch(GamificationService.API_URL+'/my-challenges', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
            const availableChallengesData = await availableChallengesResponse.json();
            return availableChallengesData;
                
        } catch (error) {
            console.error(`Error fetching available challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };


    static acceptChallenge = async (token: string, challengeId: string) => {
        try {
            const response = await fetch(`${GamificationService.API_URL}/challenges/${challengeId}/participations`, {
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
            if (!response.ok) {
                throw new Error(`Error accepting challenge: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error accepting challenge: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        };
    }
        
    
}