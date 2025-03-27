export interface Challenge {
    id: string;
    name: string;
    type: string;
    description: string;
    start_date: string;
    finish_date: string;
    points: number;
}

export interface ChallengeParticipation {
    id: string;
    challenge_id: string;
    user_id: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    joined_at: string;
    points_earned?: number;
}