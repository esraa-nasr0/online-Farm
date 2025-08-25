import { useContext, useEffect, useState } from "react";
import { Feedcontext } from "../../Context/FeedContext";
import { Rings } from "react-loader-spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "../Vaccine/styles.css";

function FeedingTable() {
  const navigate = useNavigate();
  const { getAllFeed, Deletfeed } = useContext(Feedcontext);
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ name: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const animalsPerPage = 10;
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedData = async () => {
    setIsLoading(true);
    try {
      const filters = {
        type: searchCriteria.type,
        name: searchCriteria.name,
      };

      const response = await getAllFeed(currentPage, animalsPerPage, filters);

      if (response?.data?.feeds) {
        const totalAnimals =
          response.pagination?.total ?? response.data.feeds.length;
        setTotalPages(Math.ceil(totalAnimals / animalsPerPage));
        setFeedData(response.data.feeds);
      } else {
        setTotalPages(1);
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
    const total = totalPages;
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
          <h2 className="vaccine-table-title">{t("feed_records")}</h2>

          {/* فلترة */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_feed")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="feedTypeInput" className="form-label">
                  {t("feed_type")}
                </label>
                <input
                  type="text"
                  id="feedTypeInput"
                  className="form-control"
                  placeholder={t("search_type_placeholder")}
                  value={searchCriteria.type}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, type: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="feedNameInput" className="form-label">
                  {t("feed_name")}
                </label>
                <input
                  type="text"
                  id="feedNameInput"
                  className="form-control"
                  placeholder={t("search_name_placeholder")}
                  value={searchCriteria.name}
                  onChange={(e) =>
                    setSearchCriteria({ ...searchCriteria, name: e.target.value })
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

          {/* جدول */}
          <div className="container mt-5 vaccine-table-container">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("feed_name")}</th>
                    <th className="text-center bg-color">{t("feed_type")}</th>
                    <th className="text-center bg-color">{t("price_per_ton")}</th>
                    <th className="text-center bg-color">
                      {t("dry_matter_concentration")}
                    </th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {feedData.length > 0 ? (
                    feedData.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-center">
                          {(currentPage - 1) * animalsPerPage + index + 1}
                        </td>
                        <td className="text-center">{item.name}</td>
                        <td className="text-center">{item.type}</td>
                        <td className="text-center">{item.price}</td>
                        <td className="text-center">
                          {item.concentrationOfDryMatter}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => Editfeed(item._id)}
                            title={t("edit")}
                            style={{ color: "#0f7e34ff" }}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#d33" }}
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
                      <td colSpan="6" className="text-center">
                        {t("no_records_found")}
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

export default FeedingTable;
