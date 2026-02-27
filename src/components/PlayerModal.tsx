import { useEffect, useMemo, useState } from "react";
import type { PlayerId, PlayerStats, SeasonId } from "../types/poker";
import { DEFAULT_SEASON_ID, SEASONS } from "../config/poker";
import { getRank } from "../utils/pokerStats";

type Props = {
  open: boolean;
  onClose: () => void;
  playerId: PlayerId | null;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function PlayerModal({
  open,
  onClose,
  playerId,
  statsBySeason,
}: Props) {
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  useEffect(() => {
    if (open) {
      setSeasonId(DEFAULT_SEASON_ID);
    }
  }, [open, playerId]);

  const seasonStats = useMemo(() => {
    return statsBySeason[seasonId] ?? [];
  }, [seasonId, statsBySeason]);

  const current = useMemo(() => {
    if (!playerId) return null;
    return seasonStats.find((x) => x.playerId === playerId) ?? null;
  }, [playerId, seasonStats]);

  if (!open || !playerId) return null;

  const totalPlayers = seasonStats.length || 1;
  const rank = seasonStats.length ? getRank(seasonStats, playerId) : totalPlayers;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{current?.playerLabel ?? playerId}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="season-tabs">
          {SEASONS.map((season) => (
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

        {!current ? (
          <p className="muted">No hay datos para esta temporada.</p>
        ) : (
          <div className="modal-grid">
            <div className="stat">
              <div className="stat-label">Ganancias acumuladas</div>
              <div className={`stat-value ${current.totalProfit >= 0 ? "pos" : "neg"}`}>
                {current.totalProfit.toFixed(2)} €
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">Posición (ranking)</div>
              <div className="stat-value">
                #{rank} / {totalPlayers}
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">Veces 1º</div>
              <div className="stat-value">{current.firstPlaces}</div>
            </div>

            <div className="stat">
              <div className="stat-label">Total reenganches</div>
              <div className="stat-value">{current.totalRebuy.toFixed(2)} €</div>
            </div>

            <div className="stat">
              <div className="stat-label">Jornadas jugadas</div>
              <div className="stat-value">{current.jornadasPlayed}</div>
            </div>

            <div className="stat">
              <div className="stat-label">Media por jornada</div>
              <div className={`stat-value ${current.averageProfit >= 0 ? "pos" : "neg"}`}>
                {current.averageProfit.toFixed(2)} €
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}