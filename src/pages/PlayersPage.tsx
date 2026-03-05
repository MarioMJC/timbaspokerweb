import { useMemo, useState } from "react";
import { SEASONS, DEFAULT_SEASON_ID } from "../config/poker";
import PlayersGrid from "../components/PlayersGrid";
import type { PlayerStats, SeasonId } from "../types/poker";

type Props = {
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function PlayersPage({ statsBySeason }: Props) {
  const [seasonId, setSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const currentStats = useMemo(() => {
    return statsBySeason[seasonId] ?? [];
  }, [seasonId, statsBySeason]);

  return (
    <section className="page-section">
      <h2 className="page-title">JUGADORES</h2>
      <p className="page-subtitle">
        Consulta el ranking actual y abre el perfil de cada jugador.
      </p>

      <div className="charts-buttons">
        {SEASONS.map((season) => (
          <button
            key={season.id}
            className={`season-tab ${seasonId === season.id ? "active" : ""}`}
            onClick={() => setSeasonId(season.id)}
            type="button"
          >
            {season.label}
          </button>
        ))}
      </div>

      <PlayersGrid stats={currentStats} />
    </section>
  );
}