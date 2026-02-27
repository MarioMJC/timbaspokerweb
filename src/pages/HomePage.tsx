import { useState } from "react";
import { DEFAULT_SEASON_ID } from "../config/poker";
import PlayersGrid from "../components/PlayersGrid";
import PlayerModal from "../components/PlayerModal";
import SeasonChartsPanel from "../components/SeasonChartsPanel";
import type { PlayerId, PlayerStats, SeasonId, SeasonRows } from "../types/poker";

type Props = {
  rowsBySeason: SeasonRows;
  statsBySeason: Record<SeasonId, PlayerStats[]>;
};

export default function HomePage({ rowsBySeason, statsBySeason }: Props) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId | null>(null);
  const [chartSeasonId, setChartSeasonId] = useState<SeasonId>(DEFAULT_SEASON_ID);

  const currentSeasonStats = statsBySeason[chartSeasonId] ?? [];

  return (
    <>
      <PlayersGrid stats={currentSeasonStats} onSelectPlayer={setSelectedPlayerId} />

      <SeasonChartsPanel
        selectedSeasonId={chartSeasonId}
        onChangeSeason={setChartSeasonId}
        rowsBySeason={rowsBySeason}
        title="GRÁFICAS"
      />

      <PlayerModal
        open={selectedPlayerId !== null}
        onClose={() => setSelectedPlayerId(null)}
        playerId={selectedPlayerId}
        statsBySeason={statsBySeason}
      />
    </>
  );
}