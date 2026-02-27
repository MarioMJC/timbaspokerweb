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
  }
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
  },
  {
    id: "winter",
    label: "WINTER SEASON",
    dataPath: "/data/winter.csv",
  },
  {
    id: "spring",
    label: "SPRING SEASON",
    dataPath: "/data/spring.csv",
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
    href: "https://www.tiktok.com/@timbaspoker",
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