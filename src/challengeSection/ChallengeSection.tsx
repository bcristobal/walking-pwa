import ChallengeCard from "../components/challengeCard/ChallengeCard";



interface ChallengeSectionProps {
    challenges: Array<{
        id: string;
        name: string;
        type: string;
        description: string;
        start_date: string;
        finish_date: string;
        points: number;
    }>;
}

export default async function ChallengeSection() {

    const apiUrl = "http://127.0.0.1:8000";
    let challenges = [];

try {
  const response = await fetch(`${apiUrl}/games/walking-pwa/challenges?skip=1&limit=4&status=all`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  
  if (response.ok) {
    challenges = await response.json();
    console.log(challenges);
  } else {
    console.error('Error en la respuesta:', response.status);
  }
} catch (error) {
  console.error('Error:', error);
}

    console.log(challenges);
    return (
        <section className="challenge_section">
            <h1>Desafíos</h1>
            <div className="challenge_list">
                {challenges.map((challenge: { id: string; name: string; type: string; description: string; start_date: string; finish_date: string; points: number; }) => (
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