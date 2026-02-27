import { useMemo, useState } from "react";
import { DEFAULT_SEASON_ID, SEASONS } from "../config/poker";
import SeasonChartsPanel from "../components/SeasonChartsPanel";
import { buildSeasonSummary } from "../utils/seasonSummary";
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

  return (
    <section className="page-section">
      <h2 className="page-title">TEMPORADAS</h2>
      <p className="page-subtitle">
        Compara la evolución global de cada temporada y su clasificación.
      </p>

      <div className="season-summary-grid">
        <div className="season-summary-card">
          <div className="season-summary-label">TEMPORADA ACTIVA</div>
          <div className="season-summary-value">
            {SEASONS.find((season) => season.id === seasonId)?.label ?? "—"}
          </div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">LÍDER</div>
          <div className="season-summary-value">{summary.leaderLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">GANANCIA DEL LÍDER</div>
          <div className="season-summary-value">{summary.leaderProfit.toFixed(2)} €</div>
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
        title="ANÁLISIS DE TEMPORADA"
      />
    </section>
  );
}