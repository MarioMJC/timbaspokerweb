import AnnualCharts from "./AnnualCharts";
import { SEASONS } from "../config/poker";
import type { CsvRow, PlayerId, SeasonId } from "../types/poker";

type Props = {
  selectedSeasonId: SeasonId;
  onChangeSeason: (seasonId: SeasonId) => void;
  rowsBySeason: Record<string, CsvRow[]>;
  title?: string;
  highlightPlayerId?: PlayerId | null;

  /** ✅ Nuevo: si es false, no muestra título ni botones internos */
  showHeader?: boolean;
};

export default function SeasonChartsPanel({
  selectedSeasonId,
  onChangeSeason,
  rowsBySeason,
  title = "GRÁFICAS",
  highlightPlayerId = null,
  showHeader = true,
}: Props) {
  const chartRows = rowsBySeason[selectedSeasonId] ?? [];

  return (
    <div className="charts-section">
      {showHeader && <h2 className="charts-title">{title}</h2>}

      {showHeader && (
        <div className="charts-buttons">
          {SEASONS.map((season) => (
            <button
              key={season.id}
              className={`season-tab ${selectedSeasonId === season.id ? "active" : ""}`}
              onClick={() => onChangeSeason(season.id)}
              type="button"
            >
              {season.label}
            </button>
          ))}
        </div>
      )}

      <AnnualCharts csvRows={chartRows} highlightPlayerId={highlightPlayerId} />
    </div>
  );
}