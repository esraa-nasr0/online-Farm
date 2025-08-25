import React, { useContext, useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { AnimalContext } from "../../Context/AnimalContext";
import "../Vaccine/styles.css";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";

function AnimalCost() {
  const { costAnimal } = useContext(AnimalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [animalCost, setAnimalCost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({
    animalTagId: "",
  });
  const { t } = useTranslation();

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
    <div>
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
          <h2 className="vaccine-table-title">{t("animals_cost")}</h2>

          {/* 🔍 Filter Section */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_animals_cost")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="animalTagInput" className="form-label">
                  {t("animal_tag_id")}
                </label>
                <input
                  type="text"
                  id="animalTagInput"
                  className="form-control"
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

              <div className="col-12 d-flex justify-content-end mt-2">
                <button className="btn btn-success" onClick={handleSearch}>
                  <FiSearch /> {t("search")}
                </button>
              </div>
            </div>
          </div>

          {/* 📊 Table */}
          <div className="container mt-5 vaccine-table-container">
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("animal_tag_id")}</th>
                    <th className="text-center bg-color">{t("feed_cost")}</th>
                    <th className="text-center bg-color">
                      {t("treatment_cost")}
                    </th>
                    <th className="text-center bg-color">{t("vaccine_cost")}</th>
                    <th className="text-center bg-color">
                      {t("purchase_price")}
                    </th>
                    <th className="text-center bg-color">{t("market_value")}</th>
                    <th className="text-center bg-color">{t("date")}</th>
                    <th className="text-center bg-color">{t("total_cost")}</th>
                  </tr>
                </thead>
                <tbody>
                  {animalCost.length > 0 ? (
                    animalCost.map((item, index) => (
                      <tr key={index}>
                        <th className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </th>
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
                      <td colSpan="9" className="text-center">
                        {t("no_records_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 📄 Pagination */}
            <div className="d-flex justify-content-center mt-4">
              {renderModernPagination()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimalCost;
