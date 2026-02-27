import { Link, useParams } from "react-router-dom";
import MatchdayResultsTable from "../components/MatchdayResultsTable";
import { buildMatchdayDetail, buildMatchdayNarrative } from "../utils/matchdays";
import type { SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
};

export default function MatchdayDetailPage({ rowsBySeason }: Props) {
  const params = useParams<{ seasonId: string; jornada: string }>();

  const seasonId = params.seasonId ?? "";
  const jornada = Number(params.jornada);

  const detail =
    Number.isFinite(jornada) && seasonId
      ? buildMatchdayDetail(rowsBySeason[seasonId] ?? [], seasonId, jornada)
      : null;

  if (!detail) {
    return (
      <section className="page-section not-found">
        <h2 className="page-title">JORNADA NO ENCONTRADA</h2>
        <p className="page-subtitle">
          No existe ese detalle de jornada dentro de TimbasPoker.
        </p>
        <Link to="/matchdays" className="back-home-btn">
          VOLVER A JORNADAS
        </Link>
      </section>
    );
  }

  const narrative = buildMatchdayNarrative(detail);

  return (
    <section className="page-section">
      <div className="player-profile-topbar">
        <Link to="/matchdays" className="back-inline-link">
          ← Volver a jornadas
        </Link>
      </div>

      <h2 className="page-title">
        {detail.seasonLabel} · Jornada {detail.jornada}
      </h2>

      <p className="page-subtitle">
        Ganador del día: <strong>{detail.winnerLabel}</strong>
        {detail.winnerProfit != null ? ` · ${detail.winnerProfit.toFixed(2)} €` : ""}
      </p>

      <div className="season-summary-grid">
        <div className="season-summary-card">
          <div className="season-summary-label">GANADOR</div>
          <div className="season-summary-value">{detail.winnerLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">LÍDER TRAS LA JORNADA</div>
          <div className="season-summary-value">{detail.leaderAfterMatchLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">REENGANCHES</div>
          <div className="season-summary-value">{detail.rebuyCount}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">BALANCE DE LA MESA</div>
          <div className="season-summary-value">{detail.totalPotChange.toFixed(2)} €</div>
        </div>
      </div>

      <section className="matchday-narrative">
        <h3 className="subsection-title">Resumen de la jornada</h3>
        <ul className="narrative-list">
          {narrative.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="player-history-section">
        <h3 className="subsection-title">Resultados por jugador</h3>
        <MatchdayResultsTable rows={detail.results} />
      </section>
    </section>
  );
}