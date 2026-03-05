import { Link } from "react-router-dom";
import { useMemo } from "react";
import { PLAYER_BY_ID } from "../config/poker";
import type { PlayerStats, SeasonId, SeasonRows } from "../types/poker";
import { computeRankingDeltaForSeason } from "../utils/rankingDelta";

type Props = {
  stats: PlayerStats[];
  rowsBySeason: SeasonRows;
  seasonId: SeasonId;
};

export default function HomeStandingsPreview({ stats, rowsBySeason, seasonId }: Props) {
  const deltaInfo = useMemo(() => {
    return computeRankingDeltaForSeason(rowsBySeason, seasonId);
  }, [rowsBySeason, seasonId]);

  return (
    <section className="home-block">
      <div className="home-standings-header">
        <h3 className="subsection-title">
          Clasificación rápida
          {deltaInfo.previousJornada != null && deltaInfo.latestJornada != null && (
            <span className="rank-delta-caption">
              (vs Jornada {deltaInfo.previousJornada})
            </span>
          )}
        </h3>

        <Link to="/players" className="back-inline-link">
          Ver jugadores →
        </Link>
      </div>

      <div className="home-standings-table-wrap">
        {stats.length > 0 ? (
          <table className="home-standings-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>Δ</th>
                <th>JUGADOR</th>
                <th>BENEFICIO</th>
                <th>VICTORIAS</th>
                <th>MEDIA</th>
              </tr>
            </thead>

            <tbody>
              {stats.map((player, index) => {
                const name = PLAYER_BY_ID[player.playerId]?.label ?? player.playerLabel;

                const d = deltaInfo.byPlayerId[String(player.playerId)];
                const delta = d?.delta ?? 0;

                let deltaClass = "rank-same";
                let deltaText = "—";

                if (d?.previousPos == null) {
                  deltaClass = "rank-new";
                  deltaText = "NEW";
                } else if (delta > 0) {
                  deltaClass = "rank-up";
                  deltaText = `↑ ${delta}`;
                } else if (delta < 0) {
                  deltaClass = "rank-down";
                  deltaText = `↓ ${Math.abs(delta)}`;
                }

                return (
                  <tr key={player.playerId}>
                    <td>#{index + 1}</td>

                    <td>
                      <span className={`rank-delta ${deltaClass}`}>{deltaText}</span>
                    </td>

                    <td>{name}</td>

                    <td className={player.totalProfit >= 0 ? "pos" : "neg"}>
                      {player.totalProfit.toFixed(2)} €
                    </td>

                    <td>{player.firstPlaces}</td>

                    <td className={player.averageProfit >= 0 ? "pos" : "neg"}>
                      {player.averageProfit.toFixed(2)} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="home-standings-empty">
            No hay clasificación disponible para esta temporada.
          </div>
        )}
      </div>
    </section>
  );
}