import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  SEASON_BY_ID,
  MATCHDAY_MEDIA,
  getAnnualMatchdayFromSeason,
} from "../config/poker";
import MatchdayResultsTable from "../components/MatchdayResultsTable";
import { buildMatchdayDetail, buildMatchdayNarrative } from "../utils/matchdays";
import { getSeasonStatusClass, getSeasonStatusLabel } from "../utils/seasonMeta";
import type { SeasonRows } from "../types/poker";
import { parseJornada } from "../lib/csv";

type Props = {
  rowsBySeason: SeasonRows;
};

export default function MatchdayDetailPage({ rowsBySeason }: Props) {
  const params = useParams<{ seasonId: string; jornada: string }>();

  const rawSeasonId = params.seasonId;
  const rawJornada = params.jornada;

  const jornada = rawJornada ? Number(rawJornada) : NaN;

  const seasonRows = rawSeasonId ? rowsBySeason[rawSeasonId] ?? [] : [];

  // Jornadas disponibles dentro de esa season (según el CSV)
  const availableJornadas = useMemo(() => {
    const set = new Set<number>();

    for (const row of seasonRows) {
      const j = parseJornada(row["Partidas"]);
      if (j != null) set.add(j);
    }

    return Array.from(set).sort((a, b) => a - b);
  }, [seasonRows]);

  const currentIndex = Number.isFinite(jornada)
    ? availableJornadas.indexOf(jornada)
    : -1;

  const prevJornada = currentIndex > 0 ? availableJornadas[currentIndex - 1] : null;
  const nextJornada =
    currentIndex >= 0 && currentIndex < availableJornadas.length - 1
      ? availableJornadas[currentIndex + 1]
      : null;

  const detail =
    rawSeasonId && Number.isFinite(jornada)
      ? buildMatchdayDetail(seasonRows, rawSeasonId, jornada)
      : null;

  const season = rawSeasonId ? SEASON_BY_ID[rawSeasonId] : null;

  const annualMatchday =
    rawSeasonId && Number.isFinite(jornada)
      ? getAnnualMatchdayFromSeason(rawSeasonId, jornada)
      : null;

  const media =
    annualMatchday != null ? MATCHDAY_MEDIA[annualMatchday] : undefined;

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

      {/* TÍTULO CON FLECHAS */}
      <div className="matchday-title-row">
        {prevJornada != null && rawSeasonId ? (
          <Link
            to={`/matchdays/${rawSeasonId}/${prevJornada}`}
            className="matchday-nav-arrow"
            aria-label="Jornada anterior"
            title="Jornada anterior"
          >
            ←
          </Link>
        ) : (
          <span
            className="matchday-nav-arrow disabled"
            aria-hidden="true"
            title="No hay jornada anterior"
          >
            ←
          </span>
        )}

        <h2 className="page-title matchday-title">
          {detail.seasonLabel} · Jornada {detail.jornada}
        </h2>

        {nextJornada != null && rawSeasonId ? (
          <Link
            to={`/matchdays/${rawSeasonId}/${nextJornada}`}
            className="matchday-nav-arrow"
            aria-label="Jornada siguiente"
            title="Jornada siguiente"
          >
            →
          </Link>
        ) : (
          <span
            className="matchday-nav-arrow disabled"
            aria-hidden="true"
            title="No hay jornada siguiente"
          >
            →
          </span>
        )}
      </div>

      {season && (
        <div className="season-page-meta">
          <span className={`season-status-badge ${getSeasonStatusClass(season.status)}`}>
            {getSeasonStatusLabel(season.status)}
          </span>
          <span className="season-duration-text">{season.dateRangeLabel}</span>
        </div>
      )}

      <p className="page-subtitle">
        Ganador del día: <strong>{detail.winnerLabel}</strong>
        {detail.winnerProfit != null ? ` · ${detail.winnerProfit.toFixed(2)} €` : ""}
      </p>

      <div className="season-summary-grid compact-season-summary-grid">
        <div className="season-summary-card">
          <div className="season-summary-label">GANADOR</div>
          <div className="season-summary-value">{detail.winnerLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">LÍDER TRAS LA JORNADA</div>
          <div className="season-summary-value">{detail.leaderAfterMatchLabel}</div>
        </div>

        <div className="season-summary-card">
          <div className="season-summary-label">DURACIÓN</div>
          <div className="season-summary-value season-summary-value-small">
            {season?.dateRangeLabel ?? "—"}
          </div>
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

      {media && (
        <section className="matchday-media-section">
          <h3 className="subsection-title">Momento Clave de la Jornada</h3>

          <div className="matchday-media-grid">
            <div className="matchday-media-card">
              <h4>Ganador de la jornada</h4>
              <img src={media.winnerImage} alt="Ganador jornada" loading="lazy" />
            </div>

            <div className="matchday-media-card">
              <h4>Mano final</h4>
              <img src={media.finalHandImage} alt="Mano final" loading="lazy" />
            </div>
          </div>
        </section>
      )}

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