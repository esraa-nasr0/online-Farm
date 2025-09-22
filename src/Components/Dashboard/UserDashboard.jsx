import React, { useEffect, useState } from "react";
import axios from "axios";
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
import "./UserDashboard.css";

// تسجيل مكونات Chart.js
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

  useEffect(() => {
    axios
      .get("https://farm-project-bbzj.onrender.com/api/dashboard/stats-v2", {
        headers: getHeaders(),
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p className="loading">Loading...</p>;

  // تحضير البيانات للرسم البياني الشهري
  const monthlyLabels = data.trends.animalsPerMonth.map(
    (item) => `${item._id.m}/${item._id.y}`
  );
  const monthlyValues = data.trends.animalsPerMonth.map((item) => item.count);

  const monthlyData = {
  labels: monthlyLabels,
  datasets: [
    {
      label: "Number of Animals",
      data: monthlyValues,
      backgroundColor: ['#A8A8F0', '#C3F7C3', '#000000', '#B8E9F5', '#A0BCD6', '#C3F7C3'],
      borderColor: ['#A8A8F0', '#C3F7C3', '#000000', '#B8E9F5', '#A0BCD6', '#C3F7C3'],
      borderWidth: 1,
      borderRadius: 6,
      barThickness: 20,
    },
  ],
};

  const monthlyOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Animal Distribution",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#2c3e50",
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e0e6ed",
        },
        ticks: {
          color: "#72849a",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#72849a",
        },
      },
    },
  };

  // تحضير بيانات التصنيفات المصروفات
  const expenseLabels = data.finances.month.topExpenseCategories.map((item) => {
    // تحويل أسماء الفئات إلى الإنجليزية
    const categoryMap = {
      animal_purchase: "Animal Purchase",
      feed_consume: "Animal Feed",
      treatment_course: "Health Care",
      "Booster Dose": "Vaccinations",
    };
    return categoryMap[item.category] || item.category;
  });
  const expenseValues = data.finances.month.topExpenseCategories.map(
    (item) => item.total
  );

  const expenseData = {
  labels: expenseLabels,
  datasets: [
    {
      data: expenseValues,
      backgroundColor: ['#A8A8F0', '#C3F7C3', '#000000', '#B8E9F5', '#A0BCD6', '#C3F7C3'],
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
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Expense Distribution",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#2c3e50",
        padding: {
          bottom: 10,
        },
      },
    },
    cutout: "70%",
  };

  // تحضير بيانات العنابر
  const shedsLabels = data.sheds.map((shed) => shed.shedName);
  const shedsValues = data.sheds.map((shed) => shed.animals);

  const shedsData = {
  labels: shedsLabels,
  datasets: [
    {
      label: "Number of Animals",
      data: shedsValues,
      backgroundColor: ['#A8A8F0', '#C3F7C3', '#000000', '#B8E9F5', '#A0BCD6', '#C3F7C3'],
      borderColor: ['#A8A8F0', '#C3F7C3', '#000000', '#B8E9F5', '#A0BCD6', '#C3F7C3'],
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
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Animals Distribution by Shed",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#2c3e50",
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "#e0e6ed",
        },
        ticks: {
          color: "#72849a",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#72849a",
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Farm Dashboard</h1>

      {/* البطاقات الإحصائية - الصف الأول */}
      <div className="cards-row">
        <div className="stat-card card-blue">
          <div className="card-header">
            <h3>Total Animals</h3>
            <div className="card-icon">🐐</div>
          </div>
          <div className="stat-number">{data.totals.animals}</div>
          <div className="stat-comparison positive">
            <span className="comparison-arrow">↑</span>
            <span className="comparison-text">Goats: {data.totals.goats}</span>
          </div>
          <div className="stat-details">
            <span>Sheep: {data.totals.sheep}</span>
          </div>
        </div>

        <div className="stat-card card-green">
          <div className="card-header">
            <h3>Births (Last 30d)</h3>
            <div className="card-icon">🐣</div>
          </div>
          <div className="stat-number">{data.last30d.births}</div>
          <div className="stat-comparison positive">
            <span className="comparison-arrow">↑</span>
            <span className="comparison-text">+0%</span>
          </div>
        </div>

        <div className="stat-card card-red">
          <div className="card-header">
            <h3>Deaths (Last 30d)</h3>
            <div className="card-icon">⚰️</div>
          </div>
          <div className="stat-number">{data.last30d.deaths}</div>
          <div className="stat-comparison negative">
            <span className="comparison-arrow">↓</span>
            <span className="comparison-text">+0%</span>
          </div>
        </div>
      </div>

      {/* البطاقات الإحصائية - الصف الثاني */}
      <div className="cards-row">
        <div className="stat-card card-purple">
          <div className="card-header">
            <h3>Positive Sonar</h3>
            <div className="card-icon">✅</div>
          </div>
          <div className="stat-number">{data.last30d.sonarPositive}</div>
          <div className="stat-comparison positive">
            <span className="comparison-arrow">↑</span>
            <span className="comparison-text">+100%</span>
          </div>
        </div>

        <div className="stat-card card-orange">
          <div className="card-header">
            <h3>Due Soon</h3>
            <div className="card-icon">📅</div>
          </div>
          <div className="stat-number">{data.dueSoon.count}</div>
          <div className="stat-comparison">
            <span className="comparison-text">
              Within {data.dueSoon.horizonDays} days
            </span>
          </div>
        </div>

        <div className="stat-card card-teal">
          <div className="card-header">
            <h3>Net Profit</h3>
            <div className="card-icon">💰</div>
          </div>
          <div className="stat-number">{data.finances.month.net} SAR</div>
          <div className="stat-comparison positive">
            <span className="comparison-arrow">↑</span>
            <span className="comparison-text">
              +
              {Math.round(
                (data.finances.month.net / data.finances.month.revenue) * 100
              )}
              %
            </span>
          </div>
          <div className="stat-details">
            <span>Revenue: {data.finances.month.revenue} SAR</span>
            <span>Expenses: {data.finances.month.expenses} SAR</span>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية - 3 في صف واحد */}
      <div className="charts-row">
        <div className="chart-card">
          <Bar options={monthlyOptions} data={monthlyData} />
        </div>

        <div className="chart-card">
          <Doughnut options={expenseOptions} data={expenseData} />
        </div>

        <div className="chart-card">
          <Bar options={shedsOptions} data={shedsData} />
        </div>
      </div>
    </div>
  );
}