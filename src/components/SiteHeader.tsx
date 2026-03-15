import { useState } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "../config/poker";

type Props = {
  buyIn: number | null;
  pot: number | null;
};

export default function SiteHeader({ buyIn, pot }: Props) {
  const [showSupportModal, setShowSupportModal] = useState(false);

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
        <div className="top-left-actions">
          <Link to="/about" className="about-header-btn">
            ¿QUIÉNES SOMOS?
          </Link>

          <button
            type="button"
            className="support-header-btn"
            onClick={() => setShowSupportModal(true)}
          >
            ¿QUIERES APOYAR?
          </button>
        </div>

        <Link to="/" className="title-link">
          <h1 className="title">TIMBASPOKER</h1>
        </Link>

        <div className="site-title-row-spacer" />
      </div>

      <div className="last-stream-banner">
        <span>PRÓXIMO DIRECTO</span>
        <span>/</span>
        <span>HOY 15-03-2026 A LAS 21:00 HORA ESPAÑOLA</span>
        <span>/</span>
        <span>EN KICK</span>
        <span>/</span>
        <span>JORNADA 10 SPRING SEASON</span>
        <span>/</span>
        <span>JORNADA 31 ANUAL</span>
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

      {showSupportModal && (
        <div
          className="support-modal-overlay"
          onClick={() => setShowSupportModal(false)}
        >
          <div
            className="support-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="support-modal-close"
              onClick={() => setShowSupportModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h2>¿QUIERES APOYAR?</h2>

            <p>
              Somos un grupo de 4 chavales con pasión por el póker que estamos
              construyendo TIMBASPOKER desde cero, con mucha ilusión y ganas de
              hacer crecer este proyecto.
            </p>

            <p>
              Estamos en nuestros inicios y cualquier ayuda nos viene genial
              para seguir mejorando los directos, la web, los overlays, el
              contenido y la calidad de cada jornada.
            </p>

            <p>
              Si te gusta lo que hacemos y quieres aportar tu granito de arena,
              te lo agradeceremos muchísimo. ❤️
            </p>

            <a
              href="https://paypal.me/TIMBASPOKER"
              target="_blank"
              rel="noopener noreferrer"
              className="support-modal-paypal-btn"
            >
              APOYAR
            </a>
          </div>
        </div>
      )}
    </>
  );
}