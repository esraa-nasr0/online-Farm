import { Link } from "react-router-dom";
import "./Sidebare.css";

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
      <nav>
        {/* Animal Management Section */}
        <div className="sidebar-section">
          <p className="section-title">ANIMAL MANAGEMENT</p>
          <ul className="sidebar-menu">
            <li>
              <Link to="/animalServices" className="menu-item">
                <span className="menu-icon">🐾</span>
                <span className="menu-text">Animals</span>
              </Link>
            </li>
            <li>
              <Link to="/animalCost" className="menu-item">
                <span className="menu-icon">💰</span>
                <span className="menu-text">Animal Cost</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Health & Breeding Section */}
        <div className="sidebar-section">
          <p className="section-title">HEALTH & BREEDING</p>
          <ul className="sidebar-menu">
            <li>
              <Link to="/matingServices" className="menu-item">
                <span className="menu-icon">❤️</span>
                <span className="menu-text">Mating</span>
              </Link>
            </li>
            <li>
              <Link to="/breedingServices" className="menu-item">
                <span className="menu-icon">🌿</span>
                <span className="menu-text">Breeding</span>
              </Link>
            </li>
            <li>
              <Link to="/vaccineServices" className="menu-item">
                <span className="menu-icon">💉</span>
                <span className="menu-text">Vaccine</span>
              </Link>
            </li>
            <li>
              <Link to="/treetmentServices" className="menu-item">
                <span className="menu-icon">💊</span>
                <span className="menu-text">Treatment</span>
              </Link>
            </li>
            <li>
              <Link to="/weightServices" className="menu-item">
                <span className="menu-icon">⚖️</span>
                <span className="menu-text">Weight</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Feeding & Reports Section */}
        <div className="sidebar-section">
          <p className="section-title">FEEDING & REPORTS</p>
          <ul className="sidebar-menu">
            <li>
              <Link to="/feedingServices" className="menu-item">
                <span className="menu-icon">🍽️</span>
                <span className="menu-text">Feeding</span>
              </Link>
            </li>
            <li>
              <Link to="/fodderServices" className="menu-item">
                <span className="menu-icon">🌾</span>
                <span className="menu-text">Fodder</span>
              </Link>
            </li>
            <li>
              <Link to="/report" className="menu-item">
                <span className="menu-icon">📊</span>
                <span className="menu-text">Reports</span>
              </Link>
            </li>
            <li>
              <Link to="/reportDaliy" className="menu-item">
                <span className="menu-icon">📆</span>
                <span className="menu-text">Daily Reports</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* System Section */}
        <div className="sidebar-section">
          <p className="section-title">SYSTEM</p>
          <ul className="sidebar-menu">
            <li>
              <Link to="/excludedServices" className="menu-item">
                <span className="menu-icon">🚫</span>
                <span className="menu-text">Excluded</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      </div>

      <div className="sidebar-footer">
        <div className="system-info">
          <span>FarmOS v2.4.1</span>
        </div>
        <div className="sidebar-tags">
          <span>Management</span>
          <span>Agriculture</span>
          <span>React</span>
        </div>
      </div>
    </aside>
  );
}