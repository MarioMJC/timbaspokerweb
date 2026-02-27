import { PLAYER_BY_ID } from "../config/poker";
import type { PlayerId, PlayerStats } from "../types/poker";

type Props = {
  playerId: PlayerId;
  stats: PlayerStats | null;
  rank: number | null;
  totalPlayers: number;
};

export default function PlayerProfileHero({
  playerId,
  stats,
  rank,
  totalPlayers,
}: Props) {
  const player = PLAYER_BY_ID[playerId];

  return (
    <section className="player-profile-hero">
      <div className="player-profile-avatar-wrap">
        <img
          src={player?.img ?? ""}
          alt={player?.label ?? playerId}
          className="player-profile-avatar"
        />
      </div>

      <div className="player-profile-main">
        <p className="player-profile-kicker">PERFIL DE JUGADOR</p>
        <h2 className="player-profile-name">{player?.label ?? playerId}</h2>

        <p className="player-profile-text">
          Seguimiento individual del rendimiento, evolución y resultados de este jugador
          dentro de la liga TimbasPoker.
        </p>

        <div className="player-profile-highlight-row">
          <div className="player-profile-highlight">
            <span>RANKING</span>
            <strong>{rank == null ? "—" : `#${rank} / ${totalPlayers}`}</strong>
          </div>

          <div className="player-profile-highlight">
            <span>GANANCIA TOTAL</span>
            <strong>{stats ? `${stats.totalProfit.toFixed(2)} €` : "—"}</strong>
          </div>

          <div className="player-profile-highlight">
            <span>MEDIA</span>
            <strong>{stats ? `${stats.averageProfit.toFixed(2)} €` : "—"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}