import { Link } from "react-router-dom";
import { SEASON_BY_ID } from "../config/poker";
import { getSeasonStatusClass, getSeasonStatusLabel } from "../utils/seasonMeta";
import type { MatchdaySummary } from "../utils/matchdays";

type Props = {
  item: MatchdaySummary;
};

export default function MatchdayCard({ item }: Props) {
  const season = SEASON_BY_ID[item.seasonId];

  return (
    <article className="matchday-card">
      <div className="matchday-card-top">
        <span className="matchday-chip">{item.seasonLabel}</span>

        {season && (
          <span className={`season-status-badge ${getSeasonStatusClass(season.status)}`}>
            {getSeasonStatusLabel(season.status)}
          </span>
        )}
      </div>

      <div className="matchday-jornada">Jornada {item.jornada}</div>

      {season && <div className="matchday-duration">{season.dateRangeLabel}</div>}

      <h3 className="matchday-title">Ganador: {item.winnerLabel}</h3>

      <div className="matchday-card-grid">
        <div>
          <span className="matchday-label">Resultado ganador</span>
          <strong>{item.winnerProfit == null ? "—" : `${item.winnerProfit.toFixed(2)} €`}</strong>
        </div>

        <div>
          <span className="matchday-label">Líder tras la jornada</span>
          <strong>{item.leaderAfterMatchLabel}</strong>
        </div>

        <div>
          <span className="matchday-label">Reenganches</span>
          <strong>{item.rebuyCount}</strong>
        </div>
      </div>

      <Link
        to={`/matchdays/${item.seasonId}/${item.jornada}`}
        className="matchday-link"
      >
        Ver detalle
      </Link>
    </article>
  );
}