
import  { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./WeeklyNotifications.css";

const BASE_URL = "https://farm-project-bbzj.onrender.com/api";

export default function NotificationPageStatic() {
  const { t ,i18n } = useTranslation();
  const [selected, setSelected] = useState({});

  const Authorization = localStorage.getItem("Authorization");
const lang = i18n.language || "en";
  const { data, isLoading, error } = useQuery({
    queryKey: ["notificationsDigest"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/notifications/digest`, {
        headers: { Authorization },
        params: { lang },
      });
     
      
      return res.data?.data?.digest || null;
    },
  });

  const digest = data;
  const notifications = digest?.notifications || [];
 console.log(digest);
  if (isLoading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error">{t("error_loading")}</div>;

  return (
    <div className="notification-page container">
      <nav>
        <header className="header">
          <div className="header-title">
            <h1>
              <MdNotifications /> {t("header")}
            </h1>
          </div>
        </header>
      </nav>

      <main className="main-content">
        {digest && (
          <section className="digest-summary modern-card">
            <h2>{t("digestTitle")}</h2>
            <div className="digest-grid">
              <div className="digest-item">
                <span className="label">{t("week")}:</span>
                <span className="value">{digest.digestPeriod.weekNumber}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("year")}:</span>
                <span className="value">{digest.digestPeriod.year}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("totalNotifications")}:</span>
                <span className="value">{digest.summary.totalNotifications}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("unread")}:</span>
                <span className="value unread">{digest.summary.unreadCount}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("highPriority")}:</span>
                <span className="value high">{digest.summary.highPriorityCount}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("critical")}:</span>
                <span className="value critical">{digest.summary.criticalCount}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("digestDay")}:</span>
                <span className="value">{digest.preferencesSnapshot.digestDay}</span>
              </div>
              <div className="digest-item">
                <span className="label">{t("digestTime")}:</span>
                <span className="value">{digest.preferencesSnapshot.digestTime}</span>
              </div>
            </div>
          </section>
        )}

        <section className="bulk-bar">
          <label className="checkbox-label">
            <input type="checkbox" /> {t("selectPage")}
          </label>
          <button className="btn" style={{ backgroundColor: "#e6f0ff", color: "#0f40e1" }}>
            <FaCheck /> {t("markSelected")}
          </button>
        </section>

        <div className="divider"></div>

        <ul className="notifications-list">
          {notifications.length === 0 ? (
            <p>{t("noNotifications")}</p>
          ) : (
            notifications.map((n) => {
              const createdText = new Date(n.createdAt).toLocaleString();
              const dueText = n.dueDate ? new Date(n.dueDate).toLocaleDateString() : null;

              return (
                <li key={n._id} className={`notification-item ${!n.isRead ? "unread" : ""}`}>
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={!!selected[n._id]}
                      onChange={(e) =>
                        setSelected((s) => ({ ...s, [n._id]: e.target.checked }))
                      }
                    />
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{n.message}</p>
                    <div className="badges">
                      <span className="chip">{n.type}</span>
                      <span className="chip">{n.severity}</span>
                      <span className="chip">{n.stage}</span>
                      {dueText && <span className="chip">🗓 {dueText}</span>}
                      {n.relatedNotifications?.length > 0 && (
                        <span className="chip">🔗 {n.relatedNotifications.length}</span>
                      )}
                    </div>
                    <p className="notification-time">{createdText}</p>
                  </div>
                  <div className="notification-actions">
                    <FaCheck
                      className="icon-action mark-read"
                      style={{ color: n.isRead ? "green" : "gray" }}
                    />
                    <RiDeleteBin6Line className="icon-action delete" style={{ color: "red" }} />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </main>
    </div>
  );
}
