export type PlayerKey = "Mario" | "Álvaro" | "Joselu" | "Gonzalo";

export type SeasonKey = "ANUAL" | "WINTER" | "SPRING";

export type CsvRow = Record<string, string>;

export type SummaryStats = {
  buyIn: number | null;
  pot: number | null;
};

export type SeasonRows = Record<SeasonKey, CsvRow[]>;

export type PlayerStats = {
  player: PlayerKey;
  totalProfit: number;
  totalRebuy: number;
  firstPlaces: number;
  jornadasPlayed: number;
  averageProfit: number;
};

export type TimelinePoint = {
  jornada: number;
} & Record<string, number | null>;