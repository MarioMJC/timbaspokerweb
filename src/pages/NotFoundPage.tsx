import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-section not-found">
      <h2 className="page-title">PÁGINA NO ENCONTRADA</h2>
      <p className="page-subtitle">La ruta que has abierto no existe dentro de TimbasPoker.</p>

      <Link to="/" className="back-home-btn">
        VOLVER AL INICIO
      </Link>
    </section>
  );
}