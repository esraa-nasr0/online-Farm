import React, { useContext, useEffect, useState } from "react";
import "./AdminDashboard.css";
import { AdminContext } from "../../Context/AdminContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { GiSheep } from "react-icons/gi";
import { FaCheckCircle, FaUsers } from "react-icons/fa";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { getAdminDashboard } = useContext(AdminContext);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchdata() {
      let res = await getAdminDashboard();
      setStats(res?.data);
    }
    fetchdata();
  }, [getAdminDashboard]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  if (!stats) return <p className="loading">Loading...</p>;

  const leaders = stats.leaders || [];
  const system = stats.system || {};
  const trends = (stats.trends?.animalsPerMonth || []).map((t) => ({
    year: t._id.y,
    month: t._id.m,
    count: t.count,
  }));

  return (
    <div className="admin-dashboard" style={{ marginTop: "40px" }}>
      <div className="dashboard-header">
        <h2 className="admin-dashboard-title fw-bold">{t("adminDashboard")}</h2>
    
      </div>

      <div className="dashboard-button-wrapper">
        <button
          className="dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          {t("goToManageUsers")}
        </button>
      </div>

      <div className="cards-row">
        <div className="stat-card card-blue">
          <div className="card-header">
            <h3>{t("totalAnimals")}</h3>
            <GiSheep className="card-icon" />
          </div>
          <div className="stat-number">{system.animals ?? "-"}</div>
        </div>

        <div className="stat-card card-green">
          <div className="card-header">
            <h3>{t("totalUsers")}</h3>
            <FaCheckCircle className="card-icon" />
          </div>
          <div className="stat-number">{system.users ?? "-"}</div>
        </div>

        <div className="stat-card card-orange">
          <div className="card-header">
            <h3>{t("topOwners")}</h3>
            <FaUsers className="card-icon" />
          </div>
          <div className="stat-number">{leaders.length}</div>
          <div className="stat-details">
            <span>{t("active")}: {leaders[0]?.activeAnimals ?? 0}</span>
            <span>{t("total")}: {leaders[0]?.totalAnimals ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="stat-card admin-leaders-card">
        <div className="card-header">
          <h3>{t("topOwners")}</h3>
          <FaUsers className="card-icon" />
        </div>
        <div className="admin-leaders-list">
          {leaders
            .filter((l) => l.ownerName && l.ownerName.trim() !== "—")
            .map((l) => (
              <div key={l._id} className="admin-leader-item">
                <div className="admin-leader-info">
                  <div className="admin-avatar">{getInitials(l.ownerName)}</div>
                  <div>
                    <div className="admin-owner-name">{l.ownerName}</div>
                    <div className="admin-owner-email">{l.ownerEmail}</div>
                  </div>
                </div>
                <div className="admin-leader-stats">
                  <span>{t("active")}: {l.activeAnimals}</span>
                  <span>{t("total")}: {l.totalAnimals}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="admin-trends">
        <h3 className="fw-bold">{t("animalsPerMonth")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" barSize={25} radius={[6, 6, 0, 0]}>
              {trends.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["#A8A8F0", "#C3F7C3", "#F8D7DA", "#FFD580", "#A0BCD6", "#2c3e50"][
                      index % 6
                    ]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
