import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axios";
import { FaUsers, FaMars, FaVenus } from "react-icons/fa";
import { GiGoat, GiSheep } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./DetailsLocation.css";

const BASE_URL = "https://farm-project-bbzj.onrender.com";

export default function DetailsLocation() {
  const [animals, setAnimals] = useState([]);
  const [stats, setStats] = useState(null);
  const [shed, setShed] = useState(null);
  const [loading, setLoading] = useState(true);

  // للنقل
  const [sheds, setSheds] = useState([]);
  const [toShed, setToShed] = useState("");
  const [moving, setMoving] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { id } = useParams();

  const fetchSheds = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/api/location/GetAll-Locationsheds`,
        { params: { limit: 1000, page: 1 } }
      );
      setSheds(res?.data?.data?.locationSheds || []);
    } catch (e) {
      console.error("Error fetching sheds list:", e);
      Swal.fire("❌", t("failed_to_fetch_sheds"), "error");
    }
  }, [t]);

  const fetchAnimalsInShed = useCallback(async () => {
    try {
      setLoading(true);
      setSelected(new Set());
      const res = await axiosInstance.get(
        `${BASE_URL}/api/location/getanimalsinshed`,
        { params: { locationShedId: id, includeStats: true } }
      );
      setAnimals(res.data?.data?.animals || []);
      setStats(res.data?.data?.stats || null);
      setShed(res.data?.shed || null);
    } catch (err) {
      console.error("Error fetching shed details:", err);
      Swal.fire("❌", t("failed_to_fetch_shed"), "error");
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (id) {
      fetchAnimalsInShed();
      fetchSheds();
    }
  }, [id, fetchAnimalsInShed, fetchSheds]);

  const toggleOne = (animalId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(animalId)) next.delete(animalId);
      else next.add(animalId);
      return next;
    });
  };
  const allSelected = animals.length > 0 && selected.size === animals.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(animals.map((a) => a._id)));
  };

  const handleMove = async () => {
    if (!toShed) return Swal.fire("⚠️", t("select_destination_first"), "warning");
    if (toShed === id) return Swal.fire("⚠️", t("cannot_move_same_shed"), "warning");
    if (selected.size === 0) return Swal.fire("ℹ️", t("select_animals_first"), "info");

    const body = {
      toLocationShed: toShed,
      fromLocationShed: id,
      animalIds: Array.from(selected),
    };

    try {
      setMoving(true);
      const res = await axiosInstance.post(
        `${BASE_URL}/api/animal/moveanimals`,
        body
      );
      const moved = res?.data?.moved ?? 0;
      const toName = res?.data?.to?.name || "";

      Swal.fire("✅", t("moved_success", { count: moved, shed: toName }), "success");

      await fetchAnimalsInShed();
      setSelected(new Set());
      setToShed("");
    } catch (e) {
      console.error("Move error:", e);
      const msg = e?.response?.data?.message || e?.message;
      Swal.fire("❌", msg || t("failed_to_move_animals"), "error");
    } finally {
      setMoving(false);
    }
  };

  if (loading) {
    return (
      <div className={`loading-wrap ${isRTL ? "rtl" : ""}`}>
        <div className="spinner" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className={`location-container ${isRTL ? "rtl" : ""}`}>
      {/* الهيدر + أدوات النقل */}
      <div className="toolbar">
        <div className="shed-info">
          {shed && (
            <>
              <h2 className="shed-title">
                {t("shed_details")}: <span>{shed.name}</span>
              </h2>
              <p className="shed-subtitle">
                {t("animals_in")} {shed.name}
              </p>
            </>
          )}
        </div>

        <div className="move-controls">
          <label className="dest-label">{t("destination_shed")}</label>
          <select
            className="dest-select"
            value={toShed}
            onChange={(e) => setToShed(e.target.value)}
          >
            <option value="">{t("choose_destination")}</option>
            {sheds.map((s) => (
              <option key={s._id} value={s._id} disabled={s._id === id}>
                {s.locationShedName}{s._id === id ? ` (${t("current")})` : ""}
              </option>
            ))}
          </select>
          <button
            className="move-btn"
            onClick={handleMove}
            disabled={moving || !toShed || selected.size === 0 || toShed === id}
          >
            {moving
              ? t("moving_animals")
              : t("move_selected", { count: selected.size })}
          </button>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h4>{t("total")}</h4>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <FaMars className="stat-icon" />
            <h4>{t("males")}</h4>
            <p>{stats.males}</p>
          </div>
          <div className="stat-card">
            <FaVenus className="stat-icon" />
            <h4>{t("females")}</h4>
            <p>{stats.females}</p>
          </div>
          <div className="stat-card">
            <GiGoat className="stat-icon" />
            <h4>{t("goats")}</h4>
            <p>{stats.goats}</p>
          </div>
          <div className="stat-card">
            <GiSheep className="stat-icon" />
            <h4>{t("sheep")}</h4>
            <p>{stats.sheep}</p>
          </div>
        </div>
      )}

      {/* جدول الحيوانات */}
      <h3 className="table-title">🐑 {t("animals_in")} {shed?.name}</h3>
      {/* Mobile Cards View */}
<div className="mobile-cards">
  {animals.length > 0 ? (
    animals.map((animal) => {
      const checked = selected.has(animal._id);
      return (
        <div key={animal._id} className={`animal-card ${checked ? "row-selected" : ""}`}>
          <div className="card-content">
            <div className="card-row">
              <span className="card-label">{t("tag_id")}</span>
              <span className="card-value">{animal.tagId}</span>
            </div>
            <div className="card-row">
              <span className="card-label">{t("type")}</span>
              <span className="card-value">
                {animal.animalType === "goat" ? t("goat") : t("sheep")}
              </span>
            </div>
            <div className="card-row">
              <span className="card-label">{t("gender")}</span>
              <span className="card-value">
                {animal.gender === "male" ? t("male") : t("female")}
              </span>
            </div>
            <div className="card-row">
              <span className="card-label">{t("age")}</span>
              <span className="card-value">
                {animal.age
                  ? `${animal.age.years} ${t("years")} - ${animal.age.months} ${t("months")} - ${animal.age.days} ${t("days")}`
                  : t("unknown")}
              </span>
            </div>
            <div className="card-row">
              <span className="card-label">{t("breed")}</span>
              <span className="card-value">
                {animal.breed ? animal.breed.breedName : t("not_specified")}
              </span>
            </div>
          </div>
          <div className="card-actions">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleOne(animal._id)}
              title={checked ? t("unselect") : t("select")}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div className="no-data-mobile">{t("no_animals_in_shed")}</div>
  )}
</div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  title={allSelected ? t("unselect_all") : t("select_all")}
                />
              </th>
              <th>{t("tag_id")}</th>
              <th>{t("type")}</th>
              <th>{t("gender")}</th>
              <th>{t("age")}</th>
              <th>{t("breed")}</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => {
              const checked = selected.has(animal._id);
              return (
                <tr key={animal._id} className={checked ? "row-selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(animal._id)}
                    />
                  </td>
                  <td className="mono">{animal.tagId}</td>
                  <td>
                    {animal.animalType === "goat" ? t("goat") : t("sheep")}
                  </td>
                  <td>
                    {animal.gender === "male" ? t("male") : t("female")}
                  </td>
                  <td>
                    {animal.age
                      ? `${animal.age.years} ${t("years")} - ${animal.age.months} ${t("months")} - ${animal.age.days} ${t("days")}`
                      : t("unknown")}
                  </td>
                  <td>
                    {animal.breed ? animal.breed.breedName : t("not_specified")}
                  </td>
                </tr>
              );
            })}
            {animals.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                  {t("no_animals_in_shed")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* شريط أسفل الجدول */}
      <div className="footer-bar">
        <div>
          {t("selected")}: <b>{selected.size}</b>
        </div>
        <div className="footer-actions">
          <button className="pill-btn" onClick={() => setSelected(new Set())}>
            {t("clear_selection")}
          </button>
          <button className="pill-btn" onClick={toggleAll}>
            {allSelected ? t("unselect_all") : t("select_all")}
          </button>
        </div>
      </div>
    </div>
  );
}
