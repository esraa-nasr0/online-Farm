import  { useContext, useState, useEffect } from "react";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { Rings } from "react-loader-spinner";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {  RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../Vaccine/styles.css";
import axios from "axios";
import { FiSearch } from "react-icons/fi";


function TreatmentTable() {
  const { t } = useTranslation();
  const { getTreatment, deleteTreatment } = useContext(TreatmentContext);
  const [isLoading, setIsLoading] = useState(false);
  const [treatment, setTreatment] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [treatmentPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [pagination, setPagination] = useState({ totalPages: 1 });

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

  const fetchTreatment = async () => {
    setIsLoading(true);
    setError(null);

    const filters = {
      name: searchName,
      type: searchType,
    };

    try {
      const { data } = await getTreatment(
        currentPage,
        treatmentPerPage,
        filters
      );
      setTreatment(data?.data?.treatments || []);
      setPagination(data.pagination || {});
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_fetch_data"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts or when the page changes
  useEffect(() => {
    fetchTreatment();
  }, [currentPage]); // Only trigger fetch on page change

  const deleteItem = async (id) => {
    try {
      await deleteTreatment(id);
      setTreatment((prevTreatment) =>
        prevTreatment.filter((item) => item._id !== id)
      );
      Swal.fire(t("deleted"), t("treatment_deleted"), "success");
    } catch (error) {
      console.error("Failed to delete treatment:", error);
      Swal.fire(t("error"), t("failed_to_fetch_data"), "error");
    }
  };

  const editTreatment = (id) => {
    navigate(`/editTreatment/${id}`);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannot_revert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete_it"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            &lt; Back
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === total}
          >
            Next &gt;
          </button>
        </li>
      </ul>
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTreatment();
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/treatment/downloadTemplate",
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
      link.setAttribute("download", "treatment_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
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
        "https://farm-project-bbzj.onrender.com/api/treatment/export",
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
      link.setAttribute("download", "treatments.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        title: t("error"),
        html: `
                    <div>
                        <p>${t("please_select_file")}</p>
                        <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                            ${t("supported_formats")}: .xlsx, .xls
                        </p>
                    </div>
                `,
        icon: "error",
      });
      return;
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      Swal.fire({
        title: t("error"),
        html: `
                    <div>
                        <p>${t("please_upload_valid_excel")}</p>
                        <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                            ${t("supported_formats")}: .xlsx, .xls
                        </p>
                    </div>
                `,
        icon: "error",
      });
      return;
    }

    const headers = getHeaders();
    const formData = new FormData();

    try {
      setIsLoading(true);
      formData.append("file", file);

      const response = await axios.post(
        "https://farm-project-bbzj.onrender.com/api/treatment/import",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.status === "success") {
        Swal.fire({
          title: t("success"),
          text: t("treatments_imported_successfully"),
          icon: "success",
        });
        fetchTreatment();
      } else {
        throw new Error(response.data?.message || "Import failed");
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = t("failed_to_import_from_excel");

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: t("error"),
        html: `
                    <div>
                        <p>${errorMessage}</p>
                    </div>
                `,
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
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
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
                                <h2 className="vaccine-table-title">{t("Pharmacy")}</h2>
                                <div className="container mt-5 vaccine-table-container">
  <h6 className="mb-3 fw-bold custom-section-title">
    {t("filter_data")}
  </h6>

  <div className="row g-2 mt-3 mb-3 align-items-end">
    {/* Search by Name */}
    <div className="col-12 col-sm-6 col-md-3">
      <label htmlFor="searchNameInput" className="form-label">
        {t("name")}
      </label>
      <input
        type="text"
        id="searchNameInput"
        className="form-control"
        placeholder={t("search_by_name")}
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
    </div>

    {/* Search by Type */}
    <div className="col-12 col-sm-6 col-md-3">
      <label htmlFor="searchTypeInput" className="form-label">
        {t("type")}
      </label>
      <input
        type="text"
        id="searchTypeInput"
        className="form-control"
        placeholder={t("search_by_type")}
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      />
    </div>

    {/* Search Button */}
    <div className="col-12 d-flex justify-content-end mt-2">
      <button className="btn btn-success" onClick={handleSearch}>
        <FiSearch /> {t("search")}
      </button>
    </div>
  </div>
</div>


        <div className="container mt-5 vaccine-table-container">
          <div className="container mt-3">
            {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 mb-3">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={handleExportToExcel}
                  title={t("export_all_data")}
                >
                  <i className="fas fa-download me-1"></i>{" "}
                  {t("export_all_data")}
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleDownloadTemplate}
                  title={t("download_template")}
                >
                  <i className="fas fa-file-arrow-down me-1"></i>{" "}
                  {t("download_template")}
                </button>
                <label
                  className="btn btn-dark btn-outline-dark mb-0 d-flex align-items-center"
                  style={{ cursor: "pointer", color: "white" }}
                  title={t("import_from_excel")}
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
              </div>
            </div> */}

    
          </div>

          {error && <p className="text-danger mt-3">{error}</p>}

          <div className="table-responsive ">
            <div className="full-width-table">
              <table
                className="table align-middle mt-3"
                aria-label={t("treatment_table")}
              >
                <thead>
                  <tr>
                    <th scope="col" className="text-center bg-color">
                      #
                    </th>
                    <th scope="col" className="text-center bg-color">
                      {t("name")}
                    </th>
                    <th scope="col" className="text-center bg-color">
                      {t("type")}
                    </th>
                    <th scope="col" className="text-center bg-color">
                      {t("stock")}
                    </th>
                    <th scope="col" className="text-center bg-color">
                      {t("price")}
                    </th>
                    <th scope="col" className="text-center bg-color">
                      {t("expire_date")}
                    </th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {treatment.length > 0 ? (
                    treatment.map((item, index) => (
                      <tr key={item._id || index}>
                        <th scope="row">
                          {(currentPage - 1) * treatmentPerPage + index + 1}
                        </th>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>
                          <div>
                            <strong>{t("bottles")}:</strong>{" "}
                            {item.stock?.bottles}
                          </div>
                          <div>
                            <strong>{t("volumePerBottle")}:</strong>{" "}
                            {item.stock?.volumePerBottle}
                          </div>
                          <div>
                            <strong>{t("unitOfMeasure")}:</strong>{" "}
                            {item.stock?.unitOfMeasure}
                          </div>
                          <div>
                            <strong>{t("totalVolume")}:</strong>{" "}
                            {item.stock?.totalVolume}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{t("bottle_price")}:</strong>{" "}
                            {item.pricing?.bottlePrice} EGP
                          </div>
                          <div>
                            <strong>{t("dose_price")}:</strong>{" "}
                            {item.pricing?.dosePrice} EGP
                          </div>
                        </td>
                        
                        <td>
                          {new Date(item.expireDate).toLocaleDateString()}
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => editTreatment(item._id)}
                            title={t("edit")}
                            style={{ color: "#0f7e34ff" }}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-link  p-0"
                            style={{ color:"#d33" }}
                            onClick={() => confirmDelete(item._id)}
                            title={t("delete")}
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
          </div>

          <div className="d-flex justify-content-center mt-4">
            <nav>{renderModernPagination()}</nav>
          </div>
        </div>
        </div>
      )}
    </>
  );
}

export default TreatmentTable;
