import { PLAYER_BY_ID } from "../config/poker";
import { buildPlayerHistory, type PlayerHistoryRow } from "./playerHistory";
import type { PlayerId, SeasonId, SeasonRows, PlayerStats } from "../types/poker";

export type CompareSharedRow = {
  jornada: number;
  playerAProfit: number | null;
  playerBProfit: number | null;
  playerARank: number | null;
  playerBRank: number | null;
  winnerId: PlayerId | null;
};

export type CompareSummary = {
  sharedMatchdays: number;
  playerAAheadCount: number;
  playerBAheadCount: number;
  tiesCount: number;
  playerABestProfit: number | null;
  playerBBestProfit: number | null;
  playerAWorstProfit: number | null;
  playerBWorstProfit: number | null;
  biggestProfitGap: number | null;
  biggestProfitGapWinnerId: PlayerId | null;
};

export type CompareChartPoint = {
  jornada: number;
  playerAProfit: number | null;
  playerBProfit: number | null;
  playerACumulative: number;
  playerBCumulative: number;
};

function byJornada(history: PlayerHistoryRow[]) {
  return new Map(history.map((row) => [row.jornada, row]));
}

export function buildCompareChartData(
  rowsBySeason: SeasonRows,
  seasonId: SeasonId,
  playerAId: PlayerId,
  playerBId: PlayerId
): CompareChartPoint[] {
  const historyA = buildPlayerHistory(rowsBySeason[seasonId] ?? [], playerAId);
  const historyB = buildPlayerHistory(rowsBySeason[seasonId] ?? [], playerBId);

  const mapA = byJornada(historyA);
  const mapB = byJornada(historyB);

  const jornadas = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => a - b);

  return jornadas.map((jornada) => {
    const rowA = mapA.get(jornada) ?? null;
    const rowB = mapB.get(jornada) ?? null;

    return {
      jornada,
      playerAProfit: rowA?.profit ?? null,
      playerBProfit: rowB?.profit ?? null,
      playerACumulative: rowA?.cumulativeProfit ?? 0,
      playerBCumulative: rowB?.cumulativeProfit ?? 0,
    };
  });
}

export function buildCompareSharedRows(
  rowsBySeason: SeasonRows,
  seasonId: SeasonId,
  playerAId: PlayerId,
  playerBId: PlayerId
): CompareSharedRow[] {
  const historyA = buildPlayerHistory(rowsBySeason[seasonId] ?? [], playerAId);
  const historyB = buildPlayerHistory(rowsBySeason[seasonId] ?? [], playerBId);

  const mapA = byJornada(historyA);
  const mapB = byJornada(historyB);

  const jornadas = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => a - b);

  return jornadas.map((jornada) => {
    const rowA = mapA.get(jornada) ?? null;
    const rowB = mapB.get(jornada) ?? null;

    let winnerId: PlayerId | null = null;

    if (rowA?.rankPosition != null && rowB?.rankPosition != null) {
      if (rowA.rankPosition < rowB.rankPosition) winnerId = playerAId;
      else if (rowB.rankPosition < rowA.rankPosition) winnerId = playerBId;
    }

    return {
      jornada,
      playerAProfit: rowA?.profit ?? null,
      playerBProfit: rowB?.profit ?? null,
      playerARank: rowA?.rankPosition ?? null,
      playerBRank: rowB?.rankPosition ?? null,
      winnerId,
    };
  });
}

export function buildCompareSummary(
  sharedRows: CompareSharedRow[],
  playerAId: PlayerId,
  playerBId: PlayerId
): CompareSummary {
  let playerAAheadCount = 0;
  let playerBAheadCount = 0;
  let tiesCount = 0;
  let biggestProfitGap: number | null = null;
  let biggestProfitGapWinnerId: PlayerId | null = null;

  const profitAValues: number[] = [];
  const profitBValues: number[] = [];

  for (const row of sharedRows) {
    if (row.playerAProfit != null) profitAValues.push(row.playerAProfit);
    if (row.playerBProfit != null) profitBValues.push(row.playerBProfit);

    if (row.playerARank != null && row.playerBRank != null) {
      if (row.playerARank < row.playerBRank) playerAAheadCount += 1;
      else if (row.playerBRank < row.playerARank) playerBAheadCount += 1;
      else tiesCount += 1;
    }

    if (row.playerAProfit != null && row.playerBProfit != null) {
      const diff = Math.abs(row.playerAProfit - row.playerBProfit);
      if (biggestProfitGap == null || diff > biggestProfitGap) {
        biggestProfitGap = diff;

        if (row.playerAProfit > row.playerBProfit) biggestProfitGapWinnerId = playerAId;
        else if (row.playerBProfit > row.playerAProfit) biggestProfitGapWinnerId = playerBId;
        else biggestProfitGapWinnerId = null;
      }
    }
  }

  return {
    sharedMatchdays: sharedRows.length,
    playerAAheadCount,
    playerBAheadCount,
    tiesCount,
    playerABestProfit: profitAValues.length ? Math.max(...profitAValues) : null,
    playerBBestProfit: profitBValues.length ? Math.max(...profitBValues) : null,
    playerAWorstProfit: profitAValues.length ? Math.min(...profitAValues) : null,
    playerBWorstProfit: profitBValues.length ? Math.min(...profitBValues) : null,
    biggestProfitGap,
    biggestProfitGapWinnerId,
  };
}

export function findPlayerStats(stats: PlayerStats[], playerId: PlayerId): PlayerStats | null {
  return stats.find((item) => item.playerId === playerId) ?? null;
}

export function buildDuelHeadline(
  summary: CompareSummary,
  playerAId: PlayerId,
  playerBId: PlayerId
) {
  const playerALabel = PLAYER_BY_ID[playerAId]?.label ?? playerAId;
  const playerBLabel = PLAYER_BY_ID[playerBId]?.label ?? playerBId;

  if (summary.playerAAheadCount > summary.playerBAheadCount) {
    return `${playerALabel} domina el cara a cara por ${summary.playerAAheadCount}-${summary.playerBAheadCount}.`;
  }

  if (summary.playerBAheadCount > summary.playerAAheadCount) {
    return `${playerBLabel} domina el cara a cara por ${summary.playerBAheadCount}-${summary.playerAAheadCount}.`;
  }

  return `El cara a cara está igualado entre ${playerALabel} y ${playerBLabel}.`;
}