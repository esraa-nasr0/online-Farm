import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BreedingContext } from "../../Context/BreedingContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "./BreedingTable.css"; // سيتم إنشاء هذا الملف

const NO_DATE = "No Date";

// مكون لعرض تفاصيل BirthEntries على الهاتف
const MobileBirthEntries = ({ entries }) => {
  const { t } = useTranslation();
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  return (
    <div className="mobile-birth-entries">
      <h4 className="birth-entries-title">{t("Birth Entries")}</h4>
      {entries.length > 0 ? (
        entries.map((entry, idx) => (
          <div key={idx} className="birth-entry-card">
            <div className="birth-entry-header">
              <span className="entry-tag">{entry.tagId}</span>
              <span className="entry-gender">{entry.gender}</span>
            </div>
            <div className="birth-entry-details">
              <div className="birth-entry-row">
                <span className="label">{t("Birthweight")}:</span>
                <span className="value">{entry.birthweight} kg</span>
              </div>
              {entry.actualWeights && entry.actualWeights.length > 0 && (
                <div className="birth-entry-row">
                  <span className="label">{t("Actual Weights")}:</span>
                  <div className="value">
                    {entry.actualWeights.map((aw, i) => (
                      <span key={i} className="weight-chip">
                        {aw.value} kg ({fmt(aw.date)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {Array.isArray(entry.plannedWeights) && entry.plannedWeights.length > 0 ? (
              <div className="planned-weights-mobile">
                <h5 className="pw-title">{t("planned_weights") || "Planned weigh dates"}</h5>
                <div className="pw-chips-mobile">
                  {entry.plannedWeights.map((d, i2) => (
                    <div key={i2} className="pw-chip-mobile">
                      <span className="pw-index">#{i2 + 1}</span>
                      <time dateTime={d}>{fmt(d)}</time>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-planned-weights-mobile">
                {t("no_planned_weights") || "No planned weights."}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="no-entries-mobile">{t("No Birth Entries")}</div>
      )}
    </div>
  );
};

function BreadingTable() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { getAllBreeding, deleteBreeding } = useContext(BreedingContext);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [breeding, setBreeding] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // لتتبع البطاقة المفتوحة
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    animalType: "",
    deliveryDate: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  // تنسيق التاريخ للعرض داخل الـ chips
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const fetchBreeding = async () => {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await getAllBreeding(currentPage, itemsPerPage, filters);

      setBreeding(data?.breeding || []);
      setPagination(
        data?.pagination || {
          total: data?.breeding?.length || 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil((data?.breeding?.length || 0) / itemsPerPage),
        }
      );
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
      setBreeding([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannot_undo"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBreeding(id);
          setBreeding((prev) => prev.filter((item) => item._id !== id));
          Swal.fire(t("deleted"), t("breeding_deleted"), "success");
        } catch {
          Swal.fire(t("error"), t("delete_failed"), "error");
        }
      }
    });
  };

  const editBreeding = (id) => {
    navigate(`/editbreading/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBreeding();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleCardExpansion = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const renderModernPagination = () => {
    const totalPages = pagination.totalPages || 1;
    const pageButtons = [];
    const maxButtons = 5;

    const addPage = (page) => {
      pageButtons.push(
        <li
          key={page}
          className={`page-item${page === currentPage ? " active" : ""}`}
        >
          <button className="page-link" onClick={() => paginate(page)}>
            {page}
          </button>
        </li>
      );
    };

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3)
        pageButtons.push(
          <li key="start-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) addPage(i);
      }

      if (currentPage < totalPages - 2)
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

      addPage(totalPages);
    }

    return (
      <ul className="pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li
          className={`page-item${
            currentPage === totalPages ? " disabled" : ""
          }`}
        >
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t("next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) navigate("/login");
    return { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/breeding/downloadBreedingTemplate",
        { responseType: "blob", headers }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "breeding_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_download_template"), "error");
    }
  };

  const handleExportToExcel = async () => {
    const headers = getHeaders();
    try {
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/breeding/exportbreedingToExcel",
        { responseType: "blob", headers }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "breeding_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
    }
  };

  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const headers = getHeaders();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://farm-project-bbzj.onrender.com/api/breeding/import",
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      Swal.fire(t("success"), t("excel_uploaded_successfully"), "success");
      fetchBreeding();
    } catch {
      Swal.fire(t("error"), t("failed_to_upload_file"), "error");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`breeding-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="breeding-info">
              <h2 className="breeding-title">{t("Breeding Records")}</h2>
              <p className="breeding-subtitle">{t("manage_breeding_records")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_breeding")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="tagIdInput" className="search-label">
                  {t("tag_id")}
                </label>
                <input
                  type="text"
                  id="tagIdInput"
                  className="search-input"
                  placeholder={t("search_by_tag_id")}
                  value={searchCriteria.tagId}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, tagId: e.target.value })
                  }
                />
              </div>
              <div className="search-field">
                <label htmlFor="animalTypeInput" className="search-label">
                  {t("animal_type")}
                </label>
                <select
                  id="animalTypeInput"
                  className="search-input"
                  value={searchCriteria.animalType}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      animalType: e.target.value,
                    })
                  }
                >
                  <option value="">{t("animal_type")}</option>
                  <option value="goat">{t("goat")}</option>
                  <option value="sheep">{t("sheep")}</option>
                </select>
              </div>
              <div className="search-field">
                <label htmlFor="deliveryDateInput" className="search-label">
                  {t("delivery_date")}
                </label>
                <input
                  type="date"
                  id="deliveryDateInput"
                  className="search-input"
                  value={searchCriteria.deliveryDate}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      deliveryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="search-button">
                <button className="btn-search" onClick={handleSearch}>
                  <FiSearch /> {t("search")}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {breeding.length > 0 ? (
              breeding.map((item, index) => (
                <div key={item._id} className="breeding-card">
                  <div 
                    className="card-content"
                    onClick={() => toggleCardExpansion(item._id)}
                  >
                    <div className="card-header">
                      <div className="card-row">
                        <span className="card-label">#</span>
                        <span className="card-value">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                      </div>
                      <div className="expand-icon">
                        {expandedCard === item._id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </div>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Tag ID")}</span>
                      <span className="card-value">{item.tagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Delivery State")}</span>
                      <span className="card-value">{item.deliveryState}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Delivery Date")}</span>
                      <span className="card-value">
                        {item.deliveryDate
                          ? new Date(item.deliveryDate).toLocaleDateString()
                          : NO_DATE}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Mothering Ability")}</span>
                      <span className="card-value">{item.motheringAbility || "--"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Milking")}</span>
                      <span className="card-value">{item.milking || "--"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Birth Entries")}</span>
                      <span className="card-value">
                        {item.birthEntries?.length > 0 
                          ? `${item.birthEntries.length} ${t("entries")}`
                          : t("No Birth Entries")
                        }
                      </span>
                    </div>
                    
                    {/* عرض تفاصيل BirthEntries عند التوسيع */}
                    {expandedCard === item._id && item.birthEntries?.length > 0 && (
                      <MobileBirthEntries entries={item.birthEntries} />
                    )}
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editBreeding(item._id)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(item._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("no_data_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("Tag ID")}</th>
                  <th className="text-center">{t("Delivery State")}</th>
                  <th className="text-center">{t("Delivery Date")}</th>
                  <th className="text-center">{t("Birth Entries")}</th>
                  <th className="text-center">{t("Mothering Ability")}</th>
                  <th className="text-center">{t("Milking")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {breeding.length > 0 ? (
                  breeding.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">{item.tagId}</td>
                      <td className="text-center">{item.deliveryState}</td>
                      <td className="text-center">
                        {item.deliveryDate
                          ? new Date(item.deliveryDate).toLocaleDateString()
                          : NO_DATE}
                      </td>
                      <td className="text-center">
                        {item.birthEntries?.length > 0 ? (
                          <div className="birth-entries-container">
                            <div className="birth-entries-header">
                              <span className="birth-entries-count">
                                {item.birthEntries.length} {t("entries")}
                              </span>
                            </div>
                            {item.birthEntries.map((entry, idx) => (
                              <div key={idx} className="birth-entry-item">
                                <div className="birth-entry-details">
                                  <strong>{t("Tag ID")}:</strong> {entry.tagId},{" "}
                                  <strong>{t("Gender")}:</strong> {entry.gender},{" "}
                                  <strong>{t("Birthweight")}:</strong>{" "}
                                  {entry.birthweight} kg
                                </div>
                                {Array.isArray(entry.plannedWeights) && entry.plannedWeights.length > 0 ? (
                                  <div className="planned-weights">
                                    <div className="pw-header">
                                      <label className="pw-title">
                                        {t("planned_weights") || "Planned weigh dates"}
                                      </label>
                                      <span className="pw-count">{entry.plannedWeights.length}</span>
                                    </div>
                                    <ul className="pw-chips">
                                      {entry.plannedWeights.map((d, i2) => (
                                        <li key={i2} className="pw-chip" title={`#${i2 + 1}`}>
                                          <span className="pw-index">#{i2 + 1}</span>
                                          <time dateTime={d}>{fmt(d)}</time>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <div className="no-planned-weights">
                                    {t("no_planned_weights") || "No planned weights."}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">{t("No Birth Entries")}</span>
                        )}
                      </td>
                      <td className="text-center">{item.motheringAbility || "--"}</td>
                      <td className="text-center">{item.milking || "--"}</td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editBreeding(item._id)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(item._id)}
                          title={t("delete")}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center no-data">
                      {t("no_data_found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            {renderModernPagination()}
          </div>
        </div>
      )}
    </>
  );
}

export default BreadingTable;