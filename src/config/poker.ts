import type { PlayerKey, SeasonKey } from "../types/poker";

import joseluImg from "../assets/players/joselu.png";
import alvaroImg from "../assets/players/alvaro.png";
import marioImg from "../assets/players/mario.png";
import gonzaloImg from "../assets/players/gonzalo.png";

import instagramLogo from "../assets/social/instagram.png";
import kickLogo from "../assets/social/kick.png";
import tiktokLogo from "../assets/social/tik-tok.png";
import youtubeLogo from "../assets/social/youtube.png";

export const PLAYER_KEYS: PlayerKey[] = ["Mario", "Álvaro", "Joselu", "Gonzalo"];

export const PLAYER_META: Record<
  PlayerKey,
  { key: PlayerKey; label: string; img: string; color: string }
> = {
  Mario: {
    key: "Mario",
    label: "Mario",
    img: marioImg,
    color: "#ff1a1a",
  },
  Álvaro: {
    key: "Álvaro",
    label: "Álvaro",
    img: alvaroImg,
    color: "#3b82f6",
  },
  Joselu: {
    key: "Joselu",
    label: "Joselu",
    img: joseluImg,
    color: "#22c55e",
  },
  Gonzalo: {
    key: "Gonzalo",
    label: "Gonzalo",
    img: gonzaloImg,
    color: "#facc15",
  },
};

export const SEASON_CONFIG: Record<
  SeasonKey,
  { key: SeasonKey; label: string; dataPath: string }
> = {
  ANUAL: {
    key: "ANUAL",
    label: "ANUAL",
    dataPath: "/data/anual.csv",
  },
  WINTER: {
    key: "WINTER",
    label: "WINTER SEASON",
    dataPath: "/data/winter.csv",
  },
  SPRING: {
    key: "SPRING",
    label: "SPRING SEASON",
    dataPath: "/data/spring.csv",
  },
};

export const SUMMARY_CSV_PATH = "/data/dinero.csv";

export const SOCIAL_LINKS = [
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
] as const;