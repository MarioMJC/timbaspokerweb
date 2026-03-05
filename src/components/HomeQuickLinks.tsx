import { Link } from "react-router-dom";

export default function HomeQuickLinks() {
  return (
    <section className="home-block">
      <div className="home-quick-links">
        <Link to="/matchdays" className="home-quick-link">
          <span className="home-quick-link-label">JORNADAS</span>
          <strong>Ver histórico completo</strong>
        </Link>

        <Link to="/players" className="home-quick-link">
          <span className="home-quick-link-label">JUGADORES</span>
          <strong>Perfiles y estadísticas</strong>
        </Link>

        <Link to="/seasons" className="home-quick-link">
          <span className="home-quick-link-label">TEMPORADAS</span>
          <strong>Comparar annual, winter y spring</strong>
        </Link>
      </div>
    </section>
  );
}