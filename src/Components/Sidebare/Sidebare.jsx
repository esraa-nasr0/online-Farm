import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebare.css"; // تأكد من استيراد ملف CSS

export default function Sidebare({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav className="mt-2">
        <ul className="sidebar-menu">
          <li>
            <Link to="/animals">🐾 Animals</Link>
          </li>
          <li>
            <Link to="/matingTable">❤️ Mating</Link>
          </li>
          <li>
            <Link to="/weightTable">⚖️ Weight</Link>
          </li>
          <li>
            <Link to="/breadingTable">🌿 Breeding</Link>
          </li>
          <li>
            <Link to="/vaccineTable">💉 Vaccine</Link>
          </li>
          <li>
            <Link to="/report">📊 Report</Link>
          </li>
          <li>
            <Link to="/reportDaliy">📆 Daily Report</Link>
          </li>
          <li>
            <Link to="/exclutedtable">🚫 Excluded</Link>
          </li>
          <li>
            <Link to="/treatmentTable">💊 Treatment</Link>
          </li>
          <li>
            <Link to="/animalCost">💰 Animal Cost</Link>
          </li>
          <li>
            <Link to="/feedingTable">🍽️ Feeding</Link>
          </li>
          <li>
            <Link to="/fodderTable">🌾 Fodder</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
