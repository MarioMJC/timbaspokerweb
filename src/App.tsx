import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import "./App.css";

import { SEASONS } from "./config/poker";
import { usePokerData } from "./hooks/usePokerData";
import { computeAllStats } from "./utils/pokerStats";

import SiteHeader from "./components/SiteHeader";
import MainNav from "./components/MainNav";

import HomePage from "./pages/HomePage";
import PlayersPage from "./pages/PlayersPage";
import SeasonsPage from "./pages/SeasonsPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import MatchdaysPage from "./pages/MatchdaysPage";
import MatchdayDetailPage from "./pages/MatchdayDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import type { PlayerStats, SeasonId } from "./types/poker";

export default function App() {
  const { rowsBySeason, summary, loading, error } = usePokerData();

  const statsBySeason = useMemo(() => {
    return SEASONS.reduce<Record<SeasonId, PlayerStats[]>>((acc, season) => {
      acc[season.id] = computeAllStats(rowsBySeason[season.id] ?? []);
      return acc;
    }, {});
  }, [rowsBySeason]);

  return (
    <BrowserRouter>
      <div className="main-container">
        <SiteHeader buyIn={summary.buyIn} pot={summary.pot} />
        <MainNav />

        {loading && <p className="muted">Cargando datos...</p>}
        {error && <p className="muted">{error}</p>}

        {!loading && !error && (
          <Routes>
            <Route
              path="/"
              element={<HomePage rowsBySeason={rowsBySeason} statsBySeason={statsBySeason} />}
            />
            <Route
              path="/players"
              element={<PlayersPage statsBySeason={statsBySeason} />}
            />
            <Route
              path="/players/:playerId"
              element={
                <PlayerProfilePage
                  rowsBySeason={rowsBySeason}
                  statsBySeason={statsBySeason}
                />
              }
            />
            <Route
              path="/seasons"
              element={<SeasonsPage rowsBySeason={rowsBySeason} statsBySeason={statsBySeason} />}
            />
            <Route
              path="/matchdays"
              element={<MatchdaysPage rowsBySeason={rowsBySeason} />}
            />
            <Route
              path="/matchdays/:seasonId/:jornada"
              element={<MatchdayDetailPage rowsBySeason={rowsBySeason} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}