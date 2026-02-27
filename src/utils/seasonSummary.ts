import { PLAYER_BY_ID } from "../config/poker";
import type { PlayerStats } from "../types/poker";

export type SeasonSummary = {
  leaderLabel: string;
  leaderProfit: number;
  totalPlayers: number;
  jornadasPlayed: number;
};

export function buildSeasonSummary(stats: PlayerStats[]): SeasonSummary {
  const leader = stats[0];

  return {
    leaderLabel: leader ? (PLAYER_BY_ID[leader.playerId]?.label ?? leader.playerLabel) : "—",
    leaderProfit: leader?.totalProfit ?? 0,
    totalPlayers: stats.length,
    jornadasPlayed: leader?.jornadasPlayed ?? 0,
  };
}