import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { SupplierContext } from "../../Context/SupplierContext";
import { useTranslation } from "react-i18next";
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";

function SupplierTable() {
  const navigate = useNavigate();
  const { getSupplier, deleteSupplier } = useContext(SupplierContext);
  const { t } = useTranslation();

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
        <div className="animal">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className="container mt-4">
          <h2 className="vaccine-table-title">{t("Suppliers")}</h2>

          {/* Search Section */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_suppliers")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="emailInput" className="form-label">
                  {t("email")}
                </label>
                <input
                  type="text"
                  id="emailInput"
                  className="form-control"
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
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="companyInput" className="form-label">
                  {t("company")}
                </label>
                <input
                  type="text"
                  id="companyInput"
                  className="form-control"
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
              <div className="col-12 d-flex justify-content-end mt-2">
                <button className="btn btn-success" onClick={handleSearch}>
                  <FiSearch /> {t("search")}
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="container mt-5 vaccine-table-container">
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("name")}</th>
                    <th className="text-center bg-color">{t("email")}</th>
                    <th className="text-center bg-color">{t("phone")}</th>
                    <th className="text-center bg-color">{t("company")}</th>
                    <th className="text-center bg-color">{t("treatments")}</th>
                    <th className="text-center bg-color">{t("feeds")}</th>
                    <th className="text-center bg-color">{t("notes")}</th>
                    <th className="text-center bg-color">{t("actions")}</th>
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
                        <td className="text-center">
                          {supplier.treatments?.length > 0
                            ? supplier.treatments.map((t, i) => (
                                <div key={i}>{t.name}</div>
                              ))
                            : "—"}
                        </td>
                        <td className="text-center">
                          {supplier.feeds?.length > 0
                            ? supplier.feeds.map((f, i) => (
                                <div key={i}>{f.name}</div>
                              ))
                            : "—"}
                        </td>
                        <td className="text-center">{supplier.notes}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            style={{ color: "#0f7e34ff" }}
                            onClick={() =>
                              navigate(`/editSupplier/${supplier._id}`)
                            }
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#ff4d4f" }}
                            onClick={() => confirmDelete(supplier._id)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        {t("no_suppliers_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center mt-4">
              {renderModernPagination()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SupplierTable;
