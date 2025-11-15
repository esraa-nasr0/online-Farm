import { useContext, useEffect, useState } from "react";
import { Feedcontext } from "../../Context/FeedContext";
import { Rings } from "react-loader-spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./FeedingTable.css"; // سيتم إنشاء هذا الملف

function FeedingTable() {
  const navigate = useNavigate();
  const { getAllFeed, Deletfeed } = useContext(Feedcontext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ name: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  const fetchFeedData = async () => {
    setIsLoading(true);
    try {
      const filters = {
        type: searchCriteria.type,
        name: searchCriteria.name,
      };

      const response = await getAllFeed(currentPage, itemsPerPage, filters);

      if (response?.data?.feeds) {
        const totalFeeds = response.pagination?.total ?? response.data.feeds.length;
        setPagination({
          total: totalFeeds,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(totalFeeds / itemsPerPage),
        });
        setFeedData(response.data.feeds);
      } else {
        setPagination({
          total: 0,
          page: 1,
          limit: itemsPerPage,
          totalPages: 1,
        });
        setFeedData([]);
      }
    } catch (error) {
      console.error("Error fetching feed data:", error);
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedData();
  };

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
          setFeedData(feedData.filter((feed) => feed._id !== id));
          Swal.fire(t("deleted"), t("feed_deleted_success"), "success");
        } catch (error) {
          Swal.fire(t("error"), t("delete_feed_error"), "error");
        }
      }
    });
  };

  const Editfeed = (id) => {
    navigate(`/editfeed/${id}`);
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
        <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
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
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#21763e"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className={`feed-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="feed-info">
              <h2 className="feed-title">{t("feed_records")}</h2>
              <p className="feed-subtitle">{t("manage_feeds")}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_feed")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="feedTypeInput" className="search-label">
                  {t("feed_type")}
                </label>
                <input
                  type="text"
                  id="feedTypeInput"
                  className="search-input"
                  placeholder={t("search_type_placeholder")}
                  value={searchCriteria.type}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, type: e.target.value })
                  }
                />
              </div>
              <div className="search-field">
                <label htmlFor="feedNameInput" className="search-label">
                  {t("feed_name")}
                </label>
                <input
                  type="text"
                  id="feedNameInput"
                  className="search-input"
                  placeholder={t("search_name_placeholder")}
                  value={searchCriteria.name}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, name: e.target.value })
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
                <div key={item._id} className="feed-card">
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">#</span>
                      <span className="card-value">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("feed_name")}</span>
                      <span className="card-value">{item.name}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("feed_type")}</span>
                      <span className="card-value">{item.type}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("price_per_ton")}</span>
                      <span className="card-value">{item.price}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">{t("dry_matter_concentration")}</span>
                      <span className="card-value">{item.concentrationOfDryMatter}</span>
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
                  <th className="text-center">{t("feed_name")}</th>
                  <th className="text-center">{t("feed_type")}</th>
                  <th className="text-center">{t("price_per_ton")}</th>
                  <th className="text-center">{t("dry_matter_concentration")}</th>
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
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">{item.type}</td>
                      <td className="text-center">{item.price}</td>
                      <td className="text-center">{item.concentrationOfDryMatter}</td>
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
                    <td colSpan="6" className="text-center no-data">
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

export default FeedingTable;