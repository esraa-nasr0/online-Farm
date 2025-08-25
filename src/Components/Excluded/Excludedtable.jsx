import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { ExcludedContext } from "../../Context/ExcludedContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";

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
  const { t } = useTranslation();
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
    locationShed: "",
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

  const editExcluded = (id) => {
    navigate(`/editExcluded/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchExcluded();
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

  return (
    <>
      {isLoading ? (
        <div className="animal">
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#21763e"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className="container mt-4">
          <h2 className="vaccine-table-title">{t("Excluded Records")}</h2>

          {/* Filters */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_excluded")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="tagIdInput" className="form-label">
                  {t("tag_id")}
                </label>
                <input
                  type="text"
                  id="tagIdInput"
                  className="form-control"
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
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="animalTypeInput" className="form-label">
                  {t("animal_type")}
                </label>
                <select
                  value={searchCriteria.animalType}
                  id="animalTypeInput"
                  className="form-select"
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
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="excludedDateInput" className="form-label">
                  {t("date")}
                </label>
                <input
                  id="excludedDateInput"
                  type="text"
                  className="form-control"
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
              <div className="col-12 d-flex justify-content-end mt-2">
                <button className="btn btn-success" onClick={handleSearch}>
                  <FiSearch /> {t("search")}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="container mt-5 vaccine-table-container">
            <div className="table-responsive mt-4">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("tag_id")}</th>
                    <th className="text-center bg-color">{t("date")}</th>
                    <th className="text-center bg-color">{t("excluded_type")}</th>
                    <th className="text-center bg-color">
                      {t("excluded_reason")}
                    </th>
                    <th className="text-center bg-color">{t("price")}</th>
                    <th className="text-center bg-color">{t("weight")}</th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {excluded.length > 0 ? (
                    excluded.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-center">{item.tagId}</td>
                        <td className="text-center">{formatDate(item.Date)}</td>
                        <td className="text-center">{item.excludedType}</td>
                        <td className="text-center">
                          {item.reasoneOfDeath || "_"}
                        </td>
                        <td className="text-center">{item.price || "_"}</td>
                        <td className="text-center">{item.weight || "_"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => editExcluded(item._id)}
                            title={t("edit")}
                            style={{ color: "#0f7e34ff" }}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#d33" }}
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
                      <td colSpan="8" className="text-center py-4 text-muted">
                        {t("no_excluded_records")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav>{renderModernPagination()}</nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExcludedTable;
