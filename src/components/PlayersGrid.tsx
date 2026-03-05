import { Link } from "react-router-dom";
import { PLAYER_BY_ID } from "../config/poker";
import { getRank } from "../utils/pokerStats";
import type { PlayerStats } from "../types/poker";

type Props = {
  stats: PlayerStats[];
};

function rankLabel(rank: number, total: number) {
  if (rank === 1) return "PRIMERO";
  if (rank === 2) return "SEGUNDO";
  if (rank === 3) return "TERCERO";
  if (rank === total) return "ÚLTIMO";
  return `#${rank}`;
}

export default function PlayersGrid({ stats }: Props) {
  return (
    <div className="players-row">
      {stats.map((playerStats) => {
        const meta = PLAYER_BY_ID[playerStats.playerId];
        const rank = getRank(stats, playerStats.playerId);

        return (
          <div
            key={playerStats.playerId}
            className={`player-card rank-${rank} player-card-shell`}
          >
            <div className="badge">{rankLabel(rank, stats.length)}</div>

            <img src={meta?.img ?? ""} alt={meta?.label ?? playerStats.playerLabel} />
            <p>{meta?.label ?? playerStats.playerLabel}</p>

            <div className="player-card-actions player-card-actions-single">
              <Link
                to={`/players/${playerStats.playerId}`}
                className="player-card-btn secondary"
              >
                Perfil
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}