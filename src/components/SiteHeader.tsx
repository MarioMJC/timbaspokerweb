import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "../config/poker";

type Props = {
  buyIn: number | null;
  pot: number | null;
};

export default function SiteHeader({ buyIn, pot }: Props) {
  return (
    <>
      <div className="top-right-stats">
        <div className="top-stat">
          <div className="top-stat-label">BUY-IN TOTAL</div>
          <div className="top-stat-value">
            {buyIn == null ? "—" : `${buyIn.toFixed(2)} €`}
          </div>
        </div>

        <div className="top-stat">
          <div className="top-stat-label">BOTE ACUMULADO</div>
          <div className="top-stat-value">
            {pot == null ? "—" : `${pot.toFixed(2)} €`}
          </div>
        </div>
      </div>

      <div className="site-title-row">
        <Link to="/about" className="about-header-btn">
          ¿QUIÉNES SOMOS?
        </Link>

        <Link to="/" className="title-link">
          <h1 className="title">TIMBASPOKER</h1>
        </Link>

        <div className="site-title-row-spacer" />
      </div>

      <p className="title-submessage">
        TODOS LOS FIN DE SEMANAS DIRECTO EN{" "}
        <span className="title-submessage-kick">KICK</span>
      </p>

      <div className="social-links">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-btn ${social.variant}`}
          >
            <img src={social.logo} alt={social.label} />
            <span>{social.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}