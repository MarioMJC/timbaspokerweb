import { PLAYER_BY_ID } from "../config/poker";
import type { PlayerStats } from "../types/poker";
import type { SeasonSummary } from "../utils/seasonSummary";

type Props = {
  stats: PlayerStats[];
  summary: SeasonSummary;
};

export default function HomeOverviewCards({ stats, summary }: Props) {
  const topWinner = stats[0] ?? null;
  const mostFirstPlaces =
    [...stats].sort((a, b) => b.firstPlaces - a.firstPlaces)[0] ?? null;

  return (
    <section className="home-block">
      <div className="home-overview-grid">
        <article className="home-overview-card">
          <div className="home-overview-label">LÍDER ACTUAL</div>
          <div className="home-overview-value">{summary.leaderLabel}</div>
          <div className="home-overview-meta">
            {summary.leaderProfit.toFixed(2)} €
          </div>
        </article>

        <article className="home-overview-card">
          <div className="home-overview-label">MAYOR GANADOR</div>
          <div className="home-overview-value">
            {topWinner ? (PLAYER_BY_ID[topWinner.playerId]?.label ?? topWinner.playerLabel) : "—"}
          </div>
          <div className="home-overview-meta">
            {topWinner ? `${topWinner.totalProfit.toFixed(2)} €` : "—"}
          </div>
        </article>

        <article className="home-overview-card">
          <div className="home-overview-label">JORNADAS JUGADAS</div>
          <div className="home-overview-value">{summary.jornadasPlayed}</div>
          <div className="home-overview-meta">
            {summary.totalPlayers} jugadores registrados
          </div>
        </article>

        <article className="home-overview-card">
          <div className="home-overview-label">MÁS VICTORIAS</div>
          <div className="home-overview-value">
            {mostFirstPlaces
              ? (PLAYER_BY_ID[mostFirstPlaces.playerId]?.label ?? mostFirstPlaces.playerLabel)
              : "—"}
          </div>
          <div className="home-overview-meta">
            {mostFirstPlaces ? `${mostFirstPlaces.firstPlaces} primeros puestos` : "—"}
          </div>
        </article>
      </div>
    </section>
  );
}