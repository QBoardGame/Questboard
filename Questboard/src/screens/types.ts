export type ChallengeWebSocketEvent =
  | ChallengeJoinedEvent
  | ChallengeLeftEvent
  | ChallengeProgressEvent
  | ChallengeCompletedEvent
  | ChallengeRewardClaimedEvent
  | ChallengeFullEvent
  | ChallengeCreatedEvent
  | ChallengeUpdatedEvent
  | ChallengeDeletedEvent;

export interface BaseChallengeEvent {
  type: string;
  challengeId: string;
  timestamp: string;
}

export interface ChallengeJoinedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_JOINED";

  currentParticipants: number;
  maxParticipants: number;

  challenge: {
    title: string;
    gameId: number;
  };
}

export interface ChallengeLeftEvent extends BaseChallengeEvent {
  type: "CHALLENGE_LEFT";

  userId: string;

  currentParticipants: number;
  maxParticipants: number;
}

export interface ChallengeProgressEvent extends BaseChallengeEvent {
  type: "CHALLENGE_PROGRESS";

  userId: string;

  progress: number;
  target: number;

  percentage: number;

  eventType: string;

  metadata?: Record<string, any>;
}

export interface ChallengeCompletedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_COMPLETED";

  userId: string;

  completedAt: string;

  reward: {
    type: string;
    value: string;
  };
}

export interface ChallengeRewardClaimedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_REWARD_CLAIMED";

  userId: string;

  claimedAt: string;

  reward: {
    type: string;
    value: string;
  };
}

export interface ChallengeFullEvent extends BaseChallengeEvent {
  type: "CHALLENGE_FULL";

  currentParticipants: number;
  maxParticipants: number;
}

export interface ChallengeCreatedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_CREATED";

  challenge: {
    title: string;
    description: string;

    gameId: number;

    eventType: string;

    targetValue: number;

    rewardType: string;
    rewardValue: string;

    startsAt: string;
    endsAt: string;

    featured: boolean;
  };
}

export interface ChallengeUpdatedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_UPDATED";

  updates: Record<string, any>;
}

export interface ChallengeDeletedEvent extends BaseChallengeEvent {
  type: "CHALLENGE_DELETED";
}