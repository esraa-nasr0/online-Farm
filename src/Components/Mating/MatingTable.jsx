import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MatingContext } from "../../Context/MatingContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "./MatingTable.css"; // سيتم إنشاء هذا الملف

const NO_DATE = "No Date";

function MatingTable() {
  const navigate = useNavigate();
  const { getMating, deleteMating } = useContext(MatingContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMatings, setAllMatings] = useState([]);
  const [displayedMatings, setDisplayedMatings] = useState([]);
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    matingDate: "",
    sonarResult: "",
    animalType: "",
    sonarDate: "",
    matingName: "",
    locationShed: "",
    entryType: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  async function fetchMating() {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await getMating(currentPage, itemsPerPage, filters);

      setAllMatings(data.data.mating);
      setDisplayedMatings(data.data.mating);

      setPagination(
        data.data.pagination || {
          total: data.data.mating.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(data.data.mating.length / itemsPerPage),
        }
      );
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMating();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await deleteMating(id);
      setAllMatings((prev) => prev.filter((mating) => mating._id !== id));
      setDisplayedMatings((prev) => prev.filter((mating) => mating._id !== id));
      Swal.fire({
        icon: "success",
        title: t("deleted"),
        text: t("mating_deleted"),
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error.message || t("delete_failed"),
      });
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

  const editMating = (id) => {
    navigate(`/editMating/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMating();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      if (currentPage > 3) {
        pageButtons.push(
          <li key="start-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) addPage(i);
      }

      if (currentPage < totalPages - 2) {
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );
      }
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
    if (!token) {
      navigate("/login");
      throw new Error("No authorization token found");
    }
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.mazraaonline.com/api/mating/downloadTemplate",
        {
          responseType: "blob",
          headers: {
            ...headers,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mating_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_download_template"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.mazraaonline.com/api/mating/export",
        {
          responseType: "blob",
          headers: {
            ...headers,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "matings.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromExcel = async (event) => {
    await importExcel(
      event,
      "https://api.mazraaonline.com/api/mating/import",
      t("matings_imported_successfully"),
      t("failed_to_import_from_excel")
    );
  };

  const handleUpdateFromExcel = async (event) => {
    await importExcel(
      event,
      "https://api.mazraaonline.com/api/mating/import?mode=update",
      t("matings_updated_successfully"),
      t("failed_to_update_from_excel")
    );
  };

  const importExcel = async (event, url, successMsg, failMsg) => {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        title: t("error"),
        text: t("please_select_file"),
        icon: "error",
      });
      return;
    }
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      Swal.fire({
        title: t("error"),
        text: t("please_upload_valid_excel"),
        icon: "error",
      });
      return;
    }
    const headers = getHeaders();
    const formData = new FormData();
    try {
      setIsLoading(true);
      formData.append("file", file);
      const response = await axios.post(url, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.status === "success") {
        Swal.fire({ title: t("success"), text: successMsg, icon: "success" });
        fetchMating();
      } else {
        throw new Error(response.data?.message || "Operation failed");
      }
    } catch (error) {
      Swal.fire({
        title: t("error"),
        text: error.response?.data?.message || failMsg,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
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
        <div className={`mating-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="mating-info">
              <h2 className="mating-title">{t("Mating Records")}</h2>
              <p className="mating-subtitle">{t("manage_mating_records")}</p>
            </div>
            
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_mating")}</h6>

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
                    setSearchCriteria({
                      ...searchCriteria,
                      tagId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="search-field">
                <label htmlFor="animalTypeInput" className="search-label">
                  {t("animal_type")}
                </label>
                <select
                  value={searchCriteria.animalType}
                  id="animalTypeInput"
                  className="search-input"
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
                <label htmlFor="matingDateInput" className="search-label">
                  {t("mating_date")}
                </label>
                <input
                  id="matingDateInput"
                  type="text"
                  className="search-input"
                  placeholder={t("search_mating_date")}
                  value={searchCriteria.matingDate}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      matingDate: e.target.value,
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
          
<div className="action-buttons-container">
  <div className="action-buttons">
    <button
      className="btn-export"
      onClick={handleExportToExcel}
      title={t("export_all_data")}
    >
      <i className="fas fa-download me-1"></i> {t("export_all_data")}
    </button>

    <button
      className="btn-template"
      onClick={handleDownloadTemplate}
      title={t("download_template")}
    >
      <i className="fas fa-file-arrow-down me-1"></i> {t("download_template")}
    </button>

    <label className="btn-import" title={t("import_from_excel")}>
      <i className="fas fa-file-import me-1"></i> {t("import_from_excel")}
      <input
        type="file"
        hidden
        accept=".xlsx,.xls"
        onChange={handleImportFromExcel}
      />
    </label>

    <label className="btn-update" title={t("update_from_excel")}>
      <i className="fas fa-sync-alt me-1"></i> {t("update_from_excel")}
      <input
        type="file"
        hidden
        accept=".xlsx,.xls"
        onChange={handleUpdateFromExcel}
      />
    </label>
  </div>
</div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {displayedMatings.length > 0 ? (
              displayedMatings.map((mating, index) => (
                <div key={mating._id} className="mating-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("female_tag_id")}</span>
                      <span className="card-value">{mating.tagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("male_tag_id")}</span>
                      <span className="card-value">{mating.maleTag_id}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("mating_type")}</span>
                      <span className="card-value">{mating.matingType}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("mating_date")}</span>
                      <span className="card-value">
                        {mating.matingDate
                          ? new Date(mating.matingDate).toLocaleDateString()
                          : NO_DATE}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("sonar_date")}</span>
                      <span className="card-value">
                        {mating.sonarDate
                          ? new Date(mating.sonarDate).toLocaleDateString()
                          : NO_DATE}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("sonar_result")}</span>
                      <span className="card-value">
                        {mating.sonarResult || "N/A"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">
                        {t("expected_delivery_date")}
                      </span>
                      <span className="card-value">
                        {mating.expectedDeliveryDate
                          ? new Date(
                              mating.expectedDeliveryDate
                            ).toLocaleDateString()
                          : NO_DATE}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editMating(mating._id)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(mating._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("no_mating_records")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("female_tag_id")}</th>
                  <th className="text-center">{t("male_tag_id")}</th>
                  <th className="text-center">{t("mating_type")}</th>
                  <th className="text-center">{t("mating_date")}</th>
                  <th className="text-center">{t("sonar_date")}</th>
                  <th className="text-center">{t("sonar_result")}</th>
                  <th className="text-center">{t("expected_delivery_date")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {displayedMatings.length > 0 ? (
                  displayedMatings.map((mating, index) => (
                    <tr key={mating._id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">{mating.tagId}</td>
                      <td className="text-center">{mating.maleTag_id}</td>
                      <td className="text-center">{mating.matingType}</td>
                      <td className="text-center">
                        {mating.matingDate
                          ? new Date(mating.matingDate).toLocaleDateString()
                          : NO_DATE}
                      </td>
                      <td className="text-center">
                        {mating.sonarDate
                          ? new Date(mating.sonarDate).toLocaleDateString()
                          : NO_DATE}
                      </td>
                      <td className="text-center">
                        {mating.sonarResult || "N/A"}
                      </td>
                      <td className="text-center">
                        {mating.expectedDeliveryDate
                          ? new Date(
                              mating.expectedDeliveryDate
                            ).toLocaleDateString()
                          : NO_DATE}
                      </td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editMating(mating._id)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(mating._id)}
                          title={t("delete")}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center no-data">
                      {t("no_mating_records")}
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

export default MatingTable;