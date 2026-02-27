import { Link } from "react-router-dom";
import type { MatchdayPlayerResult } from "../utils/matchdays";

type Props = {
  rows: MatchdayPlayerResult[];
};

function formatMoney(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(2)} €`;
}

export default function MatchdayResultsTable({ rows }: Props) {
  if (!rows.length) {
    return <p className="muted">No hay resultados para esta jornada.</p>;
  }

  return (
    <div className="player-history-table-wrap">
      <table className="player-history-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Posición</th>
            <th>Resultado</th>
            <th>Reenganche</th>
            <th>Acumulado</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.playerId}>
              <td>{row.playerLabel}</td>
              <td>{row.position == null ? "—" : `#${row.position}`}</td>
              <td className={row.profit != null && row.profit > 0 ? "pos" : row.profit != null && row.profit < 0 ? "neg" : ""}>
                {formatMoney(row.profit)}
              </td>
              <td>{formatMoney(row.rebuy)}</td>
              <td className={row.cumulativeProfit > 0 ? "pos" : row.cumulativeProfit < 0 ? "neg" : ""}>
                {row.cumulativeProfit.toFixed(2)} €
              </td>
              <td>
                <Link to={`/players/${row.playerId}`} className="inline-table-link">
                  Ver perfil
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}