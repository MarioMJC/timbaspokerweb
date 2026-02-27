import { PLAYERS } from "../config/poker";
import type { CsvRow, PlayerId } from "../types/poker";
import { parseJornada, parseMoney, parsePosition } from "../lib/csv";

export type PlayerHistoryRow = {
  jornada: number;
  profit: number | null;
  rankPosition: number | null;
  rebuy: number | null;
  cumulativeProfit: number;
};

export function buildPlayerHistory(rows: CsvRow[], playerId: PlayerId): PlayerHistoryRow[] {
  const player = PLAYERS.find((p) => p.id === playerId);
  if (!player) return [];

  let cumulativeProfit = 0;

  const history: PlayerHistoryRow[] = [];

  for (const row of rows) {
    const jornada = parseJornada(row["Partidas"]);
    if (!jornada) continue;

    const profit = parseMoney(row[player.csvName]);
    const rebuy = parseMoney(row[`Reenganche ${player.csvName}`]);
    const rankPosition = parsePosition(row[`Posiciones ${player.csvName}`]);

    if (profit !== null) {
      cumulativeProfit += profit;
    }

    history.push({
      jornada,
      profit,
      rankPosition,
      rebuy,
      cumulativeProfit,
    });
  }

  return history.sort((a, b) => a.jornada - b.jornada);
}

export function getBestProfit(history: PlayerHistoryRow[]): number | null {
  const values = history
    .map((h) => h.profit)
    .filter((v): v is number => v !== null);

  if (!values.length) return null;
  return Math.max(...values);
}

export function getWorstProfit(history: PlayerHistoryRow[]): number | null {
  const values = history
    .map((h) => h.profit)
    .filter((v): v is number => v !== null);

  if (!values.length) return null;
  return Math.min(...values);
}

export function getBestRank(history: PlayerHistoryRow[]): number | null {
  const values = history
    .map((h) => h.rankPosition)
    .filter((v): v is number => v !== null);

  if (!values.length) return null;
  return Math.min(...values);
}

export function getTotalRebuy(history: PlayerHistoryRow[]): number {
  return history.reduce((acc, row) => acc + (row.rebuy ?? 0), 0);
}