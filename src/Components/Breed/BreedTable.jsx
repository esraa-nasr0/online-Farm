import React, { useContext, useEffect, useState } from "react";
import { BreedContext } from "../../Context/BreedContext";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BreedTable.css"; // سيتم إنشاء هذا الملف

function BreedTable() {
  let navigate = useNavigate();
  const { getBreed, removeBreed } = useContext(BreedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [breed, setBreed] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const breedPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  async function fetchBreed() {
    setIsLoading(true);
    try {
      let { data } = await getBreed(currentPage, breedPerPage);
      setBreed(data.data.breeds);
      setPagination(data.pagination || { totalPages: 1 });
    } catch (error) {
      console.error(t('error_fetching_breed_data'), error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBreed();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await removeBreed(id);
      setBreed((prev) => prev.filter((breed) => breed._id !== id));
      Swal.fire(t('deleted'), t('breed_has_been_deleted'), "success");
    } catch (error) {
      console.error(t('failed_to_delete_breed'), error);
      Swal.fire(t('error'), t('failed_to_delete_breed'), "error");
    }
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t('are_you_sure'),
      text: t('you_wont_be_able_to_revert_this'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t('yes_delete_it'),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  // Go to edit breed
  function editBreed(id) {
    navigate(`/editBreed/${id}`);
  }

  // Modern pagination rendering function
  const renderModernPagination = () => {
    const total = pagination.totalPages;
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; {t('back')}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === total}
          >
            {t('next')} &gt;
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
        <div className={`breed-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="breed-info">
              <h2 className="breed-title">{t('breed')}</h2>
              <p className="breed-subtitle">{t('manage_breeds')}</p>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {breed.map((breeds, index) => (
              <div key={breeds._id} className="breed-card">
                <div className="card-content">
                  <div className="card-row">
                    <span className="card-label">#</span>
                    <span className="card-value">
                      {(currentPage - 1) * breedPerPage + index + 1}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t('breed_name')}</span>
                    <span className="card-value">{breeds.breedName}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t('average_daily_gain')}</span>
                    <span className="card-value">
                      {breeds.standards?.adg !== null ? breeds.standards.adg : "-"}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t('feed_conversion_ratio')}</span>
                    <span className="card-value">
                      {breeds.standards?.fcr !== null ? breeds.standards.fcr : "-"}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t('birth_weight')}</span>
                    <span className="card-value">
                      {breeds.standards?.birthWeight !== null ? breeds.standards.birthWeight : "-"}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => editBreed(breeds._id)}
                    title={t('edit')}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleClick(breeds._id)}
                    title={t('delete')}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
            {breed.length === 0 && (
              <div className="no-data-mobile">
                {t("no_breeds_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t('breed_name')}</th>
                  <th className="text-center">{t('average_daily_gain')}</th>
                  <th className="text-center">{t('feed_conversion_ratio')}</th>
                  <th className="text-center">{t('birth_weight')}</th>
                  <th className="text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {breed.map((breeds, index) => (
                  <tr key={breeds._id}>
                    <td className="text-center">
                      {(currentPage - 1) * breedPerPage + index + 1}
                    </td>
                    <td className="text-center">{breeds.breedName}</td>
                    <td className="text-center">
                      {breeds.standards?.adg !== null ? breeds.standards.adg : "-"}
                    </td>
                    <td className="text-center">
                      {breeds.standards?.fcr !== null ? breeds.standards.fcr : "-"}
                    </td>
                    <td className="text-center">
                      {breeds.standards?.birthWeight !== null ? breeds.standards.birthWeight : "-"}
                    </td>
                    <td className="text-center action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => editBreed(breeds._id)}
                        title={t('edit')}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleClick(breeds._id)}
                        title={t('delete')}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
                {breed.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center no-data">
                      {t("no_breeds_found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <nav>{renderModernPagination()}</nav>
          </div>
        </div>
      )}
    </>
  );
}

export default BreedTable;