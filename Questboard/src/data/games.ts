export type GameInfo = {
  id: number;
  slug: string;
  title: string;
  platform?: string;
  image?: string;
  logo?: string;
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
    image: "/images/games/valorant.jpg",
    logo: "/images/games/logo/valorant logo.jpg",
    tasks: {
      daily: ["Get 5 kills", "Play one ranked match"],
      weekly: ["Complete 10 matches", "Win 3 ranked matches"],
    },
  },
  {
    id: 9898,
    slug: "warzone",
    title: "Warzone",
    platform: "Overwolf",
    image: "/images/games/warzone.jpg",
    logo: "/images/games/logo/valorant logo.jpg",
    tasks: {
      daily: ["Finish 1 match", "Get 10 kills"],
      weekly: ["Finish 15 encounters", "Reach top 100"],
    },
  },
  {
    id: 21566,
    slug: "apex",
    title: "Apex Legends",
    platform: "PC",
    image: "/images/games/apexLegends.jpg",
    logo: "/images/games/logo/valorant logo.jpg",
    tasks: {
      daily: ["Get 3 assists", "Survive 5 minutes"],
      weekly: ["Top 5 in 5 matches", "Deal 2000 damage"],
    },
  },
];
