import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { buildAnnualTimeline } from "../utils/annualTimeline";
import { PLAYER_KEYS, PLAYER_META } from "../config/poker";
import type { CsvRow } from "../types/poker";

type Props = {
  csvRows: CsvRow[];
};

const formatJornada = (label: unknown) => {
  const n = typeof label === "number" ? label : Number(label);
  if (!Number.isFinite(n)) return String(label ?? "");
  return `Jornada ${n}`;
};

const formatJornadaTick = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  return `J${n}`;
};

const formatEuro = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return String(v ?? "—");
  return `${n.toFixed(0)} €`;
};

const formatRank = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return String(v ?? "—");
  return `#${n}`;
};

function getNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function ProfitTooltip({
  active,
  label,
  payload,
  data,
}: {
  active?: boolean;
  label?: unknown;
  payload?: any[];
  data: Record<string, number | null>[];
}) {
  if (!active || !payload?.length) return null;

  const jornada = getNumber(label);
  const row = data.find((r) => Number(r.jornada) === jornada) ?? null;

  const items = PLAYER_KEYS.map((player) => {
    const point = payload.find((x) => x.dataKey === `${player}€`);
    const euro = point ? getNumber(point.value) : null;
    const rank = row ? getNumber(row[`${player}Rank`]) : null;

    return {
      name: player,
      color: PLAYER_META[player].color,
      euro,
      rank,
    };
  }).filter((item) => item.euro !== null || item.rank !== null);

  items.sort((a, b) => {
    const ra = a.rank ?? 999;
    const rb = b.rank ?? 999;

    if (ra !== rb) return ra - rb;
    return (b.euro ?? -1e9) - (a.euro ?? -1e9);
  });

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
        {formatJornada(label)}
      </div>

      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 6,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: item.color, fontWeight: 800 }}>{item.name}</span>
            <span style={{ opacity: 0.9 }}>
              {item.rank == null ? "—" : formatRank(item.rank)}
            </span>
          </div>

          <div style={{ fontWeight: 800 }}>
            {item.euro == null ? "—" : formatEuro(item.euro)}
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: unknown;
  payload?: any[];
}) {
  if (!active || !payload?.length) return null;

  const items = payload
    .map((p) => {
      const player = String(p.name);
      const color =
        player in PLAYER_META
          ? PLAYER_META[player as keyof typeof PLAYER_META].color
          : "#fff";

      return {
        name: player,
        color,
        rank: getNumber(p.value),
      };
    })
    .filter((item) => item.rank !== null);

  items.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

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
        {formatJornada(label)}
      </div>

      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 6,
            alignItems: "center",
          }}
        >
          <span style={{ color: item.color, fontWeight: 800 }}>{item.name}</span>
          <span style={{ fontWeight: 800 }}>{formatRank(item.rank)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnnualCharts({ csvRows }: Props) {
  const data = useMemo(() => buildAnnualTimeline(csvRows), [csvRows]);

  if (!data.length) {
    return <p className="muted">No hay datos para graficar.</p>;
  }

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3 className="chart-title">Evolución de ganancias acumuladas (€)</h3>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jornada" tickFormatter={formatJornadaTick} />
              <YAxis tickFormatter={(v) => `${v}€`} />
              <Tooltip content={<ProfitTooltip data={data} />} />
              <Legend />

              {PLAYER_KEYS.map((player) => (
                <Line
                  key={`${player}-profit`}
                  type="monotone"
                  dataKey={`${player}€`}
                  name={player}
                  stroke={PLAYER_META[player].color}
                  strokeWidth={3}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Evolución del ranking global</h3>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jornada" tickFormatter={formatJornadaTick} />
              <YAxis reversed domain={[4, 1]} allowDecimals={false} />
              <Tooltip content={<RankingTooltip />} />
              <Legend />

              {PLAYER_KEYS.map((player) => (
                <Line
                  key={`${player}-rank`}
                  type="monotone"
                  dataKey={`${player}Rank`}
                  name={player}
                  stroke={PLAYER_META[player].color}
                  strokeWidth={3}
                  dot={{ r: 5, fill: PLAYER_META[player].color }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}