import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="page-section about-page">
      <div className="about-hero">
        <p className="about-kicker">TIMBASPOKER</p>
        <h2 className="page-title">¿QUIÉNES SOMOS?</h2>
        <p className="page-subtitle">
          Poker, amistad, competición y contenido real cada fin de semana.
        </p>
      </div>

      <div className="about-card">
        <p>
          Somos <strong>4 amigos apasionados por el poker</strong> que jugamos
          partidas privadas entre nosotros y vivimos cada jornada con
          competitividad, pique sano y muchas ganas de mejorar.
        </p>

        <p>
          Lo que empezó como una simple timba entre amigos se ha convertido en un
          proyecto que compartimos también en internet a través de{" "}
          <strong>Kick, TikTok, Instagram y YouTube</strong>.
        </p>

        <p>
          En <strong>TimbasPoker</strong> documentamos nuestras temporadas,
          rankings, perfiles de jugador, jornadas y evolución para que cualquiera
          pueda seguir la liga, ver cómo cambia la clasificación y disfrutar del
          contenido que subimos en redes.
        </p>

        <p>
          Nuestro objetivo es seguir creciendo, crear una comunidad alrededor de
          la competición amateur y convertir cada partida en una experiencia que
          mezcle <strong>poker, entretenimiento y narrativa</strong>.
        </p>

        <p>
          Si te gusta el poker y quieres seguir una liga real con estadísticas,
          directos y contenido constante, esta es tu casa.
        </p>
      </div>

      <div className="about-actions">
        <Link to="/" className="back-home-btn">
          VOLVER AL INICIO
        </Link>
      </div>
    </section>
  );
}