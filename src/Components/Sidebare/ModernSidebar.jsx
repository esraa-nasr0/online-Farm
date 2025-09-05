// src/components/Sidebare/ModernSidebar.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaBell, FaChartBar, FaHeart, FaPaw, FaSyringe,
  FaPills, FaWeight, FaSeedling, FaUtensils, FaBreadSlice, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdOutlineLanguage, MdOutlineLocalPharmacy } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GiGoat } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";
import { RiLuggageCartFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import "./modern-sidebar.css";

export default function ModernSidebar({
  isOpen,
  isRTL = false,
  notificationCount = 0,
  onLogout,
  onChangeLanguage,
  onToggle,
  hideRailWhenOpen = true,
}) {
  const { pathname } = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const { t } = useTranslation();

  const baseMenu = useMemo(() => ([
    {
      title: t("MAIN MENU"),
      items: [
        { name: t("Home"), icon: <IoHome />, path: "/" },
        { name: t("Notifications"), icon: <FaBell />, path: "/notificationPage", badge: notificationCount },
      ],
    },
    {
      title: t("Supplier"),
      items: [
        {
          name: t("Supplier"),
          icon: <RiLuggageCartFill />,
          subItems: [
            { name: t("Suppliers Data"), path: "/supplierTable" },
            { name: t("Add Suppliers"), path: "/supplier" },
          ],
        },
      ],
    },
    {
      title: t("Basic information"),
      items: [
        {
          name: t("Location Shed"),
          icon: <FaLocationDot />,
          subItems: [
            { name: t("Location Data"), path: "/locationTable" },
            { name: t("Add Location"), path: "/locationPost" },
          ],
        },
        {
          name: t("Breed"),
          icon: <GiGoat />,
          subItems: [
            { name: t("Breed Data"), path: "/breedTable" },
            { name: t("Add Breed"), path: "/breedPost" },
          ],
        },
      ],
    },
    {
      title: t("Animal Management"),
      items: [
        {
          name: t("animal"),
          icon: <FaPaw />,
          subItems: [
            { name: t("animals Data"), path: "/animals" },
            { name: t("add Animal"), path: "/AnimalsDetails" },
            { name: t("animal Cost"), path: "/animalCost" },
          ],
        },
      ],
    },
    {
      title: t("Health and Breeding"),
      items: [
        {
          name: t("mating"),
          icon: <FaHeart />,
          subItems: [
            { name: t("mating Data"), path: "/matingTable" },
            { name: t("add Mating"), path: "/mating" },
            { name: t("add By LocationShed"), path: "/matingLocation" },
          ],
        },
        {
          name: t("vaccine"),
          icon: <FaSyringe />,
          subItems: [
            { name: t("vaccine Data"), path: "/vaccineTable" },
            { name: t("vaccine Animal Data"), path: "/Vaccinebyanimalsstable" },
            { name: t("Add Vaccine"), path: "/addVaccine" },
            { name: t("Add By Animal"), path: "/vaccinebytagid" },
            { name: t("Add By Location"), path: "/vaccinebylocationshed" },
          ],
        },
        {
          name: t("Pharmacy"),
          icon: <MdOutlineLocalPharmacy />,
          subItems: [
            { name: t("Pharmacy Data"), path: "/treatmentTable" },
            { name: t("add Pharmacy"), path: "/treatment" },
          ],
        },
        {
          name: t("treatment"),
          icon: <FaPills />,
          subItems: [
            { name: t("show By Animal"), path: "/treatAnimalTable" },
            { name: t("add By Animal"), path: "/treatmentAnimal" },
            { name: t("add By Location"), path: "/treatmentLocation" },
          ],
        },
        {
          name: t("weight"),
          icon: <FaWeight />,
          subItems: [
            { name: t("weight Data"), path: "/weightTable" },
            { name: t("add Weight"), path: "/weight" },
            { name: t("Animal Growth"), path: "/withGrowthData" },
          ],
        },
        {
          name: t("breeding"),
          icon: <FaSeedling />,
          subItems: [
            { name: t("breeding Data"), path: "/breadingTable" },
            { name: t("add Breeding"), path: "/breeding" },
          ],
        },
      ],
    },
    {
      title: t("Feeding and Reports"),
      items: [
        {
          name: t("feeding"),
          icon: <FaUtensils />,
          subItems: [
            { name: t("feeding Data"), path: "/feedingTable" },
            { name: t("add Feeding"), path: "/feed" },
            { name: t("data By Location"), path: "/feedlocationtable" },
            { name: t("add  Location"), path: "/feedbylocation" },
          ],
        },
        {
          name: t("fodder"),
          icon: <FaBreadSlice />,
          subItems: [
            { name: t("fodder Data"), path: "/fodderTable" },
            { name: t("add Fodder"), path: "/fodder" },
          ],
        },
        { name: t("reports"), icon: <FaChartBar />, path: "/report" },
      ],
    },
    {
      title: t("System"),
      items: [
        {
          name: t("excluded"),
          icon: <FaExclamationTriangle />,
          subItems: [
            { name: t("excluded Data"), path: "/excludedtable" },
            { name: t("add Excluded"), path: "/excluded" },
          ],
        },
      ],
    },
  ]), [notificationCount, t]);

  const toggleDropdown = (key) =>
    setActiveDropdown((cur) => (cur === key ? null : key));

  const dir = isRTL ? "rtl" : "ltr";
  const getTitle = (item) =>
    (typeof item === "string" ? item : item?.name || "");

  return (
    <aside
      className={`msb ${isOpen ? "open" : "closed"} ${dir} ${
        isOpen && hideRailWhenOpen ? "no-rail" : ""
      }`}
    >
      {/* RAIL */}
      {!(isOpen && hideRailWhenOpen) && (
        <div className="msb-rail">
          <div
            className="msb-logo"
            onClick={onToggle}
            aria-label="HALAL LAB"
            title="HALAL LAB"
            style={{ cursor: "pointer" }}
          >
            <div className="bars"><span/><span/><span/></div>
          </div>

          <div className="msb-rail-items">
            <Link to="/" className="rail-btn" title={t("Home")} data-tooltip={t("Home")}><IoHome /></Link>
            <button className="rail-btn" onClick={() => setLangOpen((v) => !v)} title={t("Language")} data-tooltip={t("Language")}>
              <MdOutlineLanguage />
            </button>
            <Link to="/notificationPage" className="rail-btn badge-parent" title={t("Notifications")} data-tooltip={t("Notifications")}>
              <FaBell />{notificationCount > 0 && <span className="badge">{notificationCount}</span>}
            </Link>
          </div>

          <button className="rail-btn logout" onClick={onLogout} title={t("Logout")} data-tooltip={t("Logout")}>
            <CiLogout />
          </button>
        </div>
      )}

      {/* PANEL */}
      <div className="msb-panel">
        <div className="panel-header">
          <div className="panel-left">
            <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
              {isRTL ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className="brand">
              <div className="mark" />
              <span>ONLINE FARM</span>
            </div>
          </div>

          <div className="lang-switch">
            <button className={`chip ${langOpen ? "active" : ""}`} onClick={() => setLangOpen((v) => !v)}>
              <MdOutlineLanguage /><span>{t("Language")}</span>{langOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {langOpen && (
              <div className="lang-menu">
                <button onClick={() => onChangeLanguage?.("en")}>{t("English")}</button>
                <button onClick={() => onChangeLanguage?.("ar")}>{t("العربية")}</button>
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

        <button className="logout-wide" onClick={onLogout}><CiLogout /><span>{t("Logout")}</span></button>
      </div>
    </aside>
  );
}
