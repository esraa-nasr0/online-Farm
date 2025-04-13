import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebare.css";

export default function Sidebar({ isOpen }) {
  const [animalDropdownOpen, setAnimalDropdownOpen] = useState(false);
  const [feedingDropdownOpen, setFeedingDropdownOpen] = useState(false);
  const [healthDropdownOpen, setHealthDropdownOpen] = useState(false);
  const [vaccineDropdownOpen, setVaccineDropdownOpen] = useState(false);
  const [treatmentDropdownOpen, setTreatmentDropdownOpen] = useState(false);
  const [weightDropdownOpen, setWeightDropdownOpen] = useState(false);
  const [breedingDropdownOpen, setBreedingDropdownOpen] = useState(false);
  const [fodderDropdownOpen, setFodderDropdownOpen] = useState(false);
  const [excludedDropdownOpen, setExcludedDropdownOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <nav>
          <div className="sidebar-section">
            <p className="section-title">ANIMAL MANAGEMENT</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setAnimalDropdownOpen(!animalDropdownOpen)}
                >
                  <span className="menu-icon">🐾</span>
                  <span className="menu-text">Animal</span>
                  <span>{animalDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {animalDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/animals" className="dropdown-item-custom"> Animals Data</Link></li>
                    <li><Link to="/AnimalsDetails" className="dropdown-item-custom">Add Animal</Link></li>
                    <li><Link to="/animalCost" className="dropdown-item-custom">Animal Cost</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <p className="section-title">HEALTH & BREEDING</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setHealthDropdownOpen(!healthDropdownOpen)}
                >
                  <span className="menu-icon">❤️</span>
                  <span className="menu-text">Mating</span>
                  <span>{healthDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {healthDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/matingTable" className="dropdown-item-custom">Mating Data</Link></li>
                    <li><Link to="/mating" className="dropdown-item-custom">Add Mating</Link></li>
                    <li><Link to="/matingLocation" className="dropdown-item-custom">Add by Location Shed</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setVaccineDropdownOpen(!vaccineDropdownOpen)}
                >
                  <span className="menu-icon">💉</span>
                  <span className="menu-text">Vaccine</span>
                  <span>{vaccineDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {vaccineDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/vaccineTable" className="dropdown-item-custom">Vaccine Data</Link></li>
                    <li><Link to="/vaccinebyanimal" className="dropdown-item-custom">Add by Animal</Link></li>
                    <li><Link to="/vaccinebylocationshed" className="dropdown-item-custom">Add by Location Shed</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setTreatmentDropdownOpen(!treatmentDropdownOpen)}
                >
                  <span className="menu-icon">💊</span>
                  <span className="menu-text">Treatment</span>
                  <span>{treatmentDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {treatmentDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/treatmentTable" className="dropdown-item-custom">Treatment Data</Link></li>
                    <li><Link to="/treatment" className="dropdown-item-custom">Add by Treatment</Link></li>
                    <li><Link to="/treatAnimalTable" className="dropdown-item-custom">Show by Animal</Link></li>
                    <li><Link to="/treatmentAnimal" className="dropdown-item-custom">Add by Animal</Link></li>
                    <li><Link to="/treatmentLocation" className="dropdown-item-custom">Add by Location Shed</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setWeightDropdownOpen(!weightDropdownOpen)}
                >
                  <span className="menu-icon">⚖️</span>
                  <span className="menu-text">Weight</span>
                  <span>{weightDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {weightDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/weightTable" className="dropdown-item-custom">Weight Data</Link></li>
                    <li><Link to="/weight" className="dropdown-item-custom">Add Weight</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setBreedingDropdownOpen(!breedingDropdownOpen)}
                >
                  <span className="menu-icon">🌿</span>
                  <span className="menu-text">Breeding</span>
                  <span>{breedingDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {breedingDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/breadingTable" className="dropdown-item-custom">Breeding Data</Link></li>
                    <li><Link to="/breeding" className="dropdown-item-custom">Add Breeding</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <p className="section-title">FEEDING & REPORTS</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setFeedingDropdownOpen(!feedingDropdownOpen)}
                >
                  <span className="menu-icon">🍽️</span>
                  <span className="menu-text">Feeding</span>
                  <span style={{ marginLeft: "auto" }}>
                    {feedingDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {feedingDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/feedingTable" className="dropdown-item-custom">Feeding Data</Link></li>
                    <li><Link to="/feed" className="dropdown-item-custom">Add Feeding</Link></li>
                    <li><Link to="/feedlocationtable" className="dropdown-item-custom"> Data by Locatin </Link></li>
                    <li><Link to="/feedbylocation" className="dropdown-item-custom">Add by Location</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setFodderDropdownOpen(!fodderDropdownOpen)}
                >
                  <span className="menu-icon">🌾</span>
                  <span className="menu-text">Fodder</span>
                  <span style={{ marginLeft: "auto" }}>
                    {fodderDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {fodderDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/fodderTable" className="dropdown-item-custom">Fodder Data</Link></li>
                    <li><Link to="/fodder" className="dropdown-item-custom">Add Fodder</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <Link to="/report" className="menu-item">📊 <span className="menu-text">Reports</span></Link>
              </li>
              <li>
                <Link to="/reportDaliy" className="menu-item">🗓️ <span className="menu-text">Daily Reports</span></Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <p className="section-title">SYSTEM</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setExcludedDropdownOpen(!excludedDropdownOpen)}
                >
                  <span className="menu-icon">🚷</span>
                  <span className="menu-text">Excluded</span>
                  <span style={{ marginLeft: "auto" }}>
                    {excludedDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {excludedDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/excludedtable" className="dropdown-item-custom">Excluded Data</Link></li>
                    <li><Link to="/excluded" className="dropdown-item-custom">Add Excluded</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="system-info">FarmOS v2.4.1</div>
        <div className="sidebar-tags">
          <span>Management</span>
          <span>Agriculture</span>
          <span>React</span>
        </div>
      </div>
    </aside>
  );
}
