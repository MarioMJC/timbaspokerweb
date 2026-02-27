import { useMemo, useState } from "react";
import "./App.css";

import AnnualCharts from "./components/AnnualCharts";
import PlayerModal from "./components/PlayerModal";

import {
  DEFAULT_SEASON_ID,
  PLAYER_BY_ID,
  SEASONS,
  SOCIAL_LINKS,
} from "./config/poker";
import { usePokerData } from "./hooks/usePokerData";
import { computeAllStats, getRank } from "./utils/pokerStats";

import type { PlayerId, PlayerStats, SeasonId } from "./types/poker";

function rankLabel(rank: number, total: number) {
  if (rank === 1) return "PRIMERO";
  if (rank === 2) return "SEGUNDO";
  if (rank === 3) return "TERCERO";
  if (rank === total) return "ÚLTIMO";
  return `#${rank}`;
}

export default function App() {
  const { rowsBySeason, summary, loading, error } = usePokerData();

  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId | null>(null);
  const [chartSeasonId, setChartSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const statsBySeason = useMemo(() => {
    return SEASONS.reduce<Record<SeasonId, PlayerStats[]>>((acc, season) => {
      acc[season.id] = computeAllStats(rowsBySeason[season.id] ?? []);
      return acc;
    }, {});
  }, [rowsBySeason]);

  const currentSeasonStats = statsBySeason[chartSeasonId] ?? [];

  const orderedPlayers = useMemo(() => {
    return currentSeasonStats.map((stats) => {
      const meta = PLAYER_BY_ID[stats.playerId];
      const rank = getRank(currentSeasonStats, stats.playerId);

      return {
        playerId: stats.playerId,
        label: meta?.label ?? stats.playerLabel,
        img: meta?.img ?? "",
        rank,
        rankText: rankLabel(rank, currentSeasonStats.length),
      };
    });
  }, [currentSeasonStats]);

  const chartRows = rowsBySeason[chartSeasonId] ?? [];

  return (
    <div className="main-container">
      <div className="top-right-stats">
        <div className="top-stat">
          <div className="top-stat-label">BUY-IN TOTAL</div>
          <div className="top-stat-value">
            {summary.buyIn == null ? "—" : `${summary.buyIn.toFixed(2)} €`}
          </div>
        </div>

        <div className="top-stat">
          <div className="top-stat-label">BOTE ACUMULADO</div>
          <div className="top-stat-value">
            {summary.pot == null ? "—" : `${summary.pot.toFixed(2)} €`}
          </div>
        </div>
      </div>

      <h1 className="title">TIMBASPOKER</h1>

      <div className="social-links">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-btn ${social.variant}`}
          >
            <img src={social.logo} alt={social.label} />
            <span>{social.label}</span>
          </a>
        ))}
      </div>

      {loading && <p className="muted">Cargando datos...</p>}
      {error && <p className="muted">{error}</p>}

      {!loading && !error && (
        <>
          <div className="players-row">
            {orderedPlayers.map((player) => (
              <button
                key={player.playerId}
                className={`player-card rank-${player.rank}`}
                onClick={() => setSelectedPlayerId(player.playerId)}
                type="button"
                aria-label={`Ver estadísticas de ${player.label}`}
              >
                <div className="badge">{player.rankText}</div>
                <img src={player.img} alt={player.label} />
                <p>{player.label}</p>
              </button>
            ))}
          </div>

          <div className="charts-section">
            <h2 className="charts-title">GRÁFICAS</h2>

            <div className="charts-buttons">
              {SEASONS.map((season) => (
                <button
                  key={season.id}
                  className={`season-tab ${chartSeasonId === season.id ? "active" : ""}`}
                  onClick={() => setChartSeasonId(season.id)}
                  type="button"
                >
                  {season.label}
                </button>
              ))}
            </div>

            <AnnualCharts csvRows={chartRows} />
          </div>
        </>
      )}

      <PlayerModal
        open={selectedPlayerId !== null}
        onClose={() => setSelectedPlayerId(null)}
        playerId={selectedPlayerId}
        statsBySeason={statsBySeason}
      />
    </div>
  );
}