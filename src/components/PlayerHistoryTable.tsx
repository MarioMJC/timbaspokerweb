import type { PlayerHistoryRow } from "../utils/playerHistory";

type Props = {
  rows: PlayerHistoryRow[];
};

function formatMoney(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(2)} €`;
}

export default function PlayerHistoryTable({ rows }: Props) {
  if (!rows.length) {
    return <p className="muted">No hay historial disponible para este jugador.</p>;
  }

  return (
    <section className="player-history-section">
      <h3 className="subsection-title">Historial de jornadas</h3>

      <div className="player-history-table-wrap">
        <table className="player-history-table">
          <thead>
            <tr>
              <th>Jornada</th>
              <th>Resultado</th>
              <th>Posición</th>
              <th>Reenganche</th>
              <th>Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.jornada}>
                <td>J{row.jornada}</td>
                <td className={row.profit != null && row.profit > 0 ? "pos" : row.profit != null && row.profit < 0 ? "neg" : ""}>
                  {formatMoney(row.profit)}
                </td>
                <td>{row.rankPosition == null ? "—" : `#${row.rankPosition}`}</td>
                <td>{formatMoney(row.rebuy)}</td>
                <td className={row.cumulativeProfit > 0 ? "pos" : row.cumulativeProfit < 0 ? "neg" : ""}>
                  {row.cumulativeProfit.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}