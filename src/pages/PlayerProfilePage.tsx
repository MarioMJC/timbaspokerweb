import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_SEASON_ID,
  PLAYER_BY_ID,
  SEASONS,
} from "../config/poker";
import { getRank } from "../utils/pokerStats";
import {
  buildPlayerHistory,
  getBestProfit,
  getBestRank,
  getTotalRebuy,
  getWorstProfit,
} from "../utils/playerHistory";
import PlayerProfileHero from "../components/PlayerProfileHero";
import PlayerStatsGrid from "../components/PlayerStatsGrid";
import PlayerHistoryTable from "../components/PlayerHistoryTable";
import SeasonChartsPanel from "../components/SeasonChartsPanel";
import type { PlayerStats, SeasonId, SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function PlayerProfilePage({ rowsBySeason, statsBySeason }: Props) {
  const { playerId } = useParams<{ playerId: string }>();
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const player = playerId ? PLAYER_BY_ID[playerId] : null;

  const seasonStats = statsBySeason[seasonId] ?? [];
  const currentStats =
    playerId ? seasonStats.find((s) => s.playerId === playerId) ?? null : null;

  const rank =
    playerId && currentStats ? getRank(seasonStats, playerId) : null;

  const history = useMemo(() => {
    if (!playerId) return [];
    return buildPlayerHistory(rowsBySeason[seasonId] ?? [], playerId);
  }, [rowsBySeason, seasonId, playerId]);

  const bestProfit = useMemo(() => getBestProfit(history), [history]);
  const worstProfit = useMemo(() => getWorstProfit(history), [history]);
  const bestRank = useMemo(() => getBestRank(history), [history]);
  const totalRebuy = useMemo(() => getTotalRebuy(history), [history]);

  if (!playerId || !player) {
    return (
      <section className="page-section not-found">
        <h2 className="page-title">JUGADOR NO ENCONTRADO</h2>
        <p className="page-subtitle">Ese perfil no existe dentro de TimbasPoker.</p>
        <Link to="/players" className="back-home-btn">
          VOLVER A JUGADORES
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="player-profile-topbar">
        <Link to="/players" className="back-inline-link">
          ← Volver a jugadores
        </Link>
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

      <PlayerProfileHero
        playerId={playerId}
        stats={currentStats}
        rank={rank}
        totalPlayers={seasonStats.length}
      />

      <PlayerStatsGrid
        totalProfit={currentStats?.totalProfit ?? null}
        averageProfit={currentStats?.averageProfit ?? null}
        firstPlaces={currentStats?.firstPlaces ?? null}
        jornadasPlayed={currentStats?.jornadasPlayed ?? null}
        totalRebuy={totalRebuy}
        bestProfit={bestProfit}
        worstProfit={worstProfit}
        bestRank={bestRank}
      />

      <SeasonChartsPanel
        selectedSeasonId={seasonId}
        onChangeSeason={setSeasonId}
        rowsBySeason={rowsBySeason}
        title={`EVOLUCIÓN DE ${player.label.toUpperCase()}`}
      />

      <PlayerHistoryTable rows={history} />
    </section>
  );
}