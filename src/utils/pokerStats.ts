import { PLAYERS } from "../config/poker";
import type { CsvRow, PlayerId, PlayerStats } from "../types/poker";
import { parseMoney, parsePosition } from "../lib/csv";

export function computeAllStats(rows: CsvRow[]): PlayerStats[] {
  const statsMap = PLAYERS.reduce<Record<PlayerId, PlayerStats>>((acc, player) => {
    acc[player.id] = {
      playerId: player.id,
      playerLabel: player.label,
      totalProfit: 0,
      totalRebuy: 0,
      firstPlaces: 0,
      jornadasPlayed: 0,
      averageProfit: 0,
    };
    return acc;
  }, {});

  for (const row of rows) {
    for (const player of PLAYERS) {
      const profitCol = player.csvName;
      const posCol = `Posiciones ${player.csvName}`;
      const rebuyCol = `Reenganche ${player.csvName}`;

      const profit = parseMoney(row[profitCol]);
      const rebuy = parseMoney(row[rebuyCol]);
      const pos = parsePosition(row[posCol]);

      if (profit !== null) {
        statsMap[player.id].totalProfit += profit;
        statsMap[player.id].jornadasPlayed += 1;
      }

      if (rebuy !== null) {
        statsMap[player.id].totalRebuy += rebuy;
      }

      if (pos === 1) {
        statsMap[player.id].firstPlaces += 1;
      }
    }
  }

  return Object.values(statsMap)
    .map((playerStats) => ({
      ...playerStats,
      averageProfit:
        playerStats.jornadasPlayed > 0
          ? playerStats.totalProfit / playerStats.jornadasPlayed
          : 0,
    }))
    .sort((a, b) => b.totalProfit - a.totalProfit);
}

export function getRank(statsSorted: PlayerStats[], playerId: PlayerId): number {
  const idx = statsSorted.findIndex((s) => s.playerId === playerId);
  return idx === -1 ? statsSorted.length : idx + 1;
}