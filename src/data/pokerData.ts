import { DEFAULT_SEASON_ID, SEASONS, SUMMARY_CSV_PATH } from "../config/poker";
import type { SeasonRows, SummaryStats } from "../types/poker";
import { fetchCsv, parseMoney, pickHeader } from "../lib/csv";

function createEmptySeasonRows(): SeasonRows {
  return SEASONS.reduce<SeasonRows>((acc, season) => {
    acc[season.id] = [];
    return acc;
  }, { [DEFAULT_SEASON_ID]: [] });
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

  const seasonRows = await Promise.all(
    SEASONS.map(async (season) => ({
      id: season.id,
      rows: await fetchCsv(season.dataPath),
    }))
  );

  const summaryRows = await fetchCsv(SUMMARY_CSV_PATH);

  for (const season of seasonRows) {
    rowsBySeason[season.id] = season.rows;
  }

  return {
    rowsBySeason,
    summary: extractSummary(summaryRows),
  };
}