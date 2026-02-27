import { useMemo, useState } from "react";
import { DEFAULT_SEASON_ID, SEASONS } from "../config/poker";
import MatchdayCard from "../components/MatchdayCard";
import { buildMatchdaysForSeason } from "../utils/matchdays";
import { getSeasonStatusClass, getSeasonStatusLabel } from "../utils/seasonMeta";
import type { SeasonId, SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
};

export default function MatchdaysPage({ rowsBySeason }: Props) {
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const selectedSeason = SEASONS.find((season) => season.id === seasonId);

  const matchdays = useMemo(() => {
    return buildMatchdaysForSeason(rowsBySeason[seasonId] ?? [], seasonId);
  }, [rowsBySeason, seasonId]);

  return (
    <section className="page-section">
      <h2 className="page-title">JORNADAS</h2>
      <p className="page-subtitle">
        Histórico de jornadas con ganador del día, líder tras cada sesión y acceso al detalle.
      </p>

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

      {selectedSeason && (
        <>
          <div className="season-page-meta">
            <span className={`season-status-badge ${getSeasonStatusClass(selectedSeason.status)}`}>
              {getSeasonStatusLabel(selectedSeason.status)}
            </span>
            <span className="season-duration-text">{selectedSeason.dateRangeLabel}</span>
          </div>

          <div className="season-summary-grid compact-season-summary-grid">
            <div className="season-summary-card">
              <div className="season-summary-label">TEMPORADA</div>
              <div className="season-summary-value">{selectedSeason.label}</div>
            </div>

            <div className="season-summary-card">
              <div className="season-summary-label">ESTADO</div>
              <div className="season-summary-value">
                {getSeasonStatusLabel(selectedSeason.status)}
              </div>
            </div>

            <div className="season-summary-card">
              <div className="season-summary-label">DURACIÓN</div>
              <div className="season-summary-value season-summary-value-small">
                {selectedSeason.dateRangeLabel}
              </div>
            </div>

            <div className="season-summary-card">
              <div className="season-summary-label">JORNADAS REGISTRADAS</div>
              <div className="season-summary-value">{matchdays.length}</div>
            </div>
          </div>
        </>
      )}

      <div className="matchdays-grid">
        {matchdays.map((item) => (
          <MatchdayCard key={`${item.seasonId}-${item.jornada}`} item={item} />
        ))}
      </div>
    </section>
  );
}