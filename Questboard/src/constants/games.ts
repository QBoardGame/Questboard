export type GameInfo = {
  id: number;
  slug: string;
  title: string;
  platform?: string;
  image?: string;
  logo?: string;
};

export const GAMES: GameInfo[] = [
  {
    id: 21640,
    slug: "valorant",
    title: "Valorant",
    platform: "Overwolf",
    image: "/images/games/valorant.jpg",
    logo: "/images/games/logo/valorant logo.jpg",
  },
  {
    id: 22730,
    slug: "coutnterStrike2",
    title: "Counter Strike 2",
    platform: "PC",
    image: "/images/games/counterstrike2image.jpg",
    logo: "/images/games/logo/counterstrike2logo.jpg",
  },
  {
    id: 10844,
    slug: "overwatch",
    title: "Overwatch 2",
    platform: "PC",
    image: "/images/games/overwatch.jpg",
    logo: "/images/games/logo/overwatch 2 logo.jpg",
  },
];
