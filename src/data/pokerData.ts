import { SEASON_CONFIG, SUMMARY_CSV_PATH } from "../config/poker";
import type { SeasonRows, SummaryStats } from "../types/poker";
import { fetchCsv, parseMoney, pickHeader } from "../lib/csv";

function createEmptySeasonRows(): SeasonRows {
  return {
    ANUAL: [],
    WINTER: [],
    SPRING: [],
  };
}

function extractSummary(rows: Record<string, string>[]): SummaryStats {
  const row0 = rows[0] ?? {};
  const headers = Object.keys(row0);

  const buyInKey =
    pickHeader(headers, [
      "buyin",
      "buy-in",
      "buy in",
      "entrada",
      "inscripcion",
      "buyintotal",
    ]) ?? null;

  const potKey =
    pickHeader(headers, [
      "bote",
      "pot",
      "pozo",
      "acumulado",
      "boteacumulado",
    ]) ?? null;

  return {
    buyIn: buyInKey ? parseMoney(row0[buyInKey]) : null,
    pot: potKey ? parseMoney(row0[potKey]) : null,
  };
}

export async function loadPokerData(): Promise<{
  rowsBySeason: SeasonRows;
  summary: SummaryStats;
}> {
  const rowsBySeason = createEmptySeasonRows();

  const [annualRows, winterRows, springRows, summaryRows] = await Promise.all([
    fetchCsv(SEASON_CONFIG.ANUAL.dataPath),
    fetchCsv(SEASON_CONFIG.WINTER.dataPath),
    fetchCsv(SEASON_CONFIG.SPRING.dataPath),
    fetchCsv(SUMMARY_CSV_PATH),
  ]);

  rowsBySeason.ANUAL = annualRows;
  rowsBySeason.WINTER = winterRows;
  rowsBySeason.SPRING = springRows;

  return {
    rowsBySeason,
    summary: extractSummary(summaryRows),
  };
}