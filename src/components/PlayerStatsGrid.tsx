type Props = {
  totalProfit: number | null;
  averageProfit: number | null;
  firstPlaces: number | null;
  jornadasPlayed: number | null;
  totalRebuy: number | null;
  bestProfit: number | null;
  worstProfit: number | null;
  bestRank: number | null;
};

function valueClass(value: number | null | undefined) {
  if (value == null) return "";
  if (value > 0) return "pos";
  if (value < 0) return "neg";
  return "";
}

export default function PlayerStatsGrid({
  totalProfit,
  averageProfit,
  firstPlaces,
  jornadasPlayed,
  totalRebuy,
  bestProfit,
  worstProfit,
  bestRank,
}: Props) {
  return (
    <section className="player-stats-grid">
      <div className="player-stat-card">
        <div className="stat-label">Ganancia acumulada</div>
        <div className={`stat-value ${valueClass(totalProfit)}`}>
          {totalProfit == null ? "—" : `${totalProfit.toFixed(2)} €`}
        </div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Media por jornada</div>
        <div className={`stat-value ${valueClass(averageProfit)}`}>
          {averageProfit == null ? "—" : `${averageProfit.toFixed(2)} €`}
        </div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Veces 1º</div>
        <div className="stat-value">{firstPlaces ?? "—"}</div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Jornadas jugadas</div>
        <div className="stat-value">{jornadasPlayed ?? "—"}</div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Total reenganches</div>
        <div className="stat-value">{totalRebuy == null ? "—" : `${totalRebuy.toFixed(2)} €`}</div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Mejor jornada</div>
        <div className={`stat-value ${valueClass(bestProfit)}`}>
          {bestProfit == null ? "—" : `${bestProfit.toFixed(2)} €`}
        </div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Peor jornada</div>
        <div className={`stat-value ${valueClass(worstProfit)}`}>
          {worstProfit == null ? "—" : `${worstProfit.toFixed(2)} €`}
        </div>
      </div>

      <div className="player-stat-card">
        <div className="stat-label">Mejor posición</div>
        <div className="stat-value">{bestRank == null ? "—" : `#${bestRank}`}</div>
      </div>
    </section>
  );
}