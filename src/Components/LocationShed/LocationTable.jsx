import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../../Context/LocationContext";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "../Vaccine/styles.css";
import { useTranslation } from "react-i18next";
import { IoEyeOutline } from "react-icons/io5";
import "./LocationTable.css";

function LocationTable() {
  let navigate = useNavigate();
  const { getLocation, removeLocation } = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const locationPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  async function fetchShed() {
    setIsLoading(true);
    try {
      let { data } = await getLocation(currentPage, locationPerPage);
      setLocations(data.data.locationSheds);
      setPagination(data.pagination || { totalPages: 1 });
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchShed();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await removeLocation(id);
      setLocations((prev) => prev.filter((location) => location._id !== id));
      Swal.fire(t("deleted"), t("location_has_been_deleted"), "success");
    } catch (error) {
      console.error("Failed to delete Location:", error);
      Swal.fire(t("error"), t("failed_to_delete_location"), "error");
    }
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("you_wont_be_able_to_revert_this"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete_it"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  function editLocations(id) {
    navigate(`/editLocation/${id}`);
  }

  function veiwLocations(id) {
    navigate(`/detailsLocation/${id}`);
  }

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
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => setCurrentPage(currentPage + 1)}
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
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#21763e"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className={`location-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="shed-info">
              <h2 className="shed-title">{t("location_shed")}</h2>
              <p className="shed-subtitle">{t("manage_location_sheds")}</p>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {locations.map((location, index) => (
              <div key={location._id} className="location-card">
                <div className="card-content">
                  <div className="card-row">
                    <span className="card-label">#</span>
                    <span className="card-value">
                      {(currentPage - 1) * locationPerPage + index + 1}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("location_shed_name")}</span>
                    <span className="card-value">{location.locationShedName}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-view"
                    onClick={() => veiwLocations(location._id)}
                    title={t("view")}
                  >
                    <IoEyeOutline />
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => editLocations(location._id)}
                    title={t("edit")}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleClick(location._id)}
                    title={t("delete")}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
            {locations.length === 0 && (
              <div className="no-data-mobile">
                {t("no_locations_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("location_shed_name")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location, index) => (
                  <tr key={location._id}>
                    <td className="text-center">
                      {(currentPage - 1) * locationPerPage + index + 1}
                    </td>
                    <td className="text-center">{location.locationShedName}</td>
                    <td className="text-center action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => veiwLocations(location._id)}
                        title={t("view")}
                      >
                        <IoEyeOutline />
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => editLocations(location._id)}
                        title={t("edit")}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleClick(location._id)}
                        title={t("delete")}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center no-data">
                      {t("no_locations_found")}
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

export default LocationTable;