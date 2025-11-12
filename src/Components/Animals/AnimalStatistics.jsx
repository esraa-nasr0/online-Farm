import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  FaMars, FaVenus} from 'react-icons/fa';
import { GiGoat, GiSheep } from 'react-icons/gi';
import { PiFarmLight } from "react-icons/pi";
import { useTranslation } from 'react-i18next';
import './AnimalStatistics.css';

const BASE_URL = "https://farm-project-bbzj.onrender.com";

function AnimalStatistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization?.startsWith("Bearer ") 
      ? Authorization 
      : `Bearer ${Authorization}`;
    return { 
      Authorization: formattedToken,
      "Content-Type": "application/json"
    };
  };

  const fetchAnimalStatistics = async () => {
    const headers = getHeaders();
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/animal/getAnimalStatistics`,
        { headers }
      );
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching animal statistics", error);
      setError(t("failed_to_load_stats"));
    }
  };
  
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAnimalStatistics();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return (
    <div className={`loading-wrap ${isRTL ? "rtl" : ""}`}>
      <div className="spinner" />
      <p>{t("loading")}</p>
    </div>
  );

  return (
    <div className={`animal-statistics ${isRTL ? "rtl" : ""}`}>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <PiFarmLight className="stat-icon" />
          <h4>{t("total_animals")}</h4>
          <p>{stats.totalAnimals}</p>
        </div>
        
        <div className="stat-card males">
          <FaMars className="stat-icon" />
          <h4>{t("males")}</h4>
          <p>{stats.byGender?.male || 0}</p>
        </div>
        
        <div className="stat-card females">
          <FaVenus className="stat-icon" />
          <h4>{t("females")}</h4>
          <p>{stats.byGender?.female || 0}</p>
        </div>
        
        <div className="stat-card goats">
          <GiGoat className="stat-icon" />
          <h4>{t("goats")}</h4>
          <p>
            {stats.byType?.goat?.total || 0}
            <span className="gender-breakdown">
              ♂ {stats.byType?.goat?.males || 0} | ♀ {stats.byType?.goat?.females || 0}
            </span>
          </p>
        </div>
        
        <div className="stat-card sheep">
          <GiSheep className="stat-icon" />
          <h4>{t("sheep")}</h4>
          <p>
            {stats.byType?.sheep?.total || 0}
            <span className="gender-breakdown">
              ♂ {stats.byType?.sheep?.males || 0} | ♀ {stats.byType?.sheep?.females || 0}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnimalStatistics;