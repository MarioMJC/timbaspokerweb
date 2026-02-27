import { useMemo, useState } from "react";
import "./App.css";

import AnnualCharts from "./components/AnnualCharts";
import PlayerModal from "./components/PlayerModal";

import { PLAYER_META, SEASON_CONFIG, SOCIAL_LINKS } from "./config/poker";
import { usePokerData } from "./hooks/usePokerData";
import { computeAllStats, getRank } from "./utils/pokerStats";

import type { PlayerKey, SeasonKey } from "./types/poker";

function rankLabel(rank: number, total: number) {
  if (rank === 1) return "PRIMERO";
  if (rank === 2) return "SEGUNDO";
  if (rank === 3) return "TERCERO";
  if (rank === total) return "ÚLTIMO";
  return `#${rank}`;
}

export default function App() {
  const { rowsBySeason, summary, loading, error } = usePokerData();

  const [selected, setSelected] = useState<PlayerKey | null>(null);
  const [chartSeason, setChartSeason] = useState<SeasonKey>("ANUAL");

  const statsAnnualSorted = useMemo(() => computeAllStats(rowsBySeason.ANUAL), [rowsBySeason.ANUAL]);
  const statsWinterSorted = useMemo(() => computeAllStats(rowsBySeason.WINTER), [rowsBySeason.WINTER]);
  const statsSpringSorted = useMemo(() => computeAllStats(rowsBySeason.SPRING), [rowsBySeason.SPRING]);

  const statsBySeason = useMemo(() => {
    if (chartSeason === "WINTER") return statsWinterSorted;
    if (chartSeason === "SPRING") return statsSpringSorted;
    return statsAnnualSorted;
  }, [chartSeason, statsAnnualSorted, statsWinterSorted, statsSpringSorted]);

  const orderedPlayers = useMemo(() => {
    return statsBySeason.map((stats) => {
      const rank = getRank(statsBySeason, stats.player);

      return {
        player: stats.player,
        label: PLAYER_META[stats.player].label,
        img: PLAYER_META[stats.player].img,
        rank,
        rankText: rankLabel(rank, statsBySeason.length),
      };
    });
  }, [statsBySeason]);

  const chartRows = rowsBySeason[chartSeason];

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
                key={player.player}
                className={`player-card rank-${player.rank}`}
                onClick={() => setSelected(player.player)}
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
              {Object.values(SEASON_CONFIG).map((season) => (
                <button
                  key={season.key}
                  className={`season-tab ${chartSeason === season.key ? "active" : ""}`}
                  onClick={() => setChartSeason(season.key)}
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
        open={selected !== null}
        onClose={() => setSelected(null)}
        player={selected}
        statsAnnualSorted={statsAnnualSorted}
        statsWinterSorted={statsWinterSorted}
        statsSpringSorted={statsSpringSorted}
      />
    </div>
  );
}