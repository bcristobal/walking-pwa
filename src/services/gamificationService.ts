export class GamificationService {
    private static  API_URL = 'http://127.0.0.1:8000/gamification-api/games/walking-pwa'

    static fetchChallenges = async (token: string, skip: number, limit: number, status: string) => {
        try {
            const availableChallengesResponse = await fetch(GamificationService.API_URL+'/challenges?skip='+skip+'&limit='+limit+'&status='+status, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
            
            if (!availableChallengesResponse.ok) {
                throw new Error(`Error en la respuesta del servidor: ${availableChallengesResponse.status} ${availableChallengesResponse.statusText}`);
            }
            
            const availableChallengesData = await availableChallengesResponse.json();
            return availableChallengesData;
                
        } catch (error) {
            console.error(`Error fetching available challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };


    static fetchMyChallenges = async (token: string) => {
        try {
            console.log('Iniciando fetchMyChallenges...');
            
            const response = await fetch('http://127.0.0.1:8000/gamification-api/games/walking-pwa/my-challenges', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
            
            console.log('Respuesta recibida, estado:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            
            // Clone la respuesta para poder verla y usarla
            const clonedResponse = response.clone();
            
            // Intenta leer el texto original para depuración
            const responseText = await clonedResponse.text();
            console.log('Respuesta texto:', responseText.substring(0, 200) + '...');
            
            let data;
            try {
                // Convertir el texto a JSON
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                throw new Error(`Error al parsear la respuesta JSON: ${jsonError instanceof Error ? jsonError.message : 'Error desconocido'}`);
            }
            
            console.log('Datos parseados correctamente');
            return data;
                
        } catch (error) {
            console.error(`Error fetching my challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
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


    static addPoints = async (token: string, challengeId: string, participation_id: string, points: number) => {
        console.log('Iniciando addPoints...');
        try {
            const response = await fetch(`${GamificationService.API_URL}/challenges/${challengeId}/participations/${participation_id}/points`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "points": points 
                }),
            });
            if (!response.ok) {
                throw new Error(`Error adding points: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error adding points: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        };
    }

}