import { PLAYERS, PLAYER_BY_ID, SEASON_BY_ID, SEASONS } from "../config/poker";
import type { CsvRow, PlayerId, SeasonId } from "../types/poker";
import { parseJornada, parseMoney, parsePosition } from "../lib/csv";

export type MatchdayPlayerResult = {
  playerId: PlayerId;
  playerLabel: string;
  profit: number | null;
  position: number | null;
  rebuy: number | null;
  cumulativeProfit: number;
};

export type MatchdaySummary = {
  seasonId: SeasonId;
  seasonLabel: string;
  jornada: number;
  winnerId: PlayerId | null;
  winnerLabel: string;
  winnerProfit: number | null;
  totalPotChange: number;
  rebuyCount: number;
  leaderAfterMatchId: PlayerId | null;
  leaderAfterMatchLabel: string;
};

export type MatchdayDetail = {
  seasonId: SeasonId;
  seasonLabel: string;
  jornada: number;
  winnerId: PlayerId | null;
  winnerLabel: string;
  winnerProfit: number | null;
  rebuyCount: number;
  totalPotChange: number;
  leaderAfterMatchId: PlayerId | null;
  leaderAfterMatchLabel: string;
  results: MatchdayPlayerResult[];
};

function resolveWinner(results: MatchdayPlayerResult[]): MatchdayPlayerResult | null {
  const withPosition = results.filter((r) => r.position !== null);
  if (withPosition.length) {
    const sorted = [...withPosition].sort((a, b) => {
      const posDiff = (a.position ?? 999) - (b.position ?? 999);
      if (posDiff !== 0) return posDiff;
      return (b.profit ?? -999999) - (a.profit ?? -999999);
    });
    return sorted[0] ?? null;
  }

  const withProfit = results.filter((r) => r.profit !== null);
  if (!withProfit.length) return null;

  return [...withProfit].sort((a, b) => (b.profit ?? -999999) - (a.profit ?? -999999))[0] ?? null;
}

function resolveLeader(cumulativeProfits: Record<PlayerId, number>): PlayerId | null {
  const sorted = [...PLAYERS].sort((a, b) => {
    const diff = cumulativeProfits[b.id] - cumulativeProfits[a.id];
    if (diff !== 0) return diff;
    return PLAYERS.findIndex((p) => p.id === a.id) - PLAYERS.findIndex((p) => p.id === b.id);
  });

  return sorted[0]?.id ?? null;
}

export function buildMatchdaysForSeason(rows: CsvRow[], seasonId: SeasonId): MatchdaySummary[] {
  const seasonLabel = SEASON_BY_ID[seasonId]?.label ?? seasonId;

  const cumulativeProfits = PLAYERS.reduce<Record<PlayerId, number>>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {});

  const summaries: MatchdaySummary[] = [];

  for (const row of rows) {
    const jornada = parseJornada(row["Partidas"]);
    if (!jornada) continue;

    const results: MatchdayPlayerResult[] = PLAYERS.map((player) => {
      const profit = parseMoney(row[player.csvName]);
      const rebuy = parseMoney(row[`Reenganche ${player.csvName}`]);
      const position = parsePosition(row[`Posiciones ${player.csvName}`]);

      if (profit !== null) {
        cumulativeProfits[player.id] += profit;
      }

      return {
        playerId: player.id,
        playerLabel: player.label,
        profit,
        position,
        rebuy,
        cumulativeProfit: cumulativeProfits[player.id],
      };
    });

    const winner = resolveWinner(results);
    const leaderAfterMatchId = resolveLeader(cumulativeProfits);

    summaries.push({
      seasonId,
      seasonLabel,
      jornada,
      winnerId: winner?.playerId ?? null,
      winnerLabel: winner?.playerLabel ?? "—",
      winnerProfit: winner?.profit ?? null,
      totalPotChange: results.reduce((acc, r) => acc + (r.profit ?? 0), 0),
      rebuyCount: results.reduce((acc, r) => acc + ((r.rebuy ?? 0) > 0 ? 1 : 0), 0),
      leaderAfterMatchId,
      leaderAfterMatchLabel: leaderAfterMatchId
        ? PLAYER_BY_ID[leaderAfterMatchId]?.label ?? leaderAfterMatchId
        : "—",
    });
  }

  return summaries.sort((a, b) => b.jornada - a.jornada);
}

