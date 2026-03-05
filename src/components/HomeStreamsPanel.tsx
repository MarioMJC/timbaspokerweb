import { Link } from "react-router-dom";
import type { HomeStreamsConfig } from "../config/homeStreams";

type Props = {
  streams: HomeStreamsConfig;
};

export default function HomeStreamsPanel({ streams }: Props) {
  const { upcoming, latest } = streams;

  return (
    <section className="home-block">
      <div className="home-streams-grid">
        <article className="home-stream-card">
          <div className="home-stream-top">
            <span className="home-stream-chip upcoming">PRÓXIMO DIRECTO</span>
            <span className="home-stream-platform">{upcoming.platformLabel}</span>
          </div>

          <h3 className="home-stream-title">{upcoming.title}</h3>

          <div className="home-stream-date-row">
            <span>{upcoming.dateLabel}</span>
            {upcoming.timeLabel && (
              <>
                <span className="home-stream-separator">•</span>
                <span>{upcoming.timeLabel}</span>
              </>
            )}
          </div>

          <div className="home-stream-targets">
            {upcoming.targets.map((target) => (
              <span key={target} className="home-stream-target">
                {target}
              </span>
            ))}
          </div>

          {upcoming.note && <p className="home-stream-note">{upcoming.note}</p>}

          <div className="home-stream-actions">
            <a
              href={upcoming.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-cta-btn primary"
            >
              IR A KICK
            </a>

            <Link to="/matchdays" className="home-cta-btn secondary">
              VER JORNADAS
            </Link>
          </div>
        </article>

        <article className="home-stream-card">
          <div className="home-stream-top">
            <span className="home-stream-chip latest">ÚLTIMO DIRECTO</span>
            <span className="home-stream-platform">{latest.platformLabel}</span>
          </div>

          <h3 className="home-stream-title">{latest.title}</h3>

          <div className="home-stream-date-row">
            <span>{latest.dateLabel}</span>
          </div>

          <div className="home-stream-targets">
            {latest.targets.map((target) => (
              <span key={target} className="home-stream-target">
                {target}
              </span>
            ))}
          </div>

          {latest.note && <p className="home-stream-note">{latest.note}</p>}

          <div className="home-stream-actions">
            <a
              href={latest.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-cta-btn primary"
            >
              VER EN KICK
            </a>

            {latest.seasonId && latest.jornada != null && (
              <Link
                to={`/matchdays/${latest.seasonId}/${latest.jornada}`}
                className="home-cta-btn secondary"
              >
                VER JORNADA
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}