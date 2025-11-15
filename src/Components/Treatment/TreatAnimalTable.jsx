import { useContext, useState, useEffect } from "react";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./TreatAnimalTable.css"; // سيتم إنشاء هذا الملف

function TreatAnimalTable() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { getTreatmentByAnimal, deleteTreatmentByAnimal } = useContext(TreatmentContext);
  const [isLoading, setIsLoading] = useState(false);
  const [treatment, setTreatment] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [TreatAnimalPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    locationShed: "",
    date: "",
  });

  const fetchTreatment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getTreatmentByAnimal(
        currentPage,
        TreatAnimalPerPage,
        searchCriteria
      );
      setTreatment(data?.data?.treatmentShed || []);
      setTotalPages(data.data.pagination?.totalPages);
    } catch (error) {
      Swal.fire(t("error_fetching_data"), "", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatment();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await deleteTreatmentByAnimal(id);
      setTreatment((prev) => prev.filter((item) => item._id !== id));
      Swal.fire(t("deleted_success"), "", "success");
    } catch (error) {
      Swal.fire(t("error_fetching_data"), "", "error");
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("delete_warning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("delete_confirm"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const editTreatment = (id) => {
    navigate(`/editTreatAnimal/${id}`);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderModernPagination = () => {
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
        pageButtons.push(<li key="start-ellipsis" className="pagination-ellipsis">...</li>);
      }
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;
      for (let i = start; i <= end; i++) addPage(i);
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
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li
          className={`page-item${currentPage === totalPages ? " disabled" : ""}`}
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTreatment();
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`treat-animal-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="treat-animal-info">
              <h2 className="treat-animal-title">{t("treatment_by_animal")}</h2>
              <p className="treat-animal-subtitle">{t("manage_treatments")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_treatments")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="tagIdInput" className="search-label">
                  {t("tag_id")}
                </label>
                <input
                  type="text"
                  id="tagIdInput"
                  className="search-input"
                  placeholder={t("search_tag_id")}
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
                <label htmlFor="locationShedInput" className="search-label">
                  {t("location_shed")}
                </label>
                <input
                  type="text"
                  id="locationShedInput"
                  className="search-input"
                  placeholder={t("search_location_shed")}
                  value={searchCriteria.locationShed}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      locationShed: e.target.value,
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
                  value={searchCriteria.date}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      date: e.target.value,
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
            {treatment.length > 0 ? (
              treatment.map((item, index) => (
                <div key={item._id} className="treat-animal-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * TreatAnimalPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("tag_id")}</span>
                      <span className="card-value">{item.tagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("location_shed")}</span>
                      <span className="card-value">
                        {item.locationShed?.locationShedName || item.locationShed || "-"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("treatment_name")}</span>
                      <span className="card-value">
                        {item.treatments?.[0]?.treatmentName || "No Treatment"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("volumePerAnimal")}</span>
                      <span className="card-value">
                        {item.treatments?.[0]?.volumePerAnimal || "N/A"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("date")}</span>
                      <span className="card-value">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editTreatment(item._id)}
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
                {t("no_treatments_found")}
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
                  <th className="text-center">{t("location_shed")}</th>
                  <th className="text-center">{t("treatment_name")}</th>
                  <th className="text-center">{t("volumePerAnimal")}</th>
                  <th className="text-center">{t("date")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {treatment.length > 0 ? (
                  treatment.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        {(currentPage - 1) * TreatAnimalPerPage + index + 1}
                      </td>
                      <td className="text-center">{item.tagId}</td>
                      <td className="text-center">
                        {item.locationShed?.locationShedName || item.locationShed || "-"}
                      </td>
                      <td className="text-center">
                        {item.treatments?.[0]?.treatmentName || "No Treatment"}
                      </td>
                      <td className="text-center">
                        {item.treatments?.[0]?.volumePerAnimal || "N/A"}
                      </td>
                      <td className="text-center">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editTreatment(item._id)}
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
                    <td colSpan="7" className="text-center no-data">
                      {t("no_treatments_found")}
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

export default TreatAnimalTable;