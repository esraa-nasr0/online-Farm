import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./Report.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

function Report() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("ar");
  const [animalType, setAnimalType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFattening, setIsFattening] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsFattening(decoded.registerationType === "fattening");
      } catch (e) {
        console.error("JWT decode error", e);
      }
    }
  }, []);

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    if (!Authorization) throw new Error("No authorization token found");
    const formatted = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formatted };
  };

  async function getReport() {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const resp = await axios.get("https://farm-project-bbzj.onrender.com/api/filter/report", {
        params: { animalType, dateFrom, dateTo },
        headers,
      });
      if (resp.data?.status === "success") {
        setReportData(resp.data.data);
      } else {
        setError(resp.data?.message || t("error.unexpectedResponse"));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || t("fetch_report_error"));
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!animalType || !dateFrom || !dateTo) {
      setError(t("required_fields_error") || "Please fill all fields");
      return;
    }
    getReport();
  };

  const handleDownloadPDF = async () => {
    if (!animalType || !dateFrom || !dateTo) {
      setError(t("required_fields_error") || "Please fill all fields");
      return;
    }
    setIsDownloading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const resp = await axios.get("https://farm-project-bbzj.onrender.com/api/report/download", {
        params: { animalType, dateFrom, dateTo, lang: i18n.language },
        headers,
        responseType: "blob",
      });

      // ensure it's PDF
      const type = resp.headers["content-type"] || "";
      if (!type.includes("application/pdf")) {
        try {
          const text = await resp.data.text();
          const parsed = JSON.parse(text);
          throw new Error(parsed?.message || "Non-PDF response");
        } catch {
          throw new Error("Server returned non-PDF response");
        }
      }

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${animalType}-${dateFrom}-${dateTo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || t("download_error"));
    } finally {
      setIsDownloading(false);
    }
  };

  // ===== Helpers
  const fmt = (v, d = 2) => (v == null || Number.isNaN(v) ? "—" : Number(v).toFixed(d));
  const yesNo = (b) => (isRTL ? (b ? "نعم" : "لا") : b ? "Yes" : "No");

  // ===== Deconstruct API data
  const animalReport = reportData?.animalReport || [];
  const birthEntries = reportData?.birthEntries || {};
  const excludedReport = reportData?.excludedReport || [];
  const feedConsumption = reportData?.feedConsumption || [];
  const remainingFeedStock = reportData?.remainingFeedStock || [];
  const treatmentConsumption = reportData?.treatmentConsumption || [];
  const remainingTreatmentStock = reportData?.remainingTreatmentStock || [];
  const vaccineConsumption = reportData?.vaccineConsumption || [];
  const remainingVaccineStock = reportData?.remainingVaccineStock || [];
  const perShed = reportData?.perShed || {};
  const perBreed = reportData?.perBreed || {};
  const coverage = reportData?.coverageDays || {};
  const extra = reportData?.extraKpis || {};

  const totalAnimals = animalReport.reduce((s, r) => s + (r.count || 0), 0);
  const maleCount = animalReport.filter((a) => a.gender === "male").reduce((s, r) => s + r.count, 0);
  const femaleCount = animalReport.filter((a) => a.gender === "female").reduce((s, r) => s + r.count, 0);
  const breederCount = reportData?.pregnantAnimal || 0;

  const totalBirthEntries = birthEntries.totalBirthEntries || 0;
  const totalBirthMales = birthEntries.totalMales || 0;
  const totalBirthFemales = birthEntries.totalFemales || 0;

  const excludedSweep = excludedReport.filter((x) => x.excludedType === "sweep").reduce((s, r) => s + r.count, 0);
  const excludedDeath = excludedReport.filter((x) => x.excludedType === "death").reduce((s, r) => s + r.count, 0);
  const excludedSale = excludedReport.filter((x) => x.excludedType === "sale").reduce((s, r) => s + r.count, 0);
  const totalExcluded = excludedSweep + excludedDeath + excludedSale;

  // ===== Charts
  const donutData = useMemo(() => {
    const labels = [
      t("male") || "Male",
      t("female") || "Female",
      ...(isFattening ? [] : [t("pregnant") || "Pregnant"]),
      t("total_excluded") || "Excluded",
      ...(isFattening ? [] : [t("total_birth_males") || "Birth ♂", t("total_birth_females") || "Birth ♀"]),
    ];
    const data = [
      maleCount,
      femaleCount,
      ...(isFattening ? [] : [breederCount]),
      totalExcluded,
      ...(isFattening ? [] : [totalBirthMales, totalBirthFemales]),
    ];
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#2563EB", "#10B981", ...(isFattening ? [] : ["#F59E0B"]), "#EF4444", ...(isFattening ? [] : ["#6366F1", "#A78BFA"])],
          borderWidth: 0,
        },
      ],
    };
  }, [isFattening, maleCount, femaleCount, breederCount, totalExcluded, totalBirthMales, totalBirthFemales, t]);

  const donutOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
      },
      cutout: "60%",
    }),
    []
  );

  // Per shed costs bar
  const perShedCost = perShed?.feed || [];
  const shedBar = useMemo(() => {
    const labels = perShedCost.map((s) => s.shedName || "—");
    const cost = perShedCost.map((s) => s.totalCost || 0);
    return {
      data: {
        labels,
        datasets: [
          {
            label: t("cost") || "Cost",
            data: cost,
            backgroundColor: "#0EA5E9",
            borderRadius: 8,
            barThickness: 24,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#E5E7EB" } },
        },
      },
    };
  }, [perShedCost, t]);

  // ADG horizontal
  const perBreedADG = perBreed?.adg || [];
  const adgChart = useMemo(() => {
    const labels = perBreedADG.map((b) => b.breedName || "—");
    const adg = perBreedADG.map((b) => b.avgADG || 0);
    return {
      data: {
        labels,
        datasets: [
          {
            label: t("avg_adg") || "Avg ADG",
            data: adg,
            backgroundColor: "#F59E0B",
            borderRadius: 10,
            barThickness: 18,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "#E5E7EB" } },
          y: { grid: { display: false } },
        },
      },
    };
  }, [perBreedADG, t]);

  // Coverage sections
  const coverageFeed = coverage?.feed || [];
  const coverageTreatment = coverage?.treatment || [];
  const coverageVaccine = coverage?.vaccine || [];

  const sortedFeed = [...coverageFeed].sort((a, b) => (b.warn - a.warn) || ((a.daysCover ?? 0) - (b.daysCover ?? 0)));
  const sortedTreat = [...coverageTreatment].sort((a, b) => (b.warn - a.warn) || ((a.daysCover ?? 0) - (b.daysCover ?? 0)));
  const sortedVac = [...coverageVaccine].sort((a, b) => (b.warn - a.warn) || ((a.daysCover ?? 0) - (b.daysCover ?? 0)));

  return (
    <div className={`${style.page} ${isRTL ? style.rtl : ""}`}>
      <div className={style.header}>
        <h1 className={style.title}>{t("report") || "Report"}</h1>
        <div className={style.actions}>
          <button onClick={handleSubmit} className={style.btn} disabled={isLoading}>
            {isLoading ? (t("loading") || "Loading…") : (t("get_report") || "Get Report")}
          </button>
          {/* {reportData && (
            <button onClick={handleDownloadPDF} className={`${style.btn} ${style.btnPrimary}`} disabled={isDownloading}>
              {isDownloading ? (t("downloading") || "Downloading…") : (t("download_pdf") || "Download PDF")}
            </button>
          )} */}
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSubmit} className={style.filters}>
        <div className={style.field}>
          <label>{t("animal_type") || "Animal Type"}</label>
          <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
            <option value="">{t("select_animal_type") || "Select"}</option>
            <option value="goat">{t("goat") || "Goat"}</option>
            <option value="sheep">{t("sheep") || "Sheep"}</option>
          </select>
        </div>
        <div className={style.field}>
          <label>{t("date_from") || "From"}</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className={style.field}>
          <label>{t("date_to") || "To"}</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className={style.btnGhost} type="submit">{t("apply") || "Apply"}</button>
      </form>

      {error && <div className={style.error}>{error}</div>}
      {isLoading && <div className={style.loading}>{t("loading_report") || "Loading report…"}</div>}

      {reportData && (
        <>
          {/* KPIs */}
          <section className={style.statGrid}>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("total_animals") || "Total Animals"}</div>
              <div className={style.statValue}>{totalAnimals}</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("male") || "Males"}</div>
              <div className={style.statValue}>{maleCount}</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("female") || "Females"}</div>
              <div className={style.statValue}>{femaleCount}</div>
            </div>
            {!isFattening && (
              <div className={style.statCard}>
                <div className={style.statLabel}>{t("pregnant") || "Pregnant"}</div>
                <div className={style.statValue}>{breederCount}</div>
              </div>
            )}

            <div className={style.statCard}>
              <div className={style.statLabel}>{t("avg_cost_animal") || "Avg Cost/Animal"}</div>
              <div className={style.statValue}>{fmt(extra.avgCostPerAnimal)}</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("mortality_rate") || "Mortality Rate"}</div>
              <div className={style.statValue}>{fmt(extra.mortalityRate, 2)}%</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("treatment_incidence") || "Treatment Incidence"}</div>
              <div className={style.statValue}>{fmt(extra.treatmentIncidence, 2)}%</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("vaccination_coverage") || "Vaccination Coverage"}</div>
              <div className={style.statValue}>{fmt(extra.vaccinationCoverage, 1)}%</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("fcr_overall") || "FCR Overall"}</div>
              <div className={style.statValue}>{extra.fcrOverall == null ? "—" : fmt(extra.fcrOverall, 2)}</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("revenue") || "Revenue"}</div>
              <div className={style.statValue}>{fmt(extra.revenue)}</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>{t("profit") || "Profit"}</div>
              <div className={style.statValue}>{fmt(extra.profit)}</div>
            </div>
          </section>

          {/* Top row charts */}
          <section className={style.grid2}>
            <div className={style.card}>
              <div className={style.cardHead}>
                <h3 className={style.sectionTitle}>{t("current_status") || "Current Status"}</h3>
              </div>
              <div className={style.chartWrapLg}>
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>

            <div className={style.card}>
              <div className={style.cardHead}>
                <h3 className={style.sectionTitle}>{t("shed_costs") || "Per-Shed Feed Cost"}</h3>
              </div>
              <div className={style.chartWrapLg}>
                <Bar data={shedBar.data} options={shedBar.options} />
              </div>
              <div className={style.tableWrapMini}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>{t("shed") || "Shed"}</th>
                      <th>{t("consumed") || "Consumed"}</th>
                      <th>{t("cost") || "Cost"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(perShed.feed || []).map((s, i) => (
                      <tr key={i}>
                        <td>{s.shedName || "—"}</td>
                        <td className={style.num}>{fmt(s.totalConsumed, 2)}</td>
                        <td className={style.num}>{fmt(s.totalCost, 2)}</td>
                      </tr>
                    ))}
                    {(perShed.feed || []).length === 0 && (
                      <tr><td colSpan={3} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Per Shed excluded */}
          <section className={style.grid1}>
            <div className={style.card}>
              <div className={style.cardHead}>
                <h3 className={style.sectionTitle}>{t("shed_excluded") || "Per-Shed Excluded"}</h3>
              </div>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>{t("shed") || "Shed"}</th>
                    <th>{t("reason") || "Reason"}</th>
                    <th>{t("count") || "Count"}</th>
                  </tr>
                </thead>
                <tbody>
                  {(perShed.excluded || []).map((s, i) => (
                    <tr key={i}>
                      <td>{s.shedName || "—"}</td>
                      <td>{s.excludedType}</td>
                      <td className={style.num}>{s.count}</td>
                    </tr>
                  ))}
                  {(perShed.excluded || []).length === 0 && (
                    <tr><td colSpan={3} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Per Breed */}
          <section className={style.grid2}>
            <div className={style.card}>
              <div className={style.cardHead}>
                <h3 className={style.sectionTitle}>{t("per_breed_animals") || "Animals per Breed"}</h3>
              </div>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>{t("breed") || "Breed"}</th>
                    <th>{t("count") || "Count"}</th>
                  </tr>
                </thead>
                <tbody>
                  {(perBreed.animals || []).map((b, i) => (
                    <tr key={i}>
                      <td>{b.breedName || "—"}</td>
                      <td className={style.num}>{b.count || 0}</td>
                    </tr>
                  ))}
                  {(perBreed.animals || []).length === 0 && (
                    <tr><td colSpan={2} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={style.card}>
              <div className={style.cardHead}>
                <h3 className={style.sectionTitle}>ADG</h3>
              </div>
              <div className={style.chartWrapMd}>
                <Bar data={adgChart.data} options={adgChart.options} />
              </div>
              <div className={style.tableWrapMini}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>{t("breed") || "Breed"}</th>
                      <th>{t("avg_adg") || "Avg ADG"}</th>
                      <th>{t("total_gain") || "Total Gain"}</th>
                      <th>{t("animals") || "Animals"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(perBreed.adg || []).map((b, i) => (
                      <tr key={i}>
                        <td>{b.breedName || "—"}</td>
                        <td className={style.num}>{fmt(b.avgADG, 2)}</td>
                        <td className={style.num}>{fmt(b.totalGain, 2)}</td>
                        <td className={style.num}>{b.animals || 0}</td>
                      </tr>
                    ))}
                    {(perBreed.adg || []).length === 0 && (
                      <tr><td colSpan={4} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Coverage Days */}
          <section className={style.grid1}>
            <div className={style.card}>
              <div className={style.cardHead}><h3 className={style.sectionTitle}>{t("feed") || "Feed"}</h3></div>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>{t("feed") || "Feed"}</th>
                    <th>{t("stock") || "Stock"}</th>
                    <th>{t("daily_use") || "Daily Use"}</th>
                    <th>{t("days_cover") || "Days Cover"}</th>
                    <th>{t("warn") || "Warn"}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFeed.map((r, i) => {
                    const cover = r.daysCover ?? 0;
                    const pct = Math.max(0, Math.min(100, (cover / 10) * 100)); // 10 أيام حدّ أدنى
                    return (
                      <tr key={i} className={r.warn ? style.rowWarn : undefined}>
                        <td>{r.feedName ?? "—"}</td>
                        <td className={style.num}>{r.quantity ?? "—"}</td>
                        <td className={style.num}>{fmt(r.dailyUse)}</td>
                        <td className={style.num}>
                          {fmt(cover, 1)}
                          <div className={style.progressWrap}>
                            <div className={style.progressBar} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                        <td><span className={r.warn ? style.badgeDanger : style.badgeOk}>{yesNo(r.warn)}</span></td>
                      </tr>
                    );
                  })}
                  {sortedFeed.length === 0 && (
                    <tr><td colSpan={5} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={style.grid2}>
            <div className={style.card}>
              <div className={style.cardHead}><h3 className={style.sectionTitle}>{t("treatment") || "Treatment"}</h3></div>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>{t("treatment_name") || "Treatment"}</th>
                    <th>{t("stock") || "Stock"}</th>
                    <th>{t("daily_use") || "Daily Use"}</th>
                    <th>{t("days_cover") || "Days Cover"}</th>
                    <th>{t("warn") || "Warn"}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTreat.map((r, i) => {
                    const cover = r.daysCover ?? 0;
                    const pct = Math.max(0, Math.min(100, (cover / 10) * 100));
                    return (
                      <tr key={i} className={r.warn ? style.rowWarn : undefined}>
                        <td>{r.treatmentName ?? "—"}</td>
                        <td className={style.num}>{r.quantity ?? "—"}</td>
                        <td className={style.num}>{fmt(r.dailyUse)}</td>
                        <td className={style.num}>
                          {fmt(cover, 1)}
                          <div className={style.progressWrap}><div className={style.progressBar} style={{ width: `${pct}%` }} /></div>
                        </td>
                        <td><span className={r.warn ? style.badgeDanger : style.badgeOk}>{yesNo(r.warn)}</span></td>
                      </tr>
                    );
                  })}
                  {sortedTreat.length === 0 && (
                    <tr><td colSpan={5} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={style.card}>
              <div className={style.cardHead}><h3 className={style.sectionTitle}>{t("vaccine") || "Vaccine"}</h3></div>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>{t("vaccine_name") || "Vaccine"}</th>
                    <th>{t("remaining_doses") || "Remaining Doses"}</th>
                    <th>{t("daily_use") || "Daily Use"}</th>
                    <th>{t("days_cover") || "Days Cover"}</th>
                    <th>{t("warn") || "Warn"}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVac.map((r, i) => {
                    const cover = r.daysCover ?? 0;
                    const pct = Math.max(0, Math.min(100, (cover / 10) * 100));
                    return (
                      <tr key={i} className={r.warn ? style.rowWarn : undefined}>
                        <td>{r.vaccineName ?? "—"}</td>
                        <td className={style.num}>{r.totalDoses ?? "—"}</td>
                        <td className={style.num}>{fmt(r.dailyUse)}</td>
                        <td className={style.num}>
                          {fmt(cover, 1)}
                          <div className={style.progressWrap}><div className={style.progressBar} style={{ width: `${pct}%` }} /></div>
                        </td>
                        <td><span className={r.warn ? style.badgeDanger : style.badgeOk}>{yesNo(r.warn)}</span></td>
                      </tr>
                    );
                  })}
                  {sortedVac.length === 0 && (
                    <tr><td colSpan={5} className={style.muted}>{t("no_data") || "No data"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Raw stocks (optional) */}
          <section className={style.grid2}>
            
          </section>
        </>
      )}
    </div>
  );
}

export default Report;