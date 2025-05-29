import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebare.css";

export default function Sidebar({ isOpen }) {
  const { t } = useTranslation();

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
          {/* Animal Management Section */}
          <div className="sidebar-section">
            <p className="section-title">{t("animalManagement")}</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setAnimalDropdownOpen(!animalDropdownOpen)}
                >
                  <span className="menu-icon">🐾</span>
                  <span className="menu-text">{t("animal")}</span>
                  <span>{animalDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {animalDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/animals" className="dropdown-item-custom">{t("animalsData")}</Link></li>
                    <li><Link to="/AnimalsDetails" className="dropdown-item-custom">{t("addAnimal")}</Link></li>
                    <li><Link to="/animalCost" className="dropdown-item-custom">{t("animalCost")}</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Health and Breeding Section */}
          <div className="sidebar-section">
            <p className="section-title">{t("healthAndBreeding")}</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setHealthDropdownOpen(!healthDropdownOpen)}
                >
                  <span className="menu-icon">❤️</span>
                  <span className="menu-text">{t("mating")}</span>
                  <span>{healthDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {healthDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/matingTable" className="dropdown-item-custom">{t("matingData")}</Link></li>
                    <li><Link to="/mating" className="dropdown-item-custom">{t("addMating")}</Link></li>
                    <li><Link to="/matingLocation" className="dropdown-item-custom">{t("addByLocationShed")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setVaccineDropdownOpen(!vaccineDropdownOpen)}
                >
                  <span className="menu-icon">💉</span>
                  <span className="menu-text">{t("vaccine")}</span>
                  <span>{vaccineDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {vaccineDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/vaccineTable" className="dropdown-item-custom">{t("vaccineData")}</Link></li>
                    <li><Link to="/vaccinebyanimal" className="dropdown-item-custom">{t("addByAnimal")}</Link></li>
                    <li><Link to="/vaccinebylocationshed" className="dropdown-item-custom">{t("addVaccineByLocation")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setTreatmentDropdownOpen(!treatmentDropdownOpen)}
                >
                  <span className="menu-icon">💊</span>
                  <span className="menu-text">{t("treatment")}</span>
                  <span>{treatmentDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {treatmentDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/treatmentTable" className="dropdown-item-custom">{t("treatmentData")}</Link></li>
                    <li><Link to="/treatment" className="dropdown-item-custom">{t("addTreatment")}</Link></li>
                    <li><Link to="/treatAnimalTable" className="dropdown-item-custom">{t("showByAnimal")}</Link></li>
                    <li><Link to="/treatmentAnimal" className="dropdown-item-custom">{t("addTreatmentByAnimal")}</Link></li>
                    <li><Link to="/treatmentLocation" className="dropdown-item-custom">{t("addTreatmentByLocation")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setWeightDropdownOpen(!weightDropdownOpen)}
                >
                  <span className="menu-icon">⚖️</span>
                  <span className="menu-text">{t("weight")}</span>
                  <span>{weightDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {weightDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/weightTable" className="dropdown-item-custom">{t("weightData")}</Link></li>
                    <li><Link to="/weight" className="dropdown-item-custom">{t("addWeight")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setBreedingDropdownOpen(!breedingDropdownOpen)}
                >
                  <span className="menu-icon">🌿</span>
                  <span className="menu-text">{t("breeding")}</span>
                  <span>{breedingDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {breedingDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/breadingTable" className="dropdown-item-custom">{t("breedingData")}</Link></li>
                    <li><Link to="/breeding" className="dropdown-item-custom">{t("addBreeding")}</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Feeding and Reports Section */}
          <div className="sidebar-section">
            <p className="section-title">{t("feedingAndReports")}</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setFeedingDropdownOpen(!feedingDropdownOpen)}
                >
                  <span className="menu-icon">🍽️</span>
                  <span className="menu-text">{t("feeding")}</span>
                  <span style={{ marginLeft: "auto" }}>
                    {feedingDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {feedingDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/feedingTable" className="dropdown-item-custom">{t("feedingData")}</Link></li>
                    <li><Link to="/feed" className="dropdown-item-custom">{t("addFeeding")}</Link></li>
                    <li><Link to="/feedlocationtable" className="dropdown-item-custom">{t("dataByLocation")}</Link></li>
                    <li><Link to="/feedbylocation" className="dropdown-item-custom">{t("addFeedingByLocation")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setFodderDropdownOpen(!fodderDropdownOpen)}
                >
                  <span className="menu-icon">🌾</span>
                  <span className="menu-text">{t("fodder")}</span>
                  <span style={{ marginLeft: "auto" }}>
                    {fodderDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {fodderDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/fodderTable" className="dropdown-item-custom">{t("fodderData")}</Link></li>
                    <li><Link to="/fodder" className="dropdown-item-custom">{t("addFodder")}</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <Link to="/report" className="menu-item">📊 <span className="menu-text">{t("reports")}</span></Link>
              </li>
              <li>
                <Link to="/reportDaliy" className="menu-item">🗓️ <span className="menu-text">{t("dailyReports")}</span></Link>
              </li>
            </ul>
          </div>

          {/* System Section */}
          <div className="sidebar-section">
            <p className="section-title">{t("system")}</p>
            <ul className="sidebar-menu">
              <li>
                <div
                  className="menu-item dropdown-toggle"
                  onClick={() => setExcludedDropdownOpen(!excludedDropdownOpen)}
                >
                  <span className="menu-icon">🚷</span>
                  <span className="menu-text">{t("excluded")}</span>
                  <span style={{ marginLeft: "auto" }}>
                    {excludedDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {excludedDropdownOpen && (
                  <ul className="dropdown-menu-custom">
                    <li><Link to="/excludedtable" className="dropdown-item-custom">{t("excludedData")}</Link></li>
                    <li><Link to="/excluded" className="dropdown-item-custom">{t("addExcluded")}</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
