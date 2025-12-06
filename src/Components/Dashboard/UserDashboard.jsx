import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, 
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FaSkullCrossbones,
  FaCheckCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiSheep, GiGoat } from "react-icons/gi";
import "./UserDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const getHeaders = () => {
  const Authorization = localStorage.getItem("Authorization");
  const formattedToken = Authorization?.startsWith("Bearer ")
    ? Authorization
    : `Bearer ${Authorization}`;
  return { Authorization: formattedToken };
};

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("https://farm-project-bbzj.onrender.com/api/dashboard/stats-v2", {
        headers: getHeaders(),
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p className="loading">{t("loading")}</p>;

  const monthlyLabels = data.trends.animalsPerMonth.map(
    (item) => `${item._id.m}/${item._id.y}`
  );
  const monthlyValues = data.trends.animalsPerMonth.map((item) => item.count);

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: t("numberOfAnimals"),
        data: monthlyValues,
        backgroundColor: [
          "#A8A8F0",
          "#C3F7C3",
          "#B8E9F5",
          "#A0BCD6",
          "#FFD580",
        ],
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const monthlyOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t("monthlyAnimalDistribution"),
        font: { size: 16, weight: "bold" },
        color: "#2c3e50",
      },
    },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  };

  const expenseLabels =
    data.finances.month.topExpenseCategories.length > 0
      ? data.finances.month.topExpenseCategories.map((item) => {
          const categoryMap = {
            animal_purchase: t("animalPurchase"),
            feed_consume: t("animalFeed"),
            treatment_course: t("healthCare"),
            "Booster Dose": t("vaccinations"),
          };
          return categoryMap[item.category] || item.category;
        })
      : [];

  const expenseValues =
    data.finances.month.topExpenseCategories.length > 0
      ? data.finances.month.topExpenseCategories.map((item) => item.total)
      : [];

  const expenseData = {
    labels: expenseLabels,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: [
          "#A8A8F0",
          "#C3F7C3",
          "#B8E9F5",
          "#F8D7DA",
          "#FFD580",
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: t("expenseDistribution"),
        font: { size: 16, weight: "bold" },
        color: "#2c3e50",
      },
    },
    cutout: "70%",
  };

  const shedsLabels = data.sheds.map((shed) => shed.shedName);
  const shedsValues = data.sheds.map((shed) => shed.animals);

  const shedsData = {
    labels: shedsLabels,
    datasets: [
      {
        label: t("numberOfAnimals"),
        data: shedsValues,
        backgroundColor: [
          "#A8A8F0",
          "#C3F7C3",
          "#B8E9F5",
          "#0b0b0bff",
          "#F8D7DA",
          "#FFD580",
          "#A0BCD6",
          "#2c3e50",
          "#a8f0cdff",
          "#bfa0d6ff",
        ],
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const shedsOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t("animalsByShed"),
        font: { size: 16, weight: "bold" },
        color: "#2c3e50",
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{t("farmDashboard")}</h1>

      {/* Row 1 */}
      <div className="cards-row">
        <div className="stat-card card-blue">
          <div className="card-header">
            <h3>{t("totalAnimals")}</h3>
            <GiSheep className="card-icon" />
          </div>
          <div className="stat-number">{data.totals.animals}</div>
          <div className="stat-details">
            <span>{t("goats")}: {data.totals.goats}</span>
            <span>{t("sheep")}: {data.totals.sheep}</span>
          </div>
        </div>

        <div className="stat-card card-green">
          <div className="card-header">
            <h3>{t("birthsLast30d")}</h3>
            <GiGoat className="card-icon" />
          </div>
          <div className="stat-number">{data.last30d.births}</div>
        </div>

        <div className="stat-card card-red">
          <div className="card-header">
            <h3>{t("deathsLast30d")}</h3>
            <FaSkullCrossbones className="card-icon" />
          </div>
          <div className="stat-number">{data.last30d.deaths}</div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="cards-row">
        <div className="stat-card card-purple">
          <div className="card-header">
            <h3>{t("positiveSonar")}</h3>
            <FaCheckCircle className="card-icon" />
          </div>
          <div className="stat-number">{data.last30d.sonarPositive}</div>
        </div>

        <div className="stat-card card-orange">
          <div className="card-header">
            <h3>{t("dueSoon")}</h3>
            <FaCalendarAlt className="card-icon" />
          </div>
          <div className="stat-number">{data.dueSoon.count}</div>
          <div className="stat-details">
            <span>{t("withinDays", { days: data.dueSoon.horizonDays })}</span>
          </div>
        </div>

        <div className="stat-card card-teal">
          <div className="card-header">
            <h3>{t("netProfit")}</h3>
            <FaMoneyBillWave className="card-icon" />
          </div>
          <div className="stat-number">{data.finances.month.net}</div>
          <div className="stat-details">
            <span>{t("revenue")}: {data.finances.month.revenue}</span>
            <span>{t("expenses")}: {data.finances.month.expenses}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        {monthlyValues.length > 0 && (
          <div className="chart-card">
            <Bar options={monthlyOptions} data={monthlyData} />
          </div>
        )}

        {expenseLabels.length > 0 && (
          <div className="chart-card">
            <Doughnut options={expenseOptions} data={expenseData} />
          </div>
        )}

        {shedsValues.length > 0 && (
          <div className="chart-card">
            <Bar options={shedsOptions} data={shedsData} />
          </div>
        )}
      </div>
    </div>
  );
}
