import { useEffect, useState } from "react";
import { DEFAULT_SEASON_ID, SEASONS } from "../config/poker";
import { loadPokerData } from "../data/pokerData";
import type { SeasonRows, SummaryStats } from "../types/poker";

function createEmptySeasonRows(): SeasonRows {
  return SEASONS.reduce<SeasonRows>((acc, season) => {
    acc[season.id] = [];
    return acc;
  }, { [DEFAULT_SEASON_ID]: [] });
}

export function usePokerData() {
  const [rowsBySeason, setRowsBySeason] = useState<SeasonRows>(createEmptySeasonRows());
  const [summary, setSummary] = useState<SummaryStats>({ buyIn: null, pot: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await loadPokerData();

        if (cancelled) return;

        setRowsBySeason(data.rowsBySeason);
        setSummary(data.summary);
      } catch (err) {
        console.error("Error cargando datos de poker:", err);

        if (cancelled) return;
        setError("No se pudieron cargar los datos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    rowsBySeason,
    summary,
    loading,
    error,
  };
}