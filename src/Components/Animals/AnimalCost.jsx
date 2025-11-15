import React, { useContext, useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { AnimalContext } from "../../Context/AnimalContext";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./AnimalCost.css"; // سيتم إنشاء هذا الملف

function AnimalCost() {
  const { costAnimal } = useContext(AnimalContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [animalCost, setAnimalCost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({
    animalTagId: "",
  });

  const getCostAnimal = async () => {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await costAnimal(currentPage, itemsPerPage, filters);
      setAnimalCost(data.data.animalCost || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching animal costs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getCostAnimal();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    getCostAnimal();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderModernPagination = () => {
    const total = totalPages;
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
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
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

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`animal-cost-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="animal-cost-info">
              <h2 className="animal-cost-title">{t("animals_cost")}</h2>
              <p className="animal-cost-subtitle">{t("manage_animals_cost")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_animals_cost")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="animalTagInput" className="search-label">
                  {t("animal_tag_id")}
                </label>
                <input
                  type="text"
                  id="animalTagInput"
                  className="search-input"
                  placeholder={t("search_by_tag_id")}
                  value={searchCriteria.animalTagId}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      animalTagId: e.target.value,
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
            {animalCost.length > 0 ? (
              animalCost.map((item, index) => (
                <div key={index} className="animal-cost-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("animal_tag_id")}</span>
                      <span className="card-value">{item.animalTagId}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("feed_cost")}</span>
                      <span className="card-value">{item.feedCost}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("treatment_cost")}</span>
                      <span className="card-value">{item.treatmentCost}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("vaccine_cost")}</span>
                      <span className="card-value">{item.vaccineCost}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("purchase_price")}</span>
                      <span className="card-value">{item.purchasePrice}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("market_value")}</span>
                      <span className="card-value">{item.marketValue}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("date")}</span>
                      <span className="card-value">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("total_cost")}</span>
                      <span className="card-value">{item.totalCost}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-mobile">
                {t("no_records_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("animal_tag_id")}</th>
                  <th className="text-center">{t("feed_cost")}</th>
                  <th className="text-center">{t("treatment_cost")}</th>
                  <th className="text-center">{t("vaccine_cost")}</th>
                  <th className="text-center">{t("purchase_price")}</th>
                  <th className="text-center">{t("market_value")}</th>
                  <th className="text-center">{t("date")}</th>
                  <th className="text-center">{t("total_cost")}</th>
                </tr>
              </thead>
              <tbody>
                {animalCost.length > 0 ? (
                  animalCost.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">{item.animalTagId}</td>
                      <td className="text-center">{item.feedCost}</td>
                      <td className="text-center">{item.treatmentCost}</td>
                      <td className="text-center">{item.vaccineCost}</td>
                      <td className="text-center">{item.purchasePrice}</td>
                      <td className="text-center">{item.marketValue}</td>
                      <td className="text-center">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="text-center">{item.totalCost}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center no-data">
                      {t("no_records_found")}
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

export default AnimalCost;