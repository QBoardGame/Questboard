export type GameInfo = {
  id: number;
  slug: string;
  title: string;
  platform?: string;
  tasks: {
    daily: string[];
    weekly: string[];
  };
};

export const GAMES: GameInfo[] = [
  {
    id: 21640,
    slug: "valorant",
    title: "Valorant",
    platform: "Overwolf",
    tasks: {
      daily: ["Get 5 kills", "Play one ranked match"],
      weekly: ["Complete 10 matches", "Win 3 ranked matches"],
    },
  },
  {
    id: 21566,
    slug: "hearthstone",
    title: "Hearthstone",
    platform: "Overwolf",
    tasks: {
      daily: ["Complete 3 quests", "Win 1 match"],
      weekly: ["Finish 15 quests", "Reach top 100"],
    },
  },
  {
    id: 99999,
    slug: "apex",
    title: "Apex Legends",
    platform: "PC",
    tasks: {
      daily: ["Get 3 assists", "Survive 5 minutes"],
      weekly: ["Top 5 in 5 matches", "Deal 2000 damage"],
    },
  },
];
