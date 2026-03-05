import { Link } from "react-router-dom";
import { SEASON_BY_ID } from "../config/poker";
import type { MatchdaySummary } from "../utils/matchdays";

type Props = {
  matchday: MatchdaySummary | null;
  media?: {
    winnerImage: string;
    finalHandImage: string;
  };
};

export default function HomeLatestMatchday({ matchday, media }: Props) {
  if (!matchday) {
    return (
      <section className="home-block">
        <article className="home-feature-card">
          <div className="home-feature-copy">
            <span className="home-feature-chip">ÚLTIMA JORNADA</span>
            <h3 className="home-feature-title">Todavía no hay jornadas registradas</h3>
            <p className="home-feature-text">
              En cuanto subas datos de la temporada, aquí aparecerá el último resumen.
            </p>
          </div>
        </article>
      </section>
    );
  }

  const season = SEASON_BY_ID[matchday.seasonId];
  const isFinishedSeason = season?.status !== "active";

  const chipText = isFinishedSeason
    ? `FINAL DE TEMPORADA ${matchday.seasonLabel.toUpperCase()}`
    : "ÚLTIMA JORNADA";

  const introText = isFinishedSeason
    ? "Ganador de la temporada"
    : "Ganador del día";

  return (
    <section className="home-block">
      <article className="home-feature-card">
        <div className="home-feature-copy">
          <span className={`home-feature-chip ${isFinishedSeason ? "long" : ""}`}>
            {chipText}
          </span>

          <h3 className="home-feature-title">
            {matchday.seasonLabel} · Jornada {matchday.jornada}
          </h3>

          <p className="home-feature-text">
            {introText}: <strong>{matchday.winnerLabel}</strong>
            {matchday.winnerProfit != null ? ` · ${matchday.winnerProfit.toFixed(2)} €` : ""}
          </p>

          <div className="home-feature-stats">
            <div className="home-feature-stat">
              <span>LÍDER TRAS LA JORNADA</span>
              <strong>{matchday.leaderAfterMatchLabel}</strong>
            </div>

            <div className="home-feature-stat">
              <span>REENGANCHES</span>
              <strong>{matchday.rebuyCount}</strong>
            </div>

            <div className="home-feature-stat">
              <span>BALANCE DE LA MESA</span>
              <strong>{matchday.totalPotChange.toFixed(2)} €</strong>
            </div>
          </div>

          <div className="home-feature-actions">
            <Link
              to={`/matchdays/${matchday.seasonId}/${matchday.jornada}`}
              className="home-cta-btn primary"
            >
              VER DETALLES
            </Link>

            <Link to="/matchdays" className="home-cta-btn secondary">
              VER TODAS LAS JORNADAS
            </Link>
          </div>
        </div>

        {media && (
          <div className="home-feature-media">
            <img
              src={media.winnerImage}
              alt={`Ganador jornada ${matchday.jornada}`}
              loading="lazy"
            />
          </div>
        )}
      </article>
    </section>
  );
}