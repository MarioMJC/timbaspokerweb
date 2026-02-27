export type PlayerId = string;
export type SeasonId = string;

export type CsvRow = Record<string, string>;

export type SummaryStats = {
  buyIn: number | null;
  pot: number | null;
};

export type SeasonRows = Record<SeasonId, CsvRow[]>;

export type PlayerConfig = {
  id: PlayerId;
  label: string;
  csvName: string;
  img: string;
  color: string;
};

export type SeasonStatus = "active" | "finished" | "upcoming";

export type SeasonConfig = {
  id: SeasonId;
  label: string;
  dataPath: string;
  status: SeasonStatus;
  dateRangeLabel: string;
};

export type SocialLinkConfig = {
  key: string;
  label: string;
  href: string;
  logo: string;
  variant: string;
};

export type PlayerStats = {
  playerId: PlayerId;
  playerLabel: string;
  totalProfit: number;
  totalRebuy: number;
  firstPlaces: number;
  jornadasPlayed: number;
  averageProfit: number;
};

export type TimelinePoint = {
  jornada: number;
} & Record<string, number | null>;