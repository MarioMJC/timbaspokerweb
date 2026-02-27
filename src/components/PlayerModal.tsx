import { useEffect, useMemo, useState } from "react";
import type { PlayerKey, PlayerStats, SeasonKey } from "../types/poker";
import { getRank } from "../utils/pokerStats";
import { SEASON_CONFIG } from "../config/poker";

type Props = {
  open: boolean;
  onClose: () => void;
  player: PlayerKey | null;
  statsAnnualSorted: PlayerStats[];
  statsWinterSorted: PlayerStats[];
  statsSpringSorted: PlayerStats[];
};

export default function PlayerModal({
  open,
  onClose,
  player,
  statsAnnualSorted,
  statsWinterSorted,
  statsSpringSorted,
}: Props) {
  const [season, setSeason] = useState<SeasonKey>("ANUAL");

  useEffect(() => {
    if (open) {
      setSeason("ANUAL");
    }
  }, [open, player]);

  const seasonStats = useMemo(() => {
    if (season === "WINTER") return statsWinterSorted;
    if (season === "SPRING") return statsSpringSorted;
    return statsAnnualSorted;
  }, [season, statsAnnualSorted, statsWinterSorted, statsSpringSorted]);

  const current = useMemo(() => {
    if (!player) return null;
    return seasonStats.find((x) => x.player === player) ?? null;
  }, [player, seasonStats]);

  if (!open || !player) return null;

  const totalPlayers = seasonStats.length || 4;
  const rank = seasonStats.length ? getRank(seasonStats, player) : totalPlayers;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{player}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="season-tabs">
          {Object.values(SEASON_CONFIG).map((seasonItem) => (
            <button
              key={seasonItem.key}
              type="button"
              className={`season-tab ${season === seasonItem.key ? "active" : ""}`}
              onClick={() => setSeason(seasonItem.key)}
            >
              {seasonItem.label}
            </button>
          ))}
        </div>

        {!current ? (
          <p className="muted">No hay datos para {season}.</p>
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