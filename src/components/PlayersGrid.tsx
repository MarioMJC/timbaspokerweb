import { PLAYER_BY_ID } from "../config/poker";
import { getRank } from "../utils/pokerStats";
import type { PlayerId, PlayerStats } from "../types/poker";

type Props = {
  stats: PlayerStats[];
  onSelectPlayer: (playerId: PlayerId) => void;
};

function rankLabel(rank: number, total: number) {
  if (rank === 1) return "PRIMERO";
  if (rank === 2) return "SEGUNDO";
  if (rank === 3) return "TERCERO";
  if (rank === total) return "ÚLTIMO";
  return `#${rank}`;
}

export default function PlayersGrid({ stats, onSelectPlayer }: Props) {
  return (
    <div className="players-row">
      {stats.map((playerStats) => {
        const meta = PLAYER_BY_ID[playerStats.playerId];
        const rank = getRank(stats, playerStats.playerId);

        return (
          <button
            key={playerStats.playerId}
            className={`player-card rank-${rank}`}
            onClick={() => onSelectPlayer(playerStats.playerId)}
            type="button"
            aria-label={`Ver estadísticas de ${meta?.label ?? playerStats.playerLabel}`}
          >
            <div className="badge">{rankLabel(rank, stats.length)}</div>
            <img src={meta?.img ?? ""} alt={meta?.label ?? playerStats.playerLabel} />
            <p>{meta?.label ?? playerStats.playerLabel}</p>
          </button>
        );
      })}
    </div>
  );
}