export function buildAllMatchdays(
  rowsBySeason: Record<string, CsvRow[]>
): MatchdaySummary[] {
  return SEASONS.flatMap((season) =>
    buildMatchdaysForSeason(rowsBySeason[season.id] ?? [], season.id)
  ).sort((a, b) => {
    const seasonOrder =
      SEASONS.findIndex((s) => s.id === a.seasonId) -
      SEASONS.findIndex((s) => s.id === b.seasonId);

    if (seasonOrder !== 0) return seasonOrder;
    return b.jornada - a.jornada;
  });
}

export function buildMatchdayDetail(
  rows: CsvRow[],
  seasonId: SeasonId,
  jornadaTarget: number
): MatchdayDetail | null {
  const seasonLabel = SEASON_BY_ID[seasonId]?.label ?? seasonId;

  const cumulativeProfits = PLAYERS.reduce<Record<PlayerId, number>>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {});

  for (const row of rows) {
    const jornada = parseJornada(row["Partidas"]);
    if (!jornada) continue;

    const results: MatchdayPlayerResult[] = PLAYERS.map((player) => {
      const profit = parseMoney(row[player.csvName]);
      const rebuy = parseMoney(row[`Reenganche ${player.csvName}`]);
      const position = parsePosition(row[`Posiciones ${player.csvName}`]);

      if (profit !== null) {
        cumulativeProfits[player.id] += profit;
      }

      return {
        playerId: player.id,
        playerLabel: player.label,
        profit,
        position,
        rebuy,
        cumulativeProfit: cumulativeProfits[player.id],
      };
    });

    if (jornada !== jornadaTarget) continue;

    const sortedResults = [...results].sort((a, b) => {
      const posA = a.position ?? 999;
      const posB = b.position ?? 999;
      if (posA !== posB) return posA - posB;
      return (b.profit ?? -999999) - (a.profit ?? -999999);
    });

    const winner = resolveWinner(sortedResults);
    const leaderAfterMatchId = resolveLeader(cumulativeProfits);

    return {
      seasonId,
      seasonLabel,
      jornada,
      winnerId: winner?.playerId ?? null,
      winnerLabel: winner?.playerLabel ?? "—",
      winnerProfit: winner?.profit ?? null,
      rebuyCount: sortedResults.reduce((acc, r) => acc + ((r.rebuy ?? 0) > 0 ? 1 : 0), 0),
      totalPotChange: sortedResults.reduce((acc, r) => acc + (r.profit ?? 0), 0),
      leaderAfterMatchId,
      leaderAfterMatchLabel: leaderAfterMatchId
        ? PLAYER_BY_ID[leaderAfterMatchId]?.label ?? leaderAfterMatchId
        : "—",
      results: sortedResults,
    };
  }

  return null;
}

export function buildMatchdayNarrative(detail: MatchdayDetail): string[] {
  const lines: string[] = [];

  if (detail.winnerId) {
    lines.push(
      `${detail.winnerLabel} cerró la jornada ${detail.jornada} como ganador del día${
        detail.winnerProfit != null ? ` con ${detail.winnerProfit.toFixed(2)} €` : ""
      }.`
    );
  }

  if (detail.leaderAfterMatchId) {
    lines.push(
      `Tras esta jornada, el líder global de la ${detail.seasonLabel.toLowerCase()} es ${detail.leaderAfterMatchLabel}.`
    );
  }

  const positive = detail.results.filter((r) => (r.profit ?? 0) > 0);
  const negative = detail.results.filter((r) => (r.profit ?? 0) < 0);

  if (positive.length) {
    const best = [...positive].sort((a, b) => (b.profit ?? 0) - (a.profit ?? 0))[0];
    lines.push(
      `La mejor subida del día fue para ${best.playerLabel}${
        best.profit != null ? ` con ${best.profit.toFixed(2)} €` : ""
      }.`
    );
  }

  if (negative.length) {
    const worst = [...negative].sort((a, b) => (a.profit ?? 0) - (b.profit ?? 0))[0];
    lines.push(
      `La mayor caída fue la de ${worst.playerLabel}${
        worst.profit != null ? ` con ${worst.profit.toFixed(2)} €` : ""
      }.`
    );
  }

  if (detail.rebuyCount > 0) {
    lines.push(`Hubo ${detail.rebuyCount} reenganche(s) durante la jornada.`);
  }

  return lines;
}