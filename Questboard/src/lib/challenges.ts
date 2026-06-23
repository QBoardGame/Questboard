import { apiClient } from "../lib/apiClient";

export type ChallengeDefinitionDto = {
  id: string;
  gameId: number;
  title: string;
  description: string;
  challengeType: string;
  eventType: string;
  targetValue: number;
  conditions?: string | null;
  rewardType?: string | null;
  rewardValue?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  visibility?: string | null;
  status?: string | null;
  rarityWeight?: number | null;
  featured?: boolean | null;
};

export type UserChallengeProgressDto = {
  id: string;
  userId: string;
  challengeId: string;

  challengeType: "DAILY" | "WEEKLY" | string;

  title: string;
  description: string;

  progress: number;
  targetValue: number;

  completed: boolean;
  claimed: boolean;

  completedAt?: string | null;
  updatedAt?: string | null;

  endsAt?: string | null;

  eventType: string;
  rewardType?: string | null;
  rewardValue?: string | null;
};

export type ChallengeWithProgressDto = {
  // challenge: ChallengeDefinitionDto;
  progress: UserChallengeProgressDto;
};

export async function getGameChallenges(gameId: number, type?: string) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return apiClient.get<UserChallengeProgressDto[]>(`/challenges/games/${gameId}${query}`);
}

export async function getStreamerChallenges() {
  return apiClient.get<ChallengeWithProgressDto[]>(`/challenges/games/streamer`);
}

export async function claimChallengeReward(challengeId: string) {
  return apiClient.post<void>(`/challenges/${challengeId}/claim`);
}
