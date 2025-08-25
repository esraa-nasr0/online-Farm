// src/components/Sidebare/ModernSidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaBell, FaChartBar, FaHeart, FaPaw, FaSyringe,
  FaPills, FaWeight, FaSeedling, FaUtensils, FaBreadSlice, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { MdOutlineLanguage, MdOutlineLocalPharmacy } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GiGoat } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";
import { RiLuggageCartFill } from "react-icons/ri";
import "./modern-sidebar.css";

export default function ModernSidebar({
  isOpen,
  isMobile,
  isRTL = false,
  notificationCount = 0,
  onLogout,
  onChangeLanguage,
  isFattening = false,
  onToggle,
  hideRailWhenOpen = true,   // ⬅️ الجديد
}) {
  const { pathname } = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  const baseMenu = useMemo(() => ([
    {
      title: "MAIN MENU",
      items: [
        { name: "Home", icon: <IoHome />, path: "/" },
        { name: "Support", icon: <BiSupport />, path: "/support" },
        { name: "Notifications", icon: <FaBell />, path: "/notificationPage", badge: notificationCount },
      ],
    },
    {
      title: "Supplier",
      items: [
        {
          name: "Supplier",
          icon: <RiLuggageCartFill />,
          subItems: [
            { name: "Suppliers Data", path: "/supplierTable" },
            { name: "Add Suppliers", path: "/supplier" },
            { name: "Add Suppliers Treatment", path: "/linkSupplierTreatment" },
            { name: "Add Suppliers Feed", path: "/linkSupplierFeed" },
          ],
        },
      ],
    },
    {
      title: "Basic information",
      items: [
        {
          name: "Location Shed",
          icon: <FaLocationDot />,
          subItems: [
            { name: "Location Data", path: "/locationTable" },
            { name: "Add Location", path: "/locationPost" },
          ],
        },
        {
          name: "Breed",
          icon: <GiGoat />,
          subItems: [
            { name: "Breed Data", path: "/breedTable" },
            { name: "Add Breed", path: "/breedPost" },
          ],
        },
      ],
    },
    {
      title: "Animal Management",
      items: [
        {
          name: "animal",
          icon: <FaPaw />,
          subItems: [
            { name: "animals Data", path: "/animals" },
            { name: "add Animal", path: "/AnimalsDetails" },
            { name: "animal Cost", path: "/animalCost" },
          ],
        },
      ],
    },
    {
      title: "Health and Breeding",
      items: [
        {
          name: "mating",
          icon: <FaHeart />,
          subItems: [
            { name: "mating Data", path: "/matingTable" },
            { name: "add Mating", path: "/mating" },
            { name: "add By LocationShed", path: "/matingLocation" },
          ],
        },
        {
          name: "vaccine",
          icon: <FaSyringe />,
          subItems: [
            { name: "vaccine Data", path: "/vaccineTable" },
            { name: "vaccine Animal Data", path: "/Vaccinebyanimalsstable" },
            { name: "Add Vaccine", path: "/addVaccine" },
            { name: "Add By Animal", path: "/vaccinebytagid" },
            { name: "Add By Location", path: "/vaccinebylocationshed" },
          ],
        },
        {
          name: "Pharmacy",
          icon: <MdOutlineLocalPharmacy />,
          subItems: [
            { name: "Pharmacy Data", path: "/treatmentTable" },
            { name: "add Pharmacy", path: "/treatment" },
          ],
        },
        {
          name: "treatment",
          icon: <FaPills />,
          subItems: [
            { name: "treatment Data", path: "/treatmentTable" },
            { name: "add Treatment", path: "/treatment" },
            { name: "show By Animal", path: "/treatAnimalTable" },
            { name: "add By Animal", path: "/treatmentAnimal" },
            { name: "add By Location", path: "/treatmentLocation" },
          ],
        },
        {
          name: "weight",
          icon: <FaWeight />,
          subItems: [
            { name: "weight Data", path: "/weightTable" },
            { name: "add Weight", path: "/weight" },
            { name: "Animal Growth", path: "/withGrowthData" },
          ],
        },
        {
          name: "breeding",
          icon: <FaSeedling />,
          subItems: [
            { name: "breeding Data", path: "/breadingTable" },
            { name: "add Breeding", path: "/breeding" },
          ],
        },
      ],
    },
    {
      title: "Feeding and Reports",
      items: [
        {
          name: "feeding",
          icon: <FaUtensils />,
          subItems: [
            { name: "feeding Data", path: "/feedingTable" },
            { name: "add Feeding", path: "/feed" },
            { name: "data By Location", path: "/feedlocationtable" },
            { name: "add  Location", path: "/feedbylocation" },
          ],
        },
        {
          name: "fodder",
          icon: <FaBreadSlice />,
          subItems: [
            { name: "fodder Data", path: "/fodderTable" },
            { name: "add Fodder", path: "/fodder" },
          ],
        },
        { name: "reports", icon: <FaChartBar />, path: "/report" },
      ],
    },
    {
      title: "System",
      items: [
        {
          name: "excluded",
          icon: <FaExclamationTriangle />,
          subItems: [
            { name: "excluded Data", path: "/excludedtable" },
            { name: "add Excluded", path: "/excluded" },
          ],
        },
      ],
    },
  ].filter(Boolean)), [notificationCount, isFattening]);

  const toggleDropdown = (key) => setActiveDropdown((cur) => (cur === key ? null : key));
  useEffect(() => { if (!isOpen) setActiveDropdown(null); }, [isOpen]);

  const dir = isRTL ? "rtl" : "ltr";
  const getTitle = (item) => (typeof item === "string" ? item : item?.name || "");

  return (
    <aside
      className={`msb ${isOpen ? "open" : "closed"} ${dir} ${
        isOpen && hideRailWhenOpen ? "no-rail" : ""
      }`}
    >
      {/* RAIL: يظهر فقط لو السايدبار مقفول أو احنا مش عايزين نخبيه */}
      {!(isOpen && hideRailWhenOpen) && (
        <div className="msb-rail">
          <div className="msb-logo" aria-label="HALAL LAB" title="HALAL LAB" onClick={onToggle} style={{ cursor: "pointer" }}>
            <div className="bars"><span/><span/><span/></div>
          </div>

          <div className="msb-rail-items">
            <Link to="/" className="rail-btn" title="Home" data-tooltip="Home"><IoHome /></Link>
            <button className="rail-btn" onClick={() => setLangOpen((v) => !v)} title="Language" data-tooltip="Language">
              <MdOutlineLanguage />
            </button>
            <Link to="/notificationPage" className="rail-btn badge-parent" title="Notifications" data-tooltip="Notifications">
              <FaBell />{notificationCount > 0 && <span className="badge">{notificationCount}</span>}
            </Link>
          </div>

          <button className="rail-btn logout" onClick={onLogout} title="Logout" data-tooltip="Logout">
            <CiLogout />
          </button>
        </div>
      )}

      {/* PANEL */}
      <div className="msb-panel">
        <div className="panel-header">
          <div className="panel-left">
            {/* زر إغلاق/فتح داخل الهيدر */}
            <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
              {isRTL ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className="brand">
              <div className="mark" />
              <span>HALAL LAB</span>
            </div>
          </div>

          <div className="lang-switch">
            <button className={`chip ${langOpen ? "active" : ""}`} onClick={() => setLangOpen((v) => !v)}>
              <MdOutlineLanguage /><span>Language</span>{langOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {langOpen && (
              <div className="lang-menu">
                <button onClick={() => onChangeLanguage?.("en")}>English</button>
                <button onClick={() => onChangeLanguage?.("ar")}>العربية</button>
              </div>
            )}
          </div>
        </div>

        <nav className="panel-nav">
          {baseMenu.map((section, sIdx) => (
            <div className="nav-section" key={sIdx}>
              <p className="section-title">{section.title}</p>
              <ul className="section-list">
                {section.items.map((item, iIdx) => {
                  const hasChildren = !!item.subItems;
                  const active = pathname === item.path;
                  const k = `${section.title}-${item.name}`;
                  return (
                    <li className={`nav-item ${active ? "active" : ""}`} key={iIdx}>
                      {hasChildren ? (
                        <>
                          <button className="item-btn" onClick={() => toggleDropdown(k)} aria-expanded={activeDropdown === k} title={getTitle(item)}>
                            <span className="ico">{item.icon}</span>
                            <span className="txt">{item.name}</span>
                            <span className="chev">{activeDropdown === k ? <FaChevronUp /> : <FaChevronDown />}</span>
                          </button>
                          {activeDropdown === k && (
                            <ul className="submenu">
                              {item.subItems.map((sub, subIdx) => (
                                <li key={subIdx}>
                                  <Link to={sub.path} className={`sub-link ${pathname === sub.path ? "current" : ""}`}>
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link to={item.path} className="item-btn" title={getTitle(item)}>
                          <span className="ico">{item.icon}</span>
                          <span className="txt">{item.name}</span>
                          {item.badge ? <span className="pill">{item.badge}</span> : null}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <button className="logout-wide" onClick={onLogout}><CiLogout /><span>Logout</span></button>
      </div>
    </aside>
  );
}