export type StreamCardConfig = {
  dateLabel: string;
  timeLabel?: string;
  platformLabel: string;
  href: string;
  title: string;
  targets: string[];
  note?: string;
  seasonId?: string;
  jornada?: number;
};

export type HomeStreamsConfig = {
  upcoming: StreamCardConfig;
  latest: StreamCardConfig;
};

export const HOME_STREAMS: HomeStreamsConfig = {
  upcoming: {
    dateLabel: "",
    timeLabel: "",
    platformLabel: "KICK",
    href: "https://kick.com/timbaspoker",
    title: "PRÓXIMO DIRECTO: PENDIENTE",
    targets: ["JORNADA 11 SPRING SEASON", "JORNADA 32 ANUAL"],
    note: "Todos los fines de semana directo en Kick.",
  },

  latest: {
    dateLabel: "15-03-2026",
    platformLabel: "KICK",
    href: "https://kick.com/timbaspoker",
    title: "ÚLTIMO DIRECTO EMITIDO",
    targets: ["JORNADA 10 SPRING SEASON", "JORNADA 31 ANUAL"],
    note: "Revive el último directo o entra al detalle de la jornada más reciente.",
    seasonId: "anual",
    jornada: 29,
  },
};