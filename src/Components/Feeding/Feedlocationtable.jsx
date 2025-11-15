import { useContext, useEffect, useState } from "react";
import { Feedbylocationcontext } from "../../Context/FeedbylocationContext.jsx";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./FeedlocationTable.css"; // سيتم إنشاء هذا الملف

function FeedlocationTable() {
  const navigate = useNavigate();
  const { getAllfeeds, Deletfeed } = useContext(Feedbylocationcontext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    locationShed: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  const fetchFeedData = async () => {
    try {
      const filters = {
        locationShed: searchCriteria.locationShed,
        date: searchCriteria.date,
      };
      setIsLoading(true);
      const { data } = await getAllfeeds(currentPage, itemsPerPage, filters);
      setFeedData(data.data.feedShed || []);
      setPagination(
        data.data.pagination || {
          total: data.data.feedShed?.length || 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(
            (data.data.feedShed?.length || 0) / itemsPerPage
          ),
        }
      );
    } catch (error) {
      console.error("Error fetching feed data:", error);
      setFeedData([]);
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedData();
  };

  useEffect(() => {
    fetchFeedData();
  }, [currentPage]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: t("delete_confirmation_title"),
      text: t("delete_confirmation_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yes_delete_it"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Deletfeed(id);
          await fetchFeedData();
          Swal.fire(t("deleted"), t("feed_deleted_success"), "success");
        } catch (error) {
          console.error("Error deleting feedShed:", error);
          Swal.fire(t("error"), t("delete_feed_error"), "error");
        }
      }
    });
  };

  const Editfeed = (id) => {
    navigate(`/editfeedbylocation/${id}`);
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
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`feedlocation-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="feedlocation-info">
              <h2 className="feedlocation-title">{t("feed_by_location")}</h2>
              <p className="feedlocation-subtitle">{t("manage_feed_by_location")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_feed_by_location")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="locationInput" className="search-label">
                  {t("location_shed")}
                </label>
                <input
                  type="text"
                  id="locationInput"
                  className="search-input"
                  placeholder={t("search_location_placeholder")}
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
            {feedData.length > 0 ? (
              feedData.map((item, index) => (
                <div key={item._id} className="feedlocation-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("location_shed")}</span>
                      <span className="card-value">
                        {item.locationShed?.locationShedName ||
                          item.locationShed ||
                          "-"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("quantity")}</span>
                      <span className="card-value">
                        {item?.feeds?.[0]?.quantity || "N/A"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("date")}</span>
                      <span className="card-value">
                        {item.date ? item.date.split("T")[0] : "N/A"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("feed_name")}</span>
                      <span className="card-value">
                        {item?.feeds?.[0]?.feedName || "N/A"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("feed_price")}</span>
                      <span className="card-value">
                        {item?.feeds?.[0]?.feedPrice || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => Editfeed(item._id)}
                      title={t("edit")}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item._id)}
                      title={t("delete")}
                    >
                      <RiDeleteBinLine />
                    </button>
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
                  <th className="text-center">{t("location_shed")}</th>
                  <th className="text-center">{t("quantity")}</th>
                  <th className="text-center">{t("date")}</th>
                  <th className="text-center">{t("feed_name")}</th>
                  <th className="text-center">{t("feed_price")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {feedData.length > 0 ? (
                  feedData.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">
                        {item.locationShed?.locationShedName ||
                          item.locationShed ||
                          "-"}
                      </td>
                      <td className="text-center">
                        {item?.feeds?.[0]?.quantity || "N/A"}
                      </td>
                      <td className="text-center">
                        {item.date ? item.date.split("T")[0] : "N/A"}
                      </td>
                      <td className="text-center">
                        {item?.feeds?.[0]?.feedName || "N/A"}
                      </td>
                      <td className="text-center">
                        {item?.feeds?.[0]?.feedPrice || "N/A"}
                      </td>
                      <td className="text-center action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => Editfeed(item._id)}
                          title={t("edit")}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(item._id)}
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

export default FeedlocationTable;