import React, { useContext, useEffect, useState } from "react";
import "./AdminDashboard.css";
import { AdminContext } from "../../Context/AdminContext";
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

export default function AdminDashboard() {
  const { getAdminDashboard } = useContext(AdminContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchdata() {
      let res = await getAdminDashboard();
      console.log(res);
      setStats(res?.data);
    }
    fetchdata();
  }, [getAdminDashboard]);

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
      <h2 className="admin-dashboard-title fw-bold">Admin Dashboard</h2>

      {/* البطاقات */}
      <div className="admin-cards">
        <Card title="Animals" value={system.animals} />
        <Card title="Users" value={system.users} />
      </div>

      {/* القادة */}
      <div className="admin-leaders">
        <h3 className="fw-bold">Top Owners</h3>
        <ul className="admin-leaders-list">
          {leaders
            .filter((l) => l.ownerName && l.ownerName.trim() !== "—")
            .map((l) => (
              <li key={l._id} className="admin-leader-item">
                <div className="admin-leader-info">
                  <div className="admin-avatar">{getInitials(l.ownerName)}</div>
                  <div>
                    <div className="admin-owner-name">{l.ownerName}</div>
                    <div className="admin-owner-email">{l.ownerEmail}</div>
                  </div>
                </div>
                <div className="admin-leader-stats">
                  <span>Active: {l.activeAnimals}</span>
                  <span>Total: {l.totalAnimals}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* الترند */}
      <div className="admin-trends">
        <h3 className="fw-bold">Animals per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={trends}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" barSize={25} radius={[6, 6, 0, 0]}>
              {trends.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["#8884d8", "#82ca9d", "#000000", "#00CFFF", "#6495ED", "#32CD32"][
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

function Card({ title, value }) {
  return (
    <div className="admin-card">
      <div className="admin-card-title">{title}</div>
      <div className="admin-card-value">{value ?? "-"}</div>
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
