import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { ExcludedContext } from "../../Context/ExcludedContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./ExcludedTable.css";

const NO_DATE = "No Date";

function formatDate(date) {
  if (!date) return NO_DATE;
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return NO_DATE;
  }
}

function ExcludedTable() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { getExcluted, deleteExcluted } = useContext(ExcludedContext);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [excluded, setExcluded] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    excludedDate: "",
    animalType: "",
  });

  async function fetchExcluded() {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await getExcluted(currentPage, itemsPerPage, filters);
      setExcluded(data.data.excluded);
      setPagination(data.pagination || { totalPages: 1 });
    } catch {
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExcluded();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await deleteExcluted(id);
      setExcluded((prev) => prev.filter((item) => item._id !== id));
      Swal.fire({
        icon: "success",
        title: t("deleted"),
        text: t("excluded_deleted"),
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

  const editExcluded = (id) => navigate(`/editExcluded/${id}`);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchExcluded();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        pageButtons.push(<li key="start-ellipsis">...</li>);
      }
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) addPage(i);
      }
      if (currentPage < totalPages - 2) {
        pageButtons.push(<li key="end-ellipsis">...</li>);
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

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`excluded-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="excluded-info">
              <h2 className="excluded-title">{t("Excluded Records")}</h2>
              <p className="excluded-subtitle">{t("manage_excluded")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_excluded")}</h6>
            <div className="search-fields">
              <div className="search-field">
                <label className="search-label">{t("tag_id")}</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder={t("search_by_tag_id")}
                  value={searchCriteria.tagId}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, tagId: e.target.value })
                  }
                />
              </div>
              <div className="search-field">
                <label className="search-label">{t("animal_type")}</label>
                <select
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
                <label className="search-label">{t("date")}</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder={t("search_excluded_date")}
                  value={searchCriteria.excludedDate}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      excludedDate: e.target.value,
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

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {excluded.length > 0 ? (
              excluded.map((item, index) => (
                <div key={item._id} className="excluded-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("tag_id")}</span>
                      <span className="card-value">{item.tagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("date")}</span>
                      <span className="card-value">{formatDate(item.Date)}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("excluded_type")}</span>
                      <span className="card-value">{item.excludedType}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("excluded_reason")}</span>
                      <span className="card-value">
                        {item.reasoneOfDeath || "-"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("price")}</span>
                      <span className="card-value">{item.price || "-"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("weight")}</span>
                      <span className="card-value">{item.weight || "-"}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editExcluded(item._id)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(item._id)}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">{t("no_excluded_records")}</div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("tag_id")}</th>
                  <th>{t("date")}</th>
                  <th>{t("excluded_type")}</th>
                  <th>{t("excluded_reason")}</th>
                  <th>{t("price")}</th>
                  <th>{t("weight")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {excluded.length > 0 ? (
                  excluded.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.tagId}</td>
                      <td>{formatDate(item.Date)}</td>
                      <td>{item.excludedType}</td>
                      <td>{item.reasoneOfDeath || "-"}</td>
                      <td>{item.price || "-"}</td>
                      <td>{item.weight || "-"}</td>
                      <td className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editExcluded(item._id)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(item._id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      {t("no_excluded_records")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">{renderModernPagination()}</div>
        </div>
      )}
    </>
  );
}

export default ExcludedTable;
