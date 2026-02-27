import { PLAYER_KEYS } from "../config/poker";
import type { CsvRow, PlayerKey, PlayerStats } from "../types/poker";
import { parseMoney, parsePosition } from "../lib/csv";

export function computeAllStats(rows: CsvRow[]): PlayerStats[] {
  const stats: Record<PlayerKey, PlayerStats> = {
    Mario: {
      player: "Mario",
      totalProfit: 0,
      totalRebuy: 0,
      firstPlaces: 0,
      jornadasPlayed: 0,
      averageProfit: 0,
    },
    Álvaro: {
      player: "Álvaro",
      totalProfit: 0,
      totalRebuy: 0,
      firstPlaces: 0,
      jornadasPlayed: 0,
      averageProfit: 0,
    },
    Joselu: {
      player: "Joselu",
      totalProfit: 0,
      totalRebuy: 0,
      firstPlaces: 0,
      jornadasPlayed: 0,
      averageProfit: 0,
    },
    Gonzalo: {
      player: "Gonzalo",
      totalProfit: 0,
      totalRebuy: 0,
      firstPlaces: 0,
      jornadasPlayed: 0,
      averageProfit: 0,
    },
  };

  for (const row of rows) {
    for (const player of PLAYER_KEYS) {
      const profitCol = player;
      const posCol = `Posiciones ${player}`;
      const rebuyCol = `Reenganche ${player}`;

      const profit = parseMoney(row[profitCol]);
      const rebuy = parseMoney(row[rebuyCol]);
      const pos = parsePosition(row[posCol]);

      if (profit !== null) {
        stats[player].totalProfit += profit;
        stats[player].jornadasPlayed += 1;
      }

      if (rebuy !== null) {
        stats[player].totalRebuy += rebuy;
      }

      if (pos === 1) {
        stats[player].firstPlaces += 1;
      }
    }
  }

  const result = Object.values(stats).map((playerStats) => ({
    ...playerStats,
    averageProfit:
      playerStats.jornadasPlayed > 0
        ? playerStats.totalProfit / playerStats.jornadasPlayed
        : 0,
  }));

  return result.sort((a, b) => b.totalProfit - a.totalProfit);
}

export function getRank(statsSorted: PlayerStats[], player: PlayerKey): number {
  const idx = statsSorted.findIndex((s) => s.player === player);
  return idx === -1 ? statsSorted.length : idx + 1;
}