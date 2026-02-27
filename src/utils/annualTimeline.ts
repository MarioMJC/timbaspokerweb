import { PLAYER_KEYS } from "../config/poker";
import type { PlayerKey, CsvRow, TimelinePoint } from "../types/poker";
import { parseJornada, parseMoney, parsePosition } from "../lib/csv";

function computeAccumulatedRanks(
  cumulativeProfits: Record<PlayerKey, number>
): Record<PlayerKey, number> {
  const sorted = [...PLAYER_KEYS].sort((a, b) => {
    const diff = cumulativeProfits[b] - cumulativeProfits[a];
    if (diff !== 0) return diff;
    return PLAYER_KEYS.indexOf(a) - PLAYER_KEYS.indexOf(b);
  });

  const rankMap = {} as Record<PlayerKey, number>;

  sorted.forEach((player, index) => {
    rankMap[player] = index + 1;
  });

  return rankMap;
}

export function buildAnnualTimeline(rows: CsvRow[]): TimelinePoint[] {
  const cumulativeProfits: Record<PlayerKey, number> = {
    Mario: 0,
    Álvaro: 0,
    Joselu: 0,
    Gonzalo: 0,
  };

  const points: TimelinePoint[] = [];

  for (const row of rows) {
    const jornada = parseJornada(row["Partidas"]);
    if (!jornada) continue;

    for (const player of PLAYER_KEYS) {
      const profit = parseMoney(row[player]);
      if (profit !== null) {
        cumulativeProfits[player] += profit;
      }
    }

    const accumulatedRanks = computeAccumulatedRanks(cumulativeProfits);

    const point: TimelinePoint = { jornada };

    for (const player of PLAYER_KEYS) {
      const jornadaPosition = parsePosition(row[`Posiciones ${player}`]);

      point[`${player}€`] = cumulativeProfits[player];
      point[`${player}Pos`] = jornadaPosition;
      point[`${player}Rank`] = accumulatedRanks[player];
    }

    points.push(point);
  }

  points.sort((a, b) => a.jornada - b.jornada);
  return points;
}