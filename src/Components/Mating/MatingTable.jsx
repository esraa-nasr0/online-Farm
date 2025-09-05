import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MatingContext } from "../../Context/MatingContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";

const NO_DATE = "No Date";

function MatingTable() {
  const navigate = useNavigate();
  const { getMating, deleteMating } = useContext(MatingContext);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMatings, setAllMatings] = useState([]);
  const [displayedMatings, setDisplayedMatings] = useState([]);
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    matingDate: "",
    sonarResult: "",
    animalType: "",
    sonarDate: "",
    matingName: "",
    locationShed: "",
    entryType: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  async function fetchMating() {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await getMating(currentPage, itemsPerPage, filters);

      setAllMatings(data.data.mating);
      setDisplayedMatings(data.data.mating);

      setPagination(
        data.data.pagination || {
          total: data.data.mating.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(data.data.mating.length / itemsPerPage),
        }
      );
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMating();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await deleteMating(id);
      setAllMatings((prev) => prev.filter((mating) => mating._id !== id));
      setDisplayedMatings((prev) => prev.filter((mating) => mating._id !== id));
      Swal.fire({
        icon: "success",
        title: t("deleted"),
        text: t("mating_deleted"),
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error.message || t("delete_failed"),
      });
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannot_undo"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const editMating = (id) => {
    navigate(`/editMating/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMating();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            onClick={() => paginate(currentPage - 1)}
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
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t("next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      navigate("/login");
      throw new Error("No authorization token found");
    }
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/mating/downloadTemplate",
        {
          responseType: "blob",
          headers: {
            ...headers,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mating_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_download_template"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/mating/export",
        {
          responseType: "blob",
          headers: {
            ...headers,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "matings.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromExcel = async (event) => {
    await importExcel(
      event,
      "https://farm-project-bbzj.onrender.com/api/mating/import",
      t("matings_imported_successfully"),
      t("failed_to_import_from_excel")
    );
  };

  const handleUpdateFromExcel = async (event) => {
    await importExcel(
      event,
      "https://farm-project-bbzj.onrender.com/api/mating/import?mode=update",
      t("matings_updated_successfully"),
      t("failed_to_update_from_excel")
    );
  };

  const importExcel = async (event, url, successMsg, failMsg) => {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        title: t("error"),
        text: t("please_select_file"),
        icon: "error",
      });
      return;
    }
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      Swal.fire({
        title: t("error"),
        text: t("please_upload_valid_excel"),
        icon: "error",
      });
      return;
    }
    const headers = getHeaders();
    const formData = new FormData();
    try {
      setIsLoading(true);
      formData.append("file", file);
      const response = await axios.post(url, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.status === "success") {
        Swal.fire({ title: t("success"), text: successMsg, icon: "success" });
        fetchMating();
      } else {
        throw new Error(response.data?.message || "Operation failed");
      }
    } catch (error) {
      Swal.fire({
        title: t("error"),
        text: error.response?.data?.message || failMsg,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
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
          <h2 className="vaccine-table-title">{t("Mating Records")}</h2>

          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_mating")}
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
                  placeholder={t("search_by_tag_id")}
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
                <label htmlFor="animalTypeInput" className="form-label">
                  {t("animal_type")}
                </label>
                <select
                  value={searchCriteria.animalType}
                  id="animalTypeInput"
                  className="form-select"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      animalType: e.target.value,
                    })
                  }
                >
                  <option value="">{t("animal_type")}</option>
                  <option value="goat">{t("goat")}</option>
                  <option value="sheep">{t("sheep")}</option>
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="matingDateInput" className="form-label">
                  {t("mating_date")}
                </label>
                <input
                  id="matingDateInput"
                  type="text"
                  className="form-control"
                  placeholder={t("search_mating_date")}
                  value={searchCriteria.matingDate}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      matingDate: e.target.value,
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

          <div className="container mt-5 vaccine-table-container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 mb-3">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={handleExportToExcel}
                >
                  <i className="fas fa-download me-1"></i>{" "}
                  {t("export_all_data")}
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleDownloadTemplate}
                >
                  <i className="fas fa-file-arrow-down me-1"></i>{" "}
                  {t("download_template")}
                </button>
                <label
                  className="btn btn-dark d-flex align-items-center"
                  style={{ color: "white" }}
                >
                  <i className="fas fa-file-import me-1"></i>{" "}
                  {t("import_from_excel")}
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleImportFromExcel}
                  />
                </label>
                <label
                  className="btn btn-warning d-flex align-items-center"
                  style={{ color: "white" }}
                >
                  <i className="fas fa-sync-alt me-1"></i>{" "}
                  {t("update_from_excel")}
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleUpdateFromExcel}
                  />
                </label>
              </div>
            </div>

            {/* Search */}

            {/* Table */}
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">
                      {t("female_tag_id")}
                    </th>
                    <th className="text-center bg-color">{t("male_tag_id")}</th>
                    <th className="text-center bg-color">{t("mating_type")}</th>
                    <th className="text-center bg-color">{t("mating_date")}</th>
                    <th className="text-center bg-color">{t("sonar_date")}</th>
                    <th className="text-center bg-color">
                      {t("sonar_result")}
                    </th>
                    <th className="text-center bg-color">
                      {t("expected_delivery_date")}
                    </th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMatings.length > 0 ? (
                    displayedMatings.map((mating, index) => (
                      <tr key={mating._id}>
                        <th className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </th>
                        <td className="text-center">{mating.tagId}</td>
                        <td className="text-center">{mating.maleTag_id}</td>
                        <td className="text-center">{mating.matingType}</td>
                        <td className="text-center">
                          {mating.matingDate
                            ? new Date(mating.matingDate).toLocaleDateString()
                            : NO_DATE}
                        </td>
                        <td className="text-center">
                          {mating.sonarDate
                            ? new Date(mating.sonarDate).toLocaleDateString()
                            : NO_DATE}
                        </td>
                        <td className="text-center">
                          {mating.sonarResult || "N/A"}
                        </td>
                        <td className="text-center">
                          {mating.expectedDeliveryDate
                            ? new Date(
                                mating.expectedDeliveryDate
                              ).toLocaleDateString()
                            : NO_DATE}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            style={{ color: "#0f7e34ff" }}
                            onClick={() => editMating(mating._id)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#ff4d4f" }}
                            onClick={() => confirmDelete(mating._id)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        {t("no_mating_records")}
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

export default MatingTable;
