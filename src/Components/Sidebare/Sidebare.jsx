import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaPaw,
  FaHeart,
  FaSyringe,
  FaPills,
  FaWeight,
  FaSeedling,
  FaUtensils,
  FaBreadSlice,
  FaChartBar,
  FaCalendarAlt,
  FaUserSlash,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";

import "./Sidebare.css";

export default function Sidebar({ isOpen, isMobile, isRTL, notificationCount = 0 }) {
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const menuItems = [
     {
      title: "Notifications",
      items: [
        {
          name: "Notifications",
          icon: <FaBell />,
          path: "/notificationPage",
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
            { name: "animalsData", path: "/animals" },
            { name: "addAnimal", path: "/AnimalsDetails" },
            { name: "animalCost", path: "/animalCost" },
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
            { name: "matingData", path: "/matingTable" },
            { name: "addMating", path: "/mating" },
            { name: "addByLocationShed", path: "/matingLocation" },
          ],
        },
        {
          name: "vaccine",
          icon: <FaSyringe />,
          subItems: [
            { name: "vaccineData", path: "/vaccineTable" },
            { name: "addByAnimal", path: "/vaccinebytagid" },
            { name: "addVaccineByLocation", path: "/vaccinebylocationshed" },
          ],
        },
        {
          name: "treatment",
          icon: <FaPills />,
          subItems: [
            { name: "treatmentData", path: "/treatmentTable" },
            { name: "addTreatment", path: "/treatment" },
            { name: "showByAnimal", path: "/treatAnimalTable" },
            { name: "addTreatmentByAnimal", path: "/treatmentAnimal" },
            { name: "addTreatmentByLocation", path: "/treatmentLocation" },
          ],
        },
        {
          name: "weight",
          icon: <FaWeight />,
          subItems: [
            { name: "weightData", path: "/weightTable" },
            { name: "addWeight", path: "/weight" },
          ],
        },
        {
          name: "breeding",
          icon: <FaSeedling />,
          subItems: [
            { name: "breedingData", path: "/breadingTable" },
            { name: "addBreeding", path: "/breeding" },
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
            { name: "feedingData", path: "/feedingTable" },
            { name: "addFeeding", path: "/feed" },
            { name: "dataByLocation", path: "/feedlocationtable" },
            { name: "addFeedingByLocation", path: "/feedbylocation" },
          ],
        },
        {
          name: "fodder",
          icon: <FaBreadSlice />,
          subItems: [
            { name: "fodderData", path: "/fodderTable" },
            { name: "addFodder", path: "/fodder" },
          ],
        },
        { name: "reports", icon: <FaChartBar />, path: "/report" },
        { name: "dailyReports", icon: <FaCalendarAlt />, path: "/reportDaliy" },
      ],
    },
    {
      title: "System",
      items: [
        {
          name: "excluded",
          icon: <FaUserSlash />,
          subItems: [
            { name: "excludedData", path: "/excludedtable" },
            { name: "addExcluded", path: "/excluded" },
          ],
        },
      ],
    },
   
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"} ${isRTL ? "rtl" : "ltr"}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h3>ONLINE FARM</h3>
        </div>

        <nav>
          {menuItems.map((section, sectionIndex) => (
            <div className="sidebar-section" key={sectionIndex}>
              <p className="section-title">{t(section.title)}</p>
              <ul className="sidebar-menu">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.subItems ? (
                      <>
                        <div
                          className="menu-item dropdown-toggle"
                          onClick={() => toggleDropdown(item.name)}
                        >
                          <span className="menu-icon">{item.icon}</span>
                          <span className="menu-text">{t(item.name)}</span>
                          <span className="dropdown-arrow">
                            {activeDropdown === item.name ? <FaChevronUp /> : <FaChevronDown />}
                          </span>
                        </div>
                        {activeDropdown === item.name && (
                          <ul className="dropdown-menu-custom">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link to={subItem.path} className="dropdown-item-custom">
                                  {t(subItem.name)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link to={item.path} className="menu-item">
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-text">{t(item.name)}</span>
                        {item.name === "Notifications" && notificationCount > 0 && (
                          <span className="notif-badge">{notificationCount}</span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
