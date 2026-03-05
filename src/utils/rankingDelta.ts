import { buildMatchdayDetail } from "./matchdays";
import { parseJornada } from "../lib/csv";
import type { SeasonId, SeasonRows } from "../types/poker";

type DeltaInfo = {
  currentPos: number | null;
  previousPos: number | null;
  delta: number; // + = sube, - = baja, 0 = igual
};

type RankingDeltaResult = {
  latestJornada: number | null;
  previousJornada: number | null;
  byPlayerId: Record<string, DeltaInfo>;
};

/**
 * Extrae el "beneficio" de una fila de resultados de jornada.
 * No sé el nombre exacto de tu campo en `detail.results`, así que cubro varios.
 */
function getResultProfit(result: any): number {
  const candidates = [
    result.profit,
    result.netProfit,
    result.totalProfit,
    result.delta,
    result.change,
    result.amount,
  ];

  for (const v of candidates) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }

  return 0;
}

function getAvailableJornadas(seasonRows: any[]): number[] {
  const set = new Set<number>();
  for (const row of seasonRows) {
    const j = parseJornada(row["Partidas"]);
    if (j != null) set.add(j);
  }
  return Array.from(set).sort((a, b) => a - b);
}

function buildTotalsUpToJornada(seasonRows: any[], seasonId: SeasonId, upto: number) {
  const jornadas = getAvailableJornadas(seasonRows).filter((j) => j <= upto);

  const totals = new Map<string, number>();

  for (const j of jornadas) {
    const detail = buildMatchdayDetail(seasonRows, seasonId, j);
    if (!detail) continue;

    for (const r of detail.results as any[]) {
      const playerId = String(r.playerId ?? r.playerLabel ?? r.name ?? "unknown");
      const profit = getResultProfit(r);

      totals.set(playerId, (totals.get(playerId) ?? 0) + profit);
    }
  }

  return totals;
}

function buildPositionsFromTotals(totals: Map<string, number>): Map<string, number> {
  const sorted = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1]); // mayor beneficio primero

  const pos = new Map<string, number>();
  sorted.forEach(([playerId], idx) => pos.set(playerId, idx + 1));
  return pos;
}

/**
 * Ranking delta entre:
 * - última jornada registrada
 * - jornada anterior a la última
 */
export function computeRankingDeltaForSeason(
  rowsBySeason: SeasonRows,
  seasonId: SeasonId
): RankingDeltaResult {
  const seasonRows = rowsBySeason[seasonId] ?? [];
  const jornadas = getAvailableJornadas(seasonRows);

  if (jornadas.length < 2) {
    return {
      latestJornada: jornadas[jornadas.length - 1] ?? null,
      previousJornada: null,
      byPlayerId: {},
    };
  }

  const latestJornada = jornadas[jornadas.length - 1];
  const previousJornada = jornadas[jornadas.length - 2];

  const totalsLatest = buildTotalsUpToJornada(seasonRows, seasonId, latestJornada);
  const totalsPrev = buildTotalsUpToJornada(seasonRows, seasonId, previousJornada);

  const posLatest = buildPositionsFromTotals(totalsLatest);
  const posPrev = buildPositionsFromTotals(totalsPrev);

  const allIds = new Set<string>([
    ...Array.from(posLatest.keys()),
    ...Array.from(posPrev.keys()),
  ]);

  const byPlayerId: Record<string, DeltaInfo> = {};
  for (const id of allIds) {
    const currentPos = posLatest.get(id) ?? null;
    const previousPos = posPrev.get(id) ?? null;

    // delta: positivo = sube (ej: estaba 3 y ahora 1 => +2)
    const delta =
      currentPos != null && previousPos != null ? previousPos - currentPos : 0;

    byPlayerId[id] = { currentPos, previousPos, delta };
  }

  return { latestJornada, previousJornada, byPlayerId };
}