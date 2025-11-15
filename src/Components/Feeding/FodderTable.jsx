import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Feedcontext } from "../../Context/FeedContext";
import { FiSearch } from "react-icons/fi";
import "./FodderTable.css"; // سيتم إنشاء هذا الملف

function FodderTable() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { getFodder, deleteFodder } = useContext(Feedcontext);

  const [fodder, setFodder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchFodder = async () => {
    setIsLoading(true);
    try {
      const filters = { name: searchCriteria.name };
      const { data } = await getFodder(currentPage, itemsPerPage, filters);

      setFodder(data?.data?.fodders || []);
      setPagination(data?.pagination || { totalPages: 1 });
    } catch (error) {
      Swal.fire("Error", t("fodder.fetch.error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFodder();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFodder();
  };

  const editFodder = (id) => {
    navigate(`/editFodder/${id}`);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("fodder.delete.confirmTitle"),
      text: t("fodder.delete.confirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#21763e",
      cancelButtonColor: "#d33",
      confirmButtonText: t("fodder.delete.confirmButton"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const deleteItem = async (id) => {
    try {
      await deleteFodder(id);
      setFodder((prev) => prev.filter((item) => item._id !== id));
      Swal.fire("Deleted!", t("fodder.delete.success"), "success");
    } catch {
      Swal.fire("Error", t("fodder.delete.error"), "error");
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
          <button className="page-link" onClick={() => setCurrentPage(page)}>
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
        pageButtons.push(<li key="start-ellipsis" className="pagination-ellipsis">...</li>);
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        addPage(i);
      }

      if (currentPage < totalPages - 2) {
        pageButtons.push(<li key="end-ellipsis" className="pagination-ellipsis">...</li>);
      }
      addPage(totalPages);
    }

    return (
      <ul className="pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => setCurrentPage(currentPage - 1)}
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
            onClick={() => setCurrentPage(currentPage + 1)}
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
          <Rings height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`fodder-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="fodder-info">
              <h2 className="fodder-title">{t("fodder.title")}</h2>
              <p className="fodder-subtitle">{t("fodder_manage")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("fodder.filter")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="fodderNameInput" className="search-label">
                  {t("fodder.table.name")}
                </label>
                <input
                  type="text"
                  id="fodderNameInput"
                  className="search-input"
                  placeholder={t("fodder.searchPlaceholder")}
                  value={searchCriteria.name}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      name: e.target.value,
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
            {fodder.length > 0 ? (
              fodder.map((item, index) => (
                <div key={item._id} className="fodder-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("fodder.table.name")}</span>
                      <span className="card-value">{item.name}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("fodder.table.components")}</span>
                      <span className="card-value">
                        {item.components
                          .map((comp) => `${comp.quantity}`)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("fodder.table.totalQuantity")}</span>
                      <span className="card-value">{item.totalQuantity}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("fodder.table.totalPrice")}</span>
                      <span className="card-value">{item.totalPrice}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editFodder(item._id)}
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
                {t("fodder.table.noData")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("fodder.table.name")}</th>
                  <th className="text-center">{t("fodder.table.components")}</th>
                  <th className="text-center">{t("fodder.table.totalQuantity")}</th>
                  <th className="text-center">{t("fodder.table.totalPrice")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {fodder.length > 0 ? (
                  fodder.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">
                        {item.components
                          .map((comp) => `${comp.quantity}`)
                          .join(", ")}
                      </td>
                      <td className="text-center">{item.totalQuantity}</td>
                      <td className="text-center">{item.totalPrice}</td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editFodder(item._id)}
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
                    <td colSpan="6" className="text-center no-data">
                      {t("fodder.table.noData")}
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

export default FodderTable;