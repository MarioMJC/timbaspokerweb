import { useMemo, useState } from "react";
import { DEFAULT_SEASON_ID, SEASON_BY_ID, SEASONS } from "../config/poker";
import SeasonChartsPanel from "../components/SeasonChartsPanel";
import { buildSeasonSummary } from "../utils/seasonSummary";
import { getSeasonStatusClass, getSeasonStatusLabel } from "../utils/seasonMeta";
import type { PlayerStats, SeasonId, SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function SeasonsPage({ rowsBySeason, statsBySeason }: Props) {
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const summary = useMemo(() => {
    return buildSeasonSummary(statsBySeason[seasonId] ?? []);
  }, [seasonId, statsBySeason]);

  const selectedSeason = SEASON_BY_ID[seasonId];
  const isFinished = selectedSeason?.status === "finished";
  const statusLabel = getSeasonStatusLabel(selectedSeason?.status);
  const statusClass = getSeasonStatusClass(selectedSeason?.status);

  return (
    <section className="page-section">
      <h2 className="page-title">TEMPORADAS</h2>
      <p className="page-subtitle">
        Compara la evolución global de cada temporada y su clasificación.
      </p>

      <div className="season-meta-strip">
        <div className={`season-status-badge ${statusClass}`}>{statusLabel}</div>
        <div className="season-date-range">
          {selectedSeason?.dateRangeLabel ?? "Duración no definida"}
        </div>
      </div>

      <div className="charts-buttons">
        {SEASONS.map((season) => (
          <button
            key={season.id}
            className={`season-tab ${seasonId === season.id ? "active" : ""}`}
            onClick={() => setSeasonId(season.id)}
            type="button"
          >
            {season.label}
          </button>
        ))}
      </div>

      <div className="season-summary-grid">
        <div className="season-summary-card">
          <div className="season-summary-label">ESTADO</div>
          <div className={`season-summary-value ${statusClass}`}>{statusLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">DURACIÓN</div>
          <div className="season-summary-value">
            {selectedSeason?.dateRangeLabel ?? "—"}
          </div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">
            {isFinished ? "GANADOR" : "LÍDER"}
          </div>
          <div className="season-summary-value">{summary.leaderLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">
            {isFinished ? "GANANCIA DEL GANADOR" : "GANANCIA DEL LÍDER"}
          </div>
          <div className="season-summary-value">{summary.leaderProfit.toFixed(2)} €</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">JUGADORES</div>
          <div className="season-summary-value">{summary.totalPlayers}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">JORNADAS</div>
          <div className="season-summary-value">{summary.jornadasPlayed}</div>
        </div>
      </div>

      <SeasonChartsPanel
        selectedSeasonId={seasonId}
        onChangeSeason={setSeasonId}
        rowsBySeason={rowsBySeason}
        showHeader={false}
      />
    </section>
  );
}