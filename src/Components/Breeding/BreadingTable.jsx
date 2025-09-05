import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { BreedingContext } from "../../Context/BreedingContext";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";

const NO_DATE = "No Date";

function BreadingTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAllBreeding, deleteBreeding } = useContext(BreedingContext);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [breeding, setBreeding] = useState([]);
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: "",
    animalType: "",
    deliveryDate: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 1,
  });

  // تنسيق التاريخ للعرض داخل الـ chips
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const fetchBreeding = async () => {
    setIsLoading(true);
    try {
      const filters = { ...searchCriteria };
      const { data } = await getAllBreeding(currentPage, itemsPerPage, filters);

      setBreeding(data?.breeding || []);
      setPagination(
        data?.pagination || {
          total: data?.breeding?.length || 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil((data?.breeding?.length || 0) / itemsPerPage),
        }
      );
    } catch (error) {
      Swal.fire(t("error"), t("fetch_error"), "error");
      setBreeding([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannot_undo"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBreeding(id);
          setBreeding((prev) => prev.filter((item) => item._id !== id));
          Swal.fire(t("deleted"), t("breeding_deleted"), "success");
        } catch {
          Swal.fire(t("error"), t("delete_failed"), "error");
        }
      }
    });
  };

  const editBreeding = (id) => {
    navigate(`/editbreading/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBreeding();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      if (currentPage > 3)
        pageButtons.push(
          <li key="start-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) addPage(i);
      }

      if (currentPage < totalPages - 2)
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );

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
    if (!token) navigate("/login");
    return { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/breeding/downloadBreedingTemplate",
        { responseType: "blob", headers }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "breeding_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_download_template"), "error");
    }
  };

  const handleExportToExcel = async () => {
    const headers = getHeaders();
    try {
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/breeding/exportbreedingToExcel",
        { responseType: "blob", headers }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "breeding_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
    }
  };

  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const headers = getHeaders();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://farm-project-bbzj.onrender.com/api/breeding/import",
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      Swal.fire(t("success"), t("excel_uploaded_successfully"), "success");
      fetchBreeding();
    } catch {
      Swal.fire(t("error"), t("failed_to_upload_file"), "error");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="animal">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className="container mt-4">
          <h2 className="vaccine-table-title">{t("Breeding Records")}</h2>

          {/* Filters */}
          <div className="container mt-5 vaccine-table-container">
            <h6 className="mb-3 fw-bold custom-section-title">
              {t("filter_breeding")}
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
                    setSearchCriteria({ ...searchCriteria, tagId: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="animalTypeInput" className="form-label">
                  {t("animal_type")}
                </label>
                <select
                  id="animalTypeInput"
                  className="form-select"
                  value={searchCriteria.animalType}
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
                <label htmlFor="deliveryDateInput" className="form-label">
                  {t("delivery_date")}
                </label>
                <input
                  type="date"
                  id="deliveryDateInput"
                  className="form-control"
                  value={searchCriteria.deliveryDate}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      deliveryDate: e.target.value,
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

          {/* Excel Buttons */}
          <div className="container mt-5 vaccine-table-container">
            {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 mb-3">
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-outline-dark" onClick={handleExportToExcel}>
                  <i className="fas fa-download me-1"></i> {t("export_all_data")}
                </button>
                <button className="btn btn-success" onClick={handleDownloadTemplate}>
                  <i className="fas fa-file-arrow-down me-1"></i> {t("download_template")}
                </button>
                <label className="btn btn-dark d-flex align-items-center" style={{ color: "white" }}>
                  <i className="fas fa-file-import me-1"></i> {t("import_from_excel")}
                  <input type="file" hidden accept=".xlsx,.xls" onChange={handleImportFromExcel} />
                </label>
              </div>
            </div> */}

            {/* Table */}
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t("Tag ID")}</th>
                    <th className="text-center bg-color">{t("Delivery State")}</th>
                    <th className="text-center bg-color">{t("Delivery Date")}</th>
                    <th className="text-center bg-color">{t("Birth Entries")}</th>
                    <th className="text-center bg-color">{t("Mothering Ability")}</th>
                    <th className="text-center bg-color">{t("Milking")}</th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {breeding.length > 0 ? (
                    breeding.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-center">{item.tagId}</td>
                        <td className="text-center">{item.deliveryState}</td>
                        <td className="text-center">
                          {item.deliveryDate
                            ? new Date(item.deliveryDate).toLocaleDateString()
                            : NO_DATE}
                        </td>

                        {/* Birth Entries + Planned Weights */}
                        <td className="text-center">
                          {item.birthEntries?.length > 0 ? (
                            <ul className="list-group">
                              {item.birthEntries.map((entry, idx) => (
                                <li key={idx} className="list-group-item text-start">
                                  <div>
                                    <strong>{t("Tag ID")}:</strong> {entry.tagId},{" "}
                                    <strong>{t("Gender")}:</strong> {entry.gender},{" "}
                                    <strong>{t("Birthweight")}:</strong>{" "}
                                    {entry.birthweight} kg
                                  </div>

                                  {/* Planned Weights (read-only, styled) */}
                                  {Array.isArray(entry.plannedWeights) && entry.plannedWeights.length > 0 ? (
                                    <div className="planned-weights mt-2">
                                      <div className="pw-header">
                                        <label className="pw-title">
                                          {t("planned_weights") || "Planned weigh dates"}
                                        </label>
                                        <span className="pw-count">{entry.plannedWeights.length}</span>
                                      </div>

                                      <ul className="pw-chips">
                                        {entry.plannedWeights.map((d, i2) => (
                                          <li key={i2} className="pw-chip" title={`#${i2 + 1}`}>
                                            <span className="pw-index">#{i2 + 1}</span>
                                            <time dateTime={d}>{fmt(d)}</time>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <div className="planned-weights mt-2">
                                      <div className="pw-header">
                                        <label className="pw-title">
                                          {t("planned_weights") || "Planned weigh dates"}
                                        </label>
                                        <span className="pw-count">0</span>
                                      </div>
                                      <p className="text-muted m-0">
                                        {t("no_planned_weights") || "No planned weights."}
                                      </p>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted">{t("No Birth Entries")}</span>
                          )}
                        </td>

                        <td className="text-center">{item.motheringAbility || "--"}</td>
                        <td className="text-center">{item.milking || "--"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            style={{ color: "#0f7e34ff" }}
                            onClick={() => editBreeding(item._id)}
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
                      <td colSpan="8" className="text-center text-muted">
                        {t("no_data_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="d-flex justify-content-center mt-4">
                <nav>{renderModernPagination()}</nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BreadingTable;