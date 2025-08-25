import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Feedcontext } from "../../Context/FeedContext";
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";

function FodderTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getFodder, deleteFodder } = useContext(Feedcontext);

  const [fodder, setFodder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchFodder = async () => {
    setIsLoading(true);
    try {
      const filters = { name: searchCriteria.name };
      const { data } = await getFodder(currentPage, itemsPerPage, filters);

      setFodder(data?.data?.fodders || []);
      setPagination(data?.pagination || { totalPages: 1 });
    } catch (error) {
      Swal.fire("Error", t("fodder.fetch.error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFodder();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFodder();
  };

  const editFodder = (id) => {
    navigate(`/editFodder/${id}`);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("fodder.delete.confirmTitle"),
      text: t("fodder.delete.confirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#21763e",
      cancelButtonColor: "#d33",
      confirmButtonText: t("fodder.delete.confirmButton"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const deleteItem = async (id) => {
    try {
      await deleteFodder(id);
      setFodder((prev) => prev.filter((item) => item._id !== id));
      Swal.fire("Deleted!", t("fodder.delete.success"), "success");
    } catch {
      Swal.fire("Error", t("fodder.delete.error"), "error");
    }
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
        pageButtons.push(<li key="start-ellipsis">...</li>);
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        addPage(i);
      }

      if (currentPage < totalPages - 2) {
        pageButtons.push(<li key="end-ellipsis">...</li>);
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
        <div className="animal">
          <Rings height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className="container mt-4">
          <h2 className="vaccine-table-title">{t("fodder.title")}</h2>

          {/* Filters */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("fodder.filter")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="fodderNameInput" className="form-label">
                  {t("fodder.table.name")}
                </label>
                <input
                  type="text"
                  id="fodderNameInput"
                  className="form-control"
                  placeholder={t("fodder.searchPlaceholder")}
                  value={searchCriteria.name}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      name: e.target.value,
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
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">
                      {t("fodder.table.name")}
                    </th>
                    <th className="text-center bg-color">
                      {t("fodder.table.components")}
                    </th>
                    <th className="text-center bg-color">
                      {t("fodder.table.totalQuantity")}
                    </th>
                    <th className="text-center bg-color">
                      {t("fodder.table.totalPrice")}
                    </th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {fodder.length > 0 ? (
                    fodder.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-center">{item.name}</td>
                        <td className="text-center">
                          {item.components
                            .map((comp) => `${comp.quantity}`)
                            .join(", ")}
                        </td>
                        <td className="text-center">{item.totalQuantity}</td>
                        <td className="text-center">{item.totalPrice}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            style={{ color: "#0f7e34ff" }}
                            onClick={() => editFodder(item._id)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#d33" }}
                            onClick={() => confirmDelete(item._id)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {t("fodder.table.noData")}
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

export default FodderTable;
