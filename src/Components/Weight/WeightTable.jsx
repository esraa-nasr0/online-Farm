import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { WeightContext } from "../../Context/WeightContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
// import axios from "axios";
import "./WeightTable.css"; // سيتم إنشاء هذا الملف

function WeightTable() {
  const navigate = useNavigate();
  const { getWeight, deleteWeight } = useContext(WeightContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [weightsPerPage] = useState(10);
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    weightType: "",
    Date: "",
  });
  const [weights, setWeights] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  async function fetchWeights() {
    setIsLoading(true);
    try {
      const filters = {
        tagId: searchCriteria.tagId,
        weightType: searchCriteria.weightType,
        Date: searchCriteria.Date,
      };
      const { data } = await getWeight(currentPage, weightsPerPage, filters);
      setWeights(data.data.weight);
      setPagination(data.pagination || { totalPages: 1 });
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWeights();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await deleteWeight(id);
      setWeights((prev) => prev.filter((w) => w._id !== id));
      Swal.fire({
        icon: "success",
        title: t("deleted"),
        text: t("weight_deleted"),
        timer: 1500,
      });
    } catch (error) {
      Swal.fire(t("error"), error.message || t("delete_failed"), "error");
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannot_undo"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const editWeight = (id) => {
    navigate(`/editWeight/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchWeights();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderModernPagination = () => {
    const total = pagination?.totalPages || 1;
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

    if (total <= maxButtons) {
      for (let i = 1; i <= total; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3)
        pageButtons.push(
          <li key="start-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(total - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= total - 2) start = total - 3;

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < total) addPage(i);
      }

      if (currentPage < total - 2)
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

      addPage(total);
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
            currentPage === total ? " disabled" : ""
          }`}
        >
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === total}
          >
            {t("next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

  // const getHeaders = () => {
  //   const token = localStorage.getItem("Authorization");
  //   if (!token) {
  //     navigate("/login");
  //     throw new Error("No authorization token found");
  //   }
  //   return {
  //     Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  //   };
  // };

  // const handleDownloadTemplate = async () => {
  //   const headers = getHeaders();
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(
  //       "https://api.mazraaonline.com/api/weight/downloadWeightTemplate",
  //       {
  //         responseType: "blob",
  //         headers: {
  //           ...headers,
  //           Accept:
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         },
  //       }
  //     );
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "weight_template.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch {
  //     Swal.fire(t("error"), t("failed_to_download_template"), "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleExportToExcel = async () => {
  //   const headers = getHeaders();
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(
  //       "https://api.mazraaonline.com/api/weight/exportWeightsToExcel",
  //       {
  //         responseType: "blob",
  //         headers: {
  //           ...headers,
  //           Accept:
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         },
  //       }
  //     );
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "weights.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch {
  //     Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleImportFromExcel = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   const headers = getHeaders();
  //   const formData = new FormData();
  //   try {
  //     setIsLoading(true);
  //     formData.append("file", file);
  //     const response = await axios.post(
  //       "https://api.mazraaonline.com/api/weight/importWeightsFromExcel",
  //       formData,
  //       { headers: { ...headers, "Content-Type": "multipart/form-data" } }
  //     );
  //     if (response.data?.status === "success") {
  //       Swal.fire(t("success"), t("weights_imported_successfully"), "success");
  //       fetchWeights();
  //     } else {
  //       throw new Error("Import failed");
  //     }
  //   } catch {
  //     Swal.fire(t("error"), t("failed_to_import_from_excel"), "error");
  //   } finally {
  //     setIsLoading(false);
  //     event.target.value = "";
  //   }
  // };

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`weight-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="weight-info">
              <h2 className="weight-title">{t("weight_records")}</h2>
              <p className="weight-subtitle">{t("manage_weight_records")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_weights")}</h6>

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
                <label htmlFor="weightTypeInput" className="search-label">
                  {t("weight_type")}
                </label>
                <input
                  type="text"
                  id="weightTypeInput"
                  className="search-input"
                  placeholder={t("search_by_weight_type")}
                  value={searchCriteria.weightType}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      weightType: e.target.value,
                    })
                  }
                />
              </div>
              <div className="search-field">
                <label htmlFor="dateInput" className="search-label">
                  {t("date")}
                </label>
                <input
                  type="date"
                  id="dateInput"
                  className="search-input"
                  value={searchCriteria.Date}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, Date: e.target.value })
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

          {/* Excel Buttons */}
          {/* <div className="excel-buttons">
            <div className="d-flex flex-wrap gap-2">
              <button className="btn-excel" onClick={handleExportToExcel}>
                <i className="fas fa-download me-1"></i> {t("export_all_data")}
              </button>
              <button className="btn-excel" onClick={handleDownloadTemplate}>
                <i className="fas fa-file-arrow-down me-1"></i> {t("download_template")}
              </button>
              <label className="btn-excel d-flex align-items-center">
                <i className="fas fa-file-import me-1"></i> {t("import_from_excel")}
                <input type="file" hidden accept=".xlsx,.xls" onChange={handleImportFromExcel} />
              </label>
            </div>
          </div> */}

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {weights.length > 0 ? (
              weights.map((w, index) => (
                <div key={w._id} className="weight-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * weightsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("tag_id")}</span>
                      <span className="card-value">{w.tagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("weight_type")}</span>
                      <span className="card-value">{w.weightType}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("weight")}</span>
                      <span className="card-value">{w.weight}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("height")}</span>
                      <span className="card-value">{w.height}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("date")}</span>
                      <span className="card-value">
                        {w.Date ? w.Date.split("T")[0] : t("no_date")}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editWeight(w._id)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(w._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("no_weight_records")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("tag_id")}</th>
                  <th className="text-center">{t("weight_type")}</th>
                  <th className="text-center">{t("weight")}</th>
                  <th className="text-center">{t("height")}</th>
                  <th className="text-center">{t("date")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {weights.length > 0 ? (
                  weights.map((w, index) => (
                    <tr key={w._id}>
                      <td className="text-center">
                        {(currentPage - 1) * weightsPerPage + index + 1}
                      </td>
                      <td className="text-center">{w.tagId}</td>
                      <td className="text-center">{w.weightType}</td>
                      <td className="text-center">{w.weight}</td>
                      <td className="text-center">{w.height}</td>
                      <td className="text-center">
                        {w.Date ? w.Date.split("T")[0] : t("no_date")}
                      </td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editWeight(w._id)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(w._id)}
                          title={t("delete")}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center no-data">
                      {t("no_weight_records")}
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

export default WeightTable;