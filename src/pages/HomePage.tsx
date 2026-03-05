import { useMemo, useState } from "react";
import {
  DEFAULT_SEASON_ID,
  MATCHDAY_MEDIA,
  SEASON_BY_ID,
  getAnnualMatchdayFromSeason,
} from "../config/poker";
import { HOME_STREAMS } from "../config/homeStreams";
import PlayersGrid from "../components/PlayersGrid";
import SeasonChartsPanel from "../components/SeasonChartsPanel";
import HomeOverviewCards from "../components/HomeOverviewCards";
import HomeLatestMatchday from "../components/HomeLatestMatchday";
import HomeQuickLinks from "../components/HomeQuickLinks";
import HomeStandingsPreview from "../components/HomeStandingsPreview";
import HomeStreamsPanel from "../components/HomeStreamsPanel";
import { buildMatchdaysForSeason } from "../utils/matchdays";
import { buildSeasonSummary } from "../utils/seasonSummary";
import { getSeasonStatusClass, getSeasonStatusLabel } from "../utils/seasonMeta";
import type { PlayerStats, SeasonId, SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function HomePage({ rowsBySeason, statsBySeason }: Props) {
  (null);

  // ✅ UNA SOLA SEASON para todo el Home
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const currentSeasonStats = statsBySeason[seasonId] ?? [];
  const currentSeason = SEASON_BY_ID[seasonId];

  const seasonSummary = useMemo(() => {
    return buildSeasonSummary(currentSeasonStats);
  }, [currentSeasonStats]);

  const latestMatchday = useMemo(() => {
    const matchdays = buildMatchdaysForSeason(rowsBySeason[seasonId] ?? [], seasonId);
    return matchdays[0] ?? null;
  }, [rowsBySeason, seasonId]);

  const latestMatchdayMedia = useMemo(() => {
    if (!latestMatchday) return undefined;

    const annualMatchday = getAnnualMatchdayFromSeason(
      latestMatchday.seasonId,
      latestMatchday.jornada
    );

    if (annualMatchday == null) return undefined;

    return MATCHDAY_MEDIA[annualMatchday];
  }, [latestMatchday]);

  return (
    <>
      <section className="page-section home-section">
        <h2 className="page-title">TIMBASPOKER HOME</h2>

        <p className="page-subtitle">
          Resumen rápido de la liga, últimos directos y acceso directo a los apartados clave.
        </p>

        <HomeStreamsPanel streams={HOME_STREAMS} />

        <HomeOverviewCards stats={currentSeasonStats} summary={seasonSummary} />

        <HomeLatestMatchday matchday={latestMatchday} media={latestMatchdayMedia} />

        <HomeQuickLinks />

        {/* ✅ PANEL ÚNICO: CLASIFICACIÓN + GRÁFICAS */}
        <section className="home-seasonboard">
          <h2 className="home-seasonboard-title">
            CLASIFICACIÓN RÁPIDA Y GRÁFICAS DE TEMPORADA
          </h2>

          <div className="charts-buttons home-seasonboard-tabs">
            {Object.values(SEASON_BY_ID).map((season) => (
              <button
                key={season.id}
                type="button"
                className={`season-tab ${seasonId === season.id ? "active" : ""}`}
                onClick={() => setSeasonId(season.id)}
              >
                {season.label}
              </button>
            ))}
          </div>

          {currentSeason && (
            <div className="season-page-meta home-seasonboard-meta">
              <span className={`season-status-badge ${getSeasonStatusClass(currentSeason.status)}`}>
                {getSeasonStatusLabel(currentSeason.status)}
              </span>
              <span className="season-duration-text">{currentSeason.dateRangeLabel}</span>
            </div>
          )}

          <HomeStandingsPreview
            stats={currentSeasonStats}
            rowsBySeason={rowsBySeason}
            seasonId={seasonId}
          />

          {/* Ocultaremos el título/tabs internos del panel de charts SOLO EN HOME via CSS */}
          <div className="home-seasonboard-charts">
            <SeasonChartsPanel
              selectedSeasonId={seasonId}
              onChangeSeason={setSeasonId}
              rowsBySeason={rowsBySeason}
              title="GRÁFICAS DE LA TEMPORADA"
              showHeader={false}
            />
          </div>
        </section>
      </section>

      {/* ✅ JUGADORES al final */}
      <section className="page-section home-section">
        <h2 className="page-title">JUGADORES DESTACADOS</h2>
        <p className="page-subtitle">
          Accede rápido a estadísticas y perfil individual de cada jugador.
        </p>

        <PlayersGrid stats={currentSeasonStats} />
      </section>
    </>
  );
}