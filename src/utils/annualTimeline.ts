import { PLAYER_IDS, PLAYERS } from "../config/poker";
import type { PlayerId, CsvRow, TimelinePoint } from "../types/poker";
import { parseJornada, parseMoney } from "../lib/csv";

function computeAccumulatedRanks(
  cumulativeProfits: Record<PlayerId, number>
): Record<PlayerId, number> {
  const sorted = [...PLAYER_IDS].sort((a, b) => {
    const diff = cumulativeProfits[b] - cumulativeProfits[a];
    if (diff !== 0) return diff;
    return PLAYER_IDS.indexOf(a) - PLAYER_IDS.indexOf(b);
  });

  const rankMap = {} as Record<PlayerId, number>;

  sorted.forEach((playerId, index) => {
    rankMap[playerId] = index + 1;
  });

  return rankMap;
}

export function buildAnnualTimeline(rows: CsvRow[]): TimelinePoint[] {
  const cumulativeProfits = PLAYERS.reduce<Record<PlayerId, number>>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {});

  const points: TimelinePoint[] = [];

  for (const row of rows) {
    const jornada = parseJornada(row["Partidas"]);
    if (!jornada) continue;

    for (const player of PLAYERS) {
      const profit = parseMoney(row[player.csvName]);
      if (profit !== null) {
        cumulativeProfits[player.id] += profit;
      }
    }

    const accumulatedRanks = computeAccumulatedRanks(cumulativeProfits);

    const point: TimelinePoint = { jornada };

    for (const player of PLAYERS) {
      point[`${player.id}€`] = cumulativeProfits[player.id];
      point[`${player.id}Rank`] = accumulatedRanks[player.id];
    }

    points.push(point);
  }

  points.sort((a, b) => a.jornada - b.jornada);
  return points;
}