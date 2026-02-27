import type { SeasonStatus } from "../types/poker";

export function getSeasonStatusLabel(status: SeasonStatus): string {
  if (status === "finished") return "FINALIZADA";
  if (status === "upcoming") return "PRÓXIMAMENTE";
  return "ACTIVA";
}

export function getSeasonStatusClass(status: SeasonStatus): string {
  if (status === "finished") return "finished";
  if (status === "upcoming") return "upcoming";
  return "active";
}