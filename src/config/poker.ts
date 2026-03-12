import type {
  PlayerConfig,
  SeasonConfig,
  SocialLinkConfig,
} from "../types/poker";

import joseluImg from "../assets/players/joselu.png";
import alvaroImg from "../assets/players/alvaro.png";
import marioImg from "../assets/players/mario.png";
import gonzaloImg from "../assets/players/gonzalo.png";

import instagramLogo from "../assets/social/instagram.png";
import kickLogo from "../assets/social/kick.png";
import tiktokLogo from "../assets/social/tik-tok.png";
import youtubeLogo from "../assets/social/youtube.png";

export const PLAYERS: PlayerConfig[] = [
  {
    id: "mario",
    label: "Mario",
    csvName: "Mario",
    img: marioImg,
    color: "#ff1a1a",
  },
  {
    id: "alvaro",
    label: "Álvaro",
    csvName: "Álvaro",
    img: alvaroImg,
    color: "#3b82f6",
  },
  {
    id: "joselu",
    label: "Joselu",
    csvName: "Joselu",
    img: joseluImg,
    color: "#22c55e",
  },
  {
    id: "gonzalo",
    label: "Gonzalo",
    csvName: "Gonzalo",
    img: gonzaloImg,
    color: "#facc15",
  },
];

export const PLAYER_IDS = PLAYERS.map((player) => player.id);

export const PLAYER_BY_ID = Object.fromEntries(
  PLAYERS.map((player) => [player.id, player])
) as Record<string, PlayerConfig>;

export const SEASONS: SeasonConfig[] = [
  {
    id: "anual",
    label: "ANUAL",
    dataPath: "/data/anual.csv",
    status: "active",
    dateRangeLabel: "27 agosto (2025) - actualidad",
  },
  {
    id: "winter",
    label: "WINTER SEASON",
    dataPath: "/data/winter.csv",
    status: "finished",
    dateRangeLabel: "27 agosto (2025) - 21 diciembre (2025)",
  },
  {
    id: "spring",
    label: "SPRING SEASON",
    dataPath: "/data/spring.csv",
    status: "active",
    dateRangeLabel: "8 enero (2026) - actualidad",
  },
];

export const SEASON_BY_ID = Object.fromEntries(
  SEASONS.map((season) => [season.id, season])
) as Record<string, SeasonConfig>;

export const DEFAULT_SEASON_ID = SEASONS[0].id;

export const SUMMARY_CSV_PATH = "/data/dinero.csv";

export const SOCIAL_LINKS: SocialLinkConfig[] = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/timbaspoker",
    logo: instagramLogo,
    variant: "instagram",
  },
  {
    key: "kick",
    label: "Kick",
    href: "https://kick.com/timbaspoker",
    logo: kickLogo,
    variant: "kick",
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@spanishpoker77",
    logo: tiktokLogo,
    variant: "tiktok",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@timbaspoker",
    logo: youtubeLogo,
    variant: "youtube",
  },

];


export const MATCHDAY_MEDIA: Record<number, {
  winnerImage: string;
  finalHandImage: string;
}> = {

  9: {
    winnerImage: "/matchdays/annual/jornada-9/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-9/final-hand.jpg",
  },

  10: {
    winnerImage: "/matchdays/annual/jornada-10/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-10/final-hand.jpg",
  },

  11: {
    winnerImage: "/matchdays/annual/jornada-11/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-11/final-hand.jpg",
  },

  12: {
    winnerImage: "/matchdays/annual/jornada-12/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-12/final-hand.jpg",
  },

  13: {
    winnerImage: "/matchdays/annual/jornada-13/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-13/final-hand.jpg",
  },

  14: {
    winnerImage: "/matchdays/annual/jornada-14/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-14/final-hand.jpg",
  },

  15: {
    winnerImage: "/matchdays/annual/jornada-15/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-15/final-hand.jpg",
  },

  16: {
    winnerImage: "/matchdays/annual/jornada-16/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-16/final-hand.jpg",
  },

  17: {
    winnerImage: "/matchdays/annual/jornada-17/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-17/final-hand.jpg",
  },

  18: {
    winnerImage: "/matchdays/annual/jornada-18/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-18/final-hand.jpg",
  },

  19: {
    winnerImage: "/matchdays/annual/jornada-19/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-19/final-hand.jpg",
  },

  20: {
    winnerImage: "/matchdays/annual/jornada-20/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-20/final-hand.jpg",
  },

  21: {
    winnerImage: "/matchdays/annual/jornada-21/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-21/final-hand.jpg",
  },

  22: {
    winnerImage: "/matchdays/annual/jornada-22/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-22/final-hand.jpg",
  },

  23: {
    winnerImage: "/matchdays/annual/jornada-23/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-23/final-hand.jpg",
  },

  24: {
    winnerImage: "/matchdays/annual/jornada-24/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-24/final-hand.jpg",
  },

  25: {
    winnerImage: "/matchdays/annual/jornada-25/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-25/final-hand.jpg",
  },

  26: {
    winnerImage: "/matchdays/annual/jornada-26/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-26/final-hand.jpg",
  },

  27: {
    winnerImage: "/matchdays/annual/jornada-27/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-27/final-hand.jpg",
  },

  28: {
    winnerImage: "/matchdays/annual/jornada-28/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-28/final-hand.jpg",
  },

  29: {
    winnerImage: "/matchdays/annual/jornada-29/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-29/final-hand.jpg",
  },

  30: {
    winnerImage: "/matchdays/annual/jornada-30/winner.jpg",
    finalHandImage: "/matchdays/annual/jornada-30/final-hand.jpg",
  },
};

export function getAnnualMatchdayFromSeason(
  seasonId: string,
  jornada: number
): number | null {
  if (!Number.isFinite(jornada) || jornada < 1) {
    return null;
  }

  if (seasonId === "anual") {
    return jornada;
  }

  if (seasonId === "winter") {
    return jornada >= 1 && jornada <= 21 ? jornada : null;
  }

  if (seasonId === "spring") {
    return 21 + jornada;
  }

  return null;
}
