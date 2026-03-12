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
    title: "PRÓXIMO DIRECTO: Pendiente de fecha y hora",
    targets: ["JORNADA 10 SPRING SEASON", "JORNADA 31 ANUAL"],
    note: "Todos los fines de semana directo en Kick.",
  },

  latest: {
    dateLabel: "5-03-2026",
    platformLabel: "KICK",
    href: "https://kick.com/timbaspoker",
    title: "ÚLTIMO DIRECTO EMITIDO",
    targets: ["JORNADA 8 SPRING SEASON", "JORNADA 29 ANUAL"],
    note: "Revive el último directo o entra al detalle de la jornada más reciente.",
    seasonId: "anual",
    jornada: 29,
  },
};