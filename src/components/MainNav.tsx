import { NavLink } from "react-router-dom";

export default function MainNav() {
  return (
    <nav className="main-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`}
      >
        INICIO
      </NavLink>

      <NavLink
        to="/players"
        className={({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`}
      >
        JUGADORES
      </NavLink>

      <NavLink
        to="/compare"
        className={({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`}
      >
        COMPARAR
      </NavLink>

      <NavLink
        to="/seasons"
        className={({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`}
      >
        TEMPORADAS
      </NavLink>

      <NavLink
        to="/matchdays"
        className={({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`}
      >
        JORNADAS
      </NavLink>
    </nav>
  );
}