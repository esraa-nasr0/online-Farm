import { useContext, useState, useEffect } from "react";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "../Vaccine/styles.css";

function TreatAnimalTable() {
  const { t } = useTranslation();
  const { getTreatmentByAnimal, deleteTreatmentByAnimal } =
    useContext(TreatmentContext);
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
        pageButtons.push(<li key="start-ellipsis">...</li>);
      }
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;
      for (let i = start; i <= end; i++) addPage(i);
      if (currentPage < totalPages - 2) {
        pageButtons.push(<li key="end-ellipsis">...</li>);
      }
      addPage(totalPages);
    }

    return (
      <ul className="pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
          >
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li
          className={`page-item${currentPage === totalPages ? " disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
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
        <div className="animal">
          <Rings height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className="container mt-4">
          <h2 className="vaccine-table-title">{t("treatment_by_animal")}</h2>

          {/* Filter Section */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_treatments")}
            </h6>

            <div className="row g-2 mt-3 mb-3 align-items-end">
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="tagIdInput" className="form-label">
                  {t("tag_id")}
                </label>
                <input
                  type="text"
                  id="tagIdInput"
                  className="form-control"
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

              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="locationShedInput" className="form-label">
                  {t("location_shed")}
                </label>
                <input
                  type="text"
                  id="locationShedInput"
                  className="form-control"
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

              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="dateInput" className="form-label">
                  {t("date")}
                </label>
                <input
                  type="date"
                  id="dateInput"
                  className="form-control"
                  value={searchCriteria.date}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      date: e.target.value,
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

          {/* Table Section */}
          <div className="container mt-5 vaccine-table-container">
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("tag_id")}</th>
                    <th className="text-center bg-color">
                      {t("location_shed")}
                    </th>
                    <th className="text-center bg-color">
                      {t("treatment_name")}
                    </th>
                    <th className="text-center bg-color">
                      {t("volumePerAnimal")}
                    </th>
                    <th className="text-center bg-color">{t("date")}</th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {treatment.length > 0 ? (
                    treatment.map((item, index) => (
                      <tr key={item._id || index}>
                        <th className="text-center">
                          {(currentPage - 1) * TreatAnimalPerPage + index + 1}
                        </th>
                        <td className="text-center">{item.tagId}</td>
                        <td className="text-center">
                          {item.locationShed?.locationShedName ||
                            item.locationShed ||
                            "-"}
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
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => editTreatment(item._id)}
                            style={{ color: "#0f7e34ff" }}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => confirmDelete(item._id)}
                            style={{ color: "#d33" }}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        {t("no_treatments_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav>{renderModernPagination()}</nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TreatAnimalTable;
