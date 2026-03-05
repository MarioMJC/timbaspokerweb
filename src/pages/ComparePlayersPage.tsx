import { useMemo, useState } from "react";
import { DEFAULT_SEASON_ID, PLAYER_BY_ID, PLAYERS, SEASONS } from "../config/poker";
import ComparePlayersChart from "../components/ComparePlayersChart";
import {
  buildCompareChartData,
  buildCompareSharedRows,
  buildCompareSummary,
  buildDuelHeadline,
  findPlayerStats,
} from "../utils/playerCompare";
import type { PlayerStats, SeasonId, SeasonRows, PlayerId } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

function formatMoney(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(2)} €`;
}

function compareClass(value: number | null) {
  if (value == null) return "";
  return value >= 0 ? "pos" : "neg";
}

export default function ComparePlayersPage({ rowsBySeason, statsBySeason }: Props) {
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);
  const [playerAId, setPlayerAId] = useState<PlayerId>("mario");
  const [playerBId, setPlayerBId] = useState<PlayerId>("joselu");

  const currentStats = statsBySeason[seasonId] ?? [];

  const playerAStats = useMemo(() => findPlayerStats(currentStats, playerAId), [currentStats, playerAId]);
  const playerBStats = useMemo(() => findPlayerStats(currentStats, playerBId), [currentStats, playerBId]);

  const sharedRows = useMemo(() => {
    return buildCompareSharedRows(rowsBySeason, seasonId, playerAId, playerBId);
  }, [rowsBySeason, seasonId, playerAId, playerBId]);

  const compareSummary = useMemo(() => {
    return buildCompareSummary(sharedRows, playerAId, playerBId);
  }, [sharedRows, playerAId, playerBId]);

  const chartData = useMemo(() => {
    return buildCompareChartData(rowsBySeason, seasonId, playerAId, playerBId);
  }, [rowsBySeason, seasonId, playerAId, playerBId]);

  const headline = useMemo(() => {
    return buildDuelHeadline(compareSummary, playerAId, playerBId);
  }, [compareSummary, playerAId, playerBId]);

  const playerA = PLAYER_BY_ID[playerAId];
  const playerB = PLAYER_BY_ID[playerBId];

  const swapPlayers = () => {
    setPlayerAId(playerBId);
    setPlayerBId(playerAId);
  };

  return (
    <section className="page-section">
      <h2 className="page-title">COMPARADOR DE JUGADORES</h2>
      <p className="page-subtitle">
        Enfrenta dos jugadores, compara su rendimiento y descubre quién domina el cara a cara.
      </p>

      <div className="charts-buttons compare-season-tabs">
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

      <div className="compare-controls">
        <div className="compare-select-card">
          <span className="compare-select-label">JUGADOR A</span>
          <select
            className="compare-select"
            value={playerAId}
            onChange={(e) => {
              const nextId = e.target.value as PlayerId;
              if (nextId === playerBId) {
                setPlayerBId(playerAId);
              }
              setPlayerAId(nextId);
            }}
          >
            {PLAYERS.map((player) => (
              <option key={player.id} value={player.id}>
                {player.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="compare-swap-btn" onClick={swapPlayers}>
          ⇄ CAMBIAR LADOS
        </button>

        <div className="compare-select-card">
          <span className="compare-select-label">JUGADOR B</span>
          <select
            className="compare-select"
            value={playerBId}
            onChange={(e) => {
              const nextId = e.target.value as PlayerId;
              if (nextId === playerAId) {
                setPlayerAId(playerBId);
              }
              setPlayerBId(nextId);
            }}
          >
            {PLAYERS.map((player) => (
              <option key={player.id} value={player.id}>
                {player.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="season-page-meta compare-meta">
        <span className="season-date-range">{headline}</span>
      </div>

      <div className="compare-hero-grid">
        <article className="compare-player-card">
          <div className="compare-player-top">
            <img src={playerA.img} alt={playerA.label} className="compare-player-avatar" />
            <div>
              <div className="compare-player-kicker">JUGADOR A</div>
              <h3 className="compare-player-name">{playerA.label}</h3>
              <p className={`compare-player-profit ${compareClass(playerAStats?.totalProfit ?? null)}`}>
                {formatMoney(playerAStats?.totalProfit ?? null)}
              </p>
            </div>
          </div>

          <div className="compare-mini-grid">
            <div className="compare-mini-card">
              <span>Victorias</span>
              <strong>{playerAStats?.firstPlaces ?? 0}</strong>
            </div>
            <div className="compare-mini-card">
              <span>Media</span>
              <strong className={compareClass(playerAStats?.averageProfit ?? null)}>
                {formatMoney(playerAStats?.averageProfit ?? null)}
              </strong>
            </div>
            <div className="compare-mini-card">
              <span>Jornadas</span>
              <strong>{playerAStats?.jornadasPlayed ?? 0}</strong>
            </div>
          </div>
        </article>

        <article className="compare-vs-card">
          <div className="compare-vs-badge">VS</div>
          <div className="compare-vs-text">{headline}</div>
          <div className="compare-vs-score">
            <span>{compareSummary.playerAAheadCount}</span>
            <small>cara a cara</small>
            <span>{compareSummary.playerBAheadCount}</span>
          </div>
        </article>

        <article className="compare-player-card">
          <div className="compare-player-top compare-player-top-right">
            <div>
              <div className="compare-player-kicker">JUGADOR B</div>
              <h3 className="compare-player-name">{playerB.label}</h3>
              <p className={`compare-player-profit ${compareClass(playerBStats?.totalProfit ?? null)}`}>
                {formatMoney(playerBStats?.totalProfit ?? null)}
              </p>
            </div>
            <img src={playerB.img} alt={playerB.label} className="compare-player-avatar" />
          </div>

          <div className="compare-mini-grid">
            <div className="compare-mini-card">
              <span>Victorias</span>
              <strong>{playerBStats?.firstPlaces ?? 0}</strong>
            </div>
            <div className="compare-mini-card">
              <span>Media</span>
              <strong className={compareClass(playerBStats?.averageProfit ?? null)}>
                {formatMoney(playerBStats?.averageProfit ?? null)}
              </strong>
            </div>
            <div className="compare-mini-card">
              <span>Jornadas</span>
              <strong>{playerBStats?.jornadasPlayed ?? 0}</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="season-summary-grid compare-summary-grid">
        <div className="season-summary-card">
          <div className="season-summary-label">JORNADAS COMPARTIDAS</div>
          <div className="season-summary-value">{compareSummary.sharedMatchdays}</div>
        </div>
        <div className="season-summary-card">
          <div className="season-summary-label">MEJOR JORNADA {playerA.label.toUpperCase()}</div>
          <div className={`season-summary-value ${compareClass(compareSummary.playerABestProfit)}`}>
            {formatMoney(compareSummary.playerABestProfit)}
          </div>
        </div>
        <div className="season-summary-card">
          <div className="season-summary-label">MEJOR JORNADA {playerB.label.toUpperCase()}</div>
          <div className={`season-summary-value ${compareClass(compareSummary.playerBBestProfit)}`}>
            {formatMoney(compareSummary.playerBBestProfit)}
          </div>
        </div>
        <div className="season-summary-card">
          <div className="season-summary-label">MAYOR BRECHA DEL DUELO</div>
          <div className="season-summary-value">{formatMoney(compareSummary.biggestProfitGap)}</div>
        </div>
      </div>

      <ComparePlayersChart data={chartData} playerAId={playerAId} playerBId={playerBId} />

      <section className="player-history-section">
        <h3 className="subsection-title">Cara a cara por jornada</h3>

        <div className="player-history-table-wrap">
          <table className="player-history-table compare-table">
            <thead>
              <tr>
                <th>JORNADA</th>
                <th>{playerA.label}</th>
                <th>POS</th>
                <th>{playerB.label}</th>
                <th>POS</th>
                <th>QUIÉN QUEDÓ POR DELANTE</th>
              </tr>
            </thead>
            <tbody>
              {sharedRows.map((row) => (
                <tr key={row.jornada}>
                  <td>J{row.jornada}</td>
                  <td className={compareClass(row.playerAProfit)}>{formatMoney(row.playerAProfit)}</td>
                  <td>{row.playerARank != null ? `#${row.playerARank}` : "—"}</td>
                  <td className={compareClass(row.playerBProfit)}>{formatMoney(row.playerBProfit)}</td>
                  <td>{row.playerBRank != null ? `#${row.playerBRank}` : "—"}</td>
                  <td>
                    {row.winnerId === playerAId
                      ? playerA.label
                      : row.winnerId === playerBId
                      ? playerB.label
                      : "Empate"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}