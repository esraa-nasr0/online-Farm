import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { SupplierContext } from "../../Context/SupplierContext";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./SupplierTable.css"; // سيتم إنشاء هذا الملف

function SupplierTable() {
  const navigate = useNavigate();
  const { getSupplier, deleteSupplier } = useContext(SupplierContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const itemsPerPage = 10;

  const [searchCriteria, setSearchCriteria] = useState({
    email: "",
    company: "",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data } = await getSupplier(
        currentPage,
        pagination.limit,
        searchCriteria
      );
      setSuppliers(data.data.suppliers || []);
      setPagination(
        data.data.pagination || {
          total: data.data.suppliers?.length || 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(
            (data.data.suppliers?.length || 0) / itemsPerPage
          ),
        }
      );
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSuppliers();
  };

  const deleteItem = async (id) => {
    try {
      const res = await deleteSupplier(id);
      if (res?.status === 200 || res?.success) {
        setSuppliers((prev) => prev.filter((sup) => sup._id !== id));
        Swal.fire({
          icon: "success",
          title: t("deleted"),
          text: t("supplier_deleted"),
          timer: 1500,
        });
      } else {
        Swal.fire(t("error"), t("delete_failed"), "error");
      }
    } catch {
      Swal.fire(t("error"), t("delete_failed"), "error");
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

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`supplier-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="supplier-info">
              <h2 className="supplier-title">{t("Suppliers")}</h2>
              <p className="supplier-subtitle">{t("manage_suppliers")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_suppliers")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="emailInput" className="search-label">
                  {t("email")}
                </label>
                <input
                  type="text"
                  id="emailInput"
                  className="search-input"
                  placeholder={t("search_by_email")}
                  value={searchCriteria.email}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="search-field">
                <label htmlFor="companyInput" className="search-label">
                  {t("company")}
                </label>
                <input
                  type="text"
                  id="companyInput"
                  className="search-input"
                  placeholder={t("search_by_company")}
                  value={searchCriteria.company}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      company: e.target.value,
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
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <div key={supplier._id} className="supplier-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("name")}</span>
                      <span className="card-value">{supplier.name}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("email")}</span>
                      <span className="card-value">{supplier.email}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("phone")}</span>
                      <span className="card-value">{supplier.phone}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("company")}</span>
                      <span className="card-value">{supplier.company}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("notes")}</span>
                      <span className="card-value">{supplier.notes || "-"}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/editSupplier/${supplier._id}`)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(supplier._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("no_suppliers_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("name")}</th>
                  <th className="text-center">{t("email")}</th>
                  <th className="text-center">{t("phone")}</th>
                  <th className="text-center">{t("company")}</th>
                  <th className="text-center">{t("notes")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier, index) => (
                    <tr key={supplier._id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">{supplier.name}</td>
                      <td className="text-center">{supplier.email}</td>
                      <td className="text-center">{supplier.phone}</td>
                      <td className="text-center">{supplier.company}</td>
                      <td className="text-center">{supplier.notes || "-"}</td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => navigate(`/editSupplier/${supplier._id}`)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(supplier._id)}
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
                      {t("no_suppliers_found")}
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

export default SupplierTable;