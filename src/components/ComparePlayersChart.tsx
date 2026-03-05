import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PLAYER_BY_ID } from "../config/poker";
import type { PlayerId } from "../types/poker";
import type { CompareChartPoint } from "../utils/playerCompare";

type Props = {
  data: CompareChartPoint[];
  playerAId: PlayerId;
  playerBId: PlayerId;
};

const formatJornadaTick = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  return `J${n}`;
};

const formatEuro = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(0)} €`;
};

function CompareTooltip({
  active,
  payload,
  label,
  playerAId,
  playerBId,
}: {
  active?: boolean;
  payload?: any[];
  label?: unknown;
  playerAId: PlayerId;
  playerBId: PlayerId;
}) {
  if (!active || !payload?.length) return null;

  const playerA = PLAYER_BY_ID[playerAId];
  const playerB = PLAYER_BY_ID[playerBId];

  const itemA = payload.find((p) => p.dataKey === "playerACumulative");
  const itemB = payload.find((p) => p.dataKey === "playerBCumulative");

  return (
    <div
      style={{
        backgroundColor: "#0b0b0b",
        border: "1px solid rgba(255, 26, 26, 0.6)",
        borderRadius: "12px",
        color: "#ffffff",
        padding: "10px 12px",
      }}
    >
      <div style={{ color: "#ff4d4d", fontWeight: 700, marginBottom: 8 }}>
        Jornada {String(label ?? "")}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
          <span style={{ color: playerA?.color ?? "#fff", fontWeight: 800 }}>{playerA?.label}</span>
          <span style={{ fontWeight: 800 }}>{formatEuro(itemA?.value)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
          <span style={{ color: playerB?.color ?? "#fff", fontWeight: 800 }}>{playerB?.label}</span>
          <span style={{ fontWeight: 800 }}>{formatEuro(itemB?.value)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ComparePlayersChart({ data, playerAId, playerBId }: Props) {
  const playerA = PLAYER_BY_ID[playerAId];
  const playerB = PLAYER_BY_ID[playerBId];

  if (!data.length) {
    return <p className="muted">No hay datos suficientes para comparar a estos jugadores.</p>;
  }

  return (
    <div className="chart-card compare-chart-card">
      <h3 className="chart-title">Evolución acumulada del duelo</h3>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jornada" tickFormatter={formatJornadaTick} />
            <YAxis tickFormatter={(v) => `${v}€`} />
            <Tooltip content={<CompareTooltip playerAId={playerAId} playerBId={playerBId} />} />
            <Legend />

            <Line
              type="monotone"
              dataKey="playerACumulative"
              name={playerA?.label ?? playerAId}
              stroke={playerA?.color ?? "#fff"}
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="playerBCumulative"
              name={playerB?.label ?? playerBId}
              stroke={playerB?.color ?? "#fff"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}