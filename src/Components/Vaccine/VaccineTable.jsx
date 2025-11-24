import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { VaccineanimalContext } from "../../Context/VaccineanimalContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "./VaccineTable.css"; // سيتم إنشاء هذا الملف

function VaccineTable() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { getallVaccineanimal, DeletVaccineanimal } =
    useContext(VaccineanimalContext);

  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    animalType: "",
    vaccineName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  async function getItem() {
    setIsLoading(true);
    try {
      const filters = {
        vaccineName: searchCriteria.vaccineName,
        tagId: searchCriteria.tagId,
      };

      let { data } = await getallVaccineanimal(
        currentPage,
        animalsPerPage,
        filters
      );
      if (data && data.vaccines) {
        const uniqueVaccines = Array.from(
          new Set(data.vaccines.map((vaccine) => vaccine._id))
        ).map((id) => data.vaccines.find((vaccine) => vaccine._id === id));
        setVaccines(uniqueVaccines);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        setVaccines([]);
        Swal.fire({
          icon: "error",
          title: "Data Error",
          text: "Received unexpected data structure from server",
        });
      }
    } catch (error) {
      console.error("Error fetching vaccine data:", error);
      setVaccines([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load vaccine data",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    setCurrentPage(1);
    getItem();
  };

  useEffect(() => {
    getItem();
  }, [currentPage]);

  async function deleteItem(id) {
    try {
      let response = await DeletVaccineanimal(id);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Vaccine record has been deleted.",
          timer: 1500,
        });
        setVaccines((prev) => prev.filter((vaccine) => vaccine._id !== id));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete vaccine record",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting",
      });
    }
  }

  function handleClick(id) {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id);
      }
    });
  }

  function editVaccine(id) {
    navigate(`/editVaccine/${id}`);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Modern pagination rendering function
  const renderModernPagination = () => {
    const total = pagination.totalPages;
    const pageButtons = [];
    const maxButtons = 5; // How many page numbers to show (excluding ellipsis)

    // Helper to add a page button
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

    // Always show first, last, current, and neighbors
    if (total <= maxButtons) {
      for (let i = 1; i <= total; i++) addPage(i);
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
      let end = Math.min(total - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      if (currentPage >= total - 2) start = total - 3;
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < total) addPage(i);
      }
      if (currentPage < total - 2) {
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );
      }
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
            &lt; {t("Back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === total}
          >
            {t("Next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#21763e"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className={`vaccine-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="vaccine-info">
              <h2 className="vaccine-title">{t("Vaccines")}</h2>
              <p className="vaccine-subtitle">{t("manage_vaccines")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_vaccines")}</h6>

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
                <label htmlFor="vaccineNameInput" className="search-label">
                  {t("vaccine_name")}
                </label>
                <input
                  type="text"
                  id="vaccineNameInput"
                  className="search-input"
                  placeholder={t("search_by_vaccine_name")}
                  value={searchCriteria.vaccineName}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      vaccineName: e.target.value,
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
            {vaccines.length > 0 ? (
              vaccines.map((vaccine, index) => (
                <div key={vaccine._id} className="vaccine-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">{index + 1}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Vaccine Name")}</span>
                      <span className="card-value">
                        {vaccine.vaccineType
                          ? i18n.language === "ar"
                            ? vaccine.vaccineType.arabicName
                            : vaccine.vaccineType.englishName
                          : vaccine.otherVaccineName || t("N/A")}
                        {vaccine.vaccineType && (
                          <small className="text-muted d-block">
                            {i18n.language === "ar"
                              ? vaccine.vaccineType.arabicDiseaseType
                              : vaccine.vaccineType.englishDiseaseType}
                          </small>
                        )}
                      </span>
                    </div>
                    {vaccine.vaccineType?.image && (
                      <div className="card-row">
                        <span className="card-label">{t("Image")}</span>
                        <span className="card-value">
                          <img
                            src={`https://api.mazraaonline.com/${vaccine.vaccineType.image.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={
                              i18n.language === "ar"
                                ? vaccine.vaccineType.arabicName
                                : vaccine.vaccineType.englishName
                            }
                            width="50"
                            height="50"
                            style={{
                              borderRadius: "5px",
                              objectFit: "cover",
                              border: "1px solid #ddd",
                            }}
                          />
                        </span>
                      </div>
                    )}
                    <div className="card-row">
                      <span className="card-label">{t("Bottles")}</span>
                      <span className="card-value">{vaccine.stock?.bottles || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Doses Per Bottle")}</span>
                      <span className="card-value">{vaccine.stock?.dosesPerBottle || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Total Doses")}</span>
                      <span className="card-value">{vaccine.stock?.totalDoses || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Bottle Price")}</span>
                      <span className="card-value">{vaccine.pricing?.bottlePrice || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Dose Price")}</span>
                      <span className="card-value">{vaccine.pricing?.dosePrice || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Booster Dose")}</span>
                      <span className="card-value">{vaccine.BoosterDose || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Annual Dose")}</span>
                      <span className="card-value">{vaccine.AnnualDose || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("Expiry Date")}</span>
                      <span className="card-value">
                        {vaccine.expiryDate
                          ? new Date(vaccine.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => editVaccine(vaccine._id)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleClick(vaccine._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("No vaccines found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("Vaccine Name")}</th>
                  <th className="text-center">{t("Bottles")}</th>
                  <th className="text-center">{t("Doses Per Bottle")}</th>
                  <th className="text-center">{t("Total Doses")}</th>
                  <th className="text-center">{t("Bottle Price")}</th>
                  <th className="text-center">{t("Dose Price")}</th>
                  <th className="text-center">{t("Booster Dose")}</th>
                  <th className="text-center">{t("Annual Dose")}</th>
                  <th className="text-center">{t("Expiry Date")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {vaccines.length > 0 ? (
                  vaccines.map((vaccine, index) => (
                    <tr key={vaccine._id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {vaccine.vaccineType?.image && (
                            <img
                              src={`https://api.mazraaonline.com/${vaccine.vaccineType.image.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt={
                                i18n.language === "ar"
                                  ? vaccine.vaccineType.arabicName
                                  : vaccine.vaccineType.englishName
                              }
                              width="50"
                              height="50"
                              className="mb-2"
                              style={{
                                borderRadius: "5px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                            />
                          )}
                          <strong>
                            {vaccine.vaccineType
                              ? i18n.language === "ar"
                                ? vaccine.vaccineType.arabicName
                                : vaccine.vaccineType.englishName
                              : vaccine.otherVaccineName || t("N/A")}
                          </strong>
                          <small className="text-muted">
                            {vaccine.vaccineType
                              ? i18n.language === "ar"
                                ? vaccine.vaccineType.arabicDiseaseType
                                : vaccine.vaccineType.englishDiseaseType
                              : ""}
                          </small>
                        </div>
                      </td>
                      <td className="text-center">{vaccine.stock?.bottles || "N/A"}</td>
                      <td className="text-center">{vaccine.stock?.dosesPerBottle || "N/A"}</td>
                      <td className="text-center">{vaccine.stock?.totalDoses || "N/A"}</td>
                      <td className="text-center">{vaccine.pricing?.bottlePrice || "N/A"}</td>
                      <td className="text-center">{vaccine.pricing?.dosePrice || "N/A"}</td>
                      <td className="text-center">{vaccine.BoosterDose || "N/A"}</td>
                      <td className="text-center">{vaccine.AnnualDose || "N/A"}</td>
                      <td className="text-center">
                        {vaccine.expiryDate
                          ? new Date(vaccine.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => editVaccine(vaccine._id)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleClick(vaccine._id)}
                          title={t("delete")}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center no-data">
                      {t("No vaccines found")}
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

export default VaccineTable;