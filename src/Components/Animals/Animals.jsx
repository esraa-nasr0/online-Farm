import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import { AnimalContext } from "../../Context/AnimalContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnimalStatistics from "./AnimalStatistics";
import axios from "axios";
import { IoEyeOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { BreedContext } from "../../Context/BreedContext";
import "./Animals.css"; // سيتم إنشاء هذا الملف

export default function Animals() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { removeAnimals, getAnimals } = useContext(AnimalContext);
  const isRTL = i18n.language === "ar";

  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTagId, setSearchTagId] = useState("");
  const [searchAnimalType, setSearchAnimalType] = useState("");
  const [searchLocationShed, setSearchLocationShed] = useState("");
  const [searchBreed, setSearchBreed] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const { BreedMenue } = useContext(BreedContext);
  const [breeds, setBreeds] = useState([]);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const { data } = await BreedMenue();
        if (data.status === "success" && Array.isArray(data.data.breeds)) {
          setBreeds(data.data.breeds);
        }
      } catch {
        setError("Failed to load breeds data");
      }
    };
    fetchBreed();
  }, [BreedMenue]);

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/animal/downloadAnimalTemplate",
        {
          responseType: "blob",
          headers: {
            ...headers,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (
        response.data.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        throw new Error("Invalid file type received");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "animal_template.xlsx");
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
      const response = await axios.get(
        "https://farm-project-bbzj.onrender.com/api/animal/exportAnimalsToExcel",
        {
          responseType: "blob",
          headers,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "animals.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire(t("error"), t("failed_to_export_to_excel"), "error");
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
                            ${t("date_format_note")}:<br/>
                            - ${t("birth_date")}: YYYY-MM-DD<br/>
                            - ${t("purchase_date")}: YYYY-MM-DD
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
        "https://farm-project-bbzj.onrender.com/api/animal/import",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.status === "success") {
        await fetchAnimals();
        Swal.fire({
          title: t("success"),
          text: t("animals_imported_successfully"),
          icon: "success",
        });
      } else {
        throw new Error(response.data?.message || "Import failed");
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = t("failed_to_import_from_excel");
      let errorDetails = "";

      if (error.response?.data?.message) {
        const message = error.response.data.message;

        if (message.includes("Invalid date format in row")) {
          const row = message.match(/row (\d+)/)?.[1] || "";
          errorMessage = t("date_format_error");
          errorDetails = `
                        <p style="margin-top: 10px; color: #666;">
                            ${t("error_in_row")}: ${row}<br/>
                            ${t("correct_date_format")}: YYYY-MM-DD<br/>
                            ${t("example")}: 2024-03-20
                        </p>
                        <p style="margin-top: 10px; color: #666;">
                            ${t("please_check_dates")}:
                            <ul style="text-align: left; margin-top: 5px;">
                                <li>${t("birth_date")}</li>
                                <li>${t("purchase_date")}</li>
                            </ul>
                        </p>
                    `;
        } else {
          errorMessage = message;
        }
      }

      Swal.fire({
        title: t("error"),
        html: `
                    <div>
                        <p>${errorMessage}</p>
                        ${errorDetails}
                    </div>
                `,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const removeItem = async (id) => {
    try {
      await removeAnimals(id);
      setAnimals((prevAnimals) =>
        prevAnimals.filter((animal) => animal._id !== id)
      );
      Swal.fire(t("deleted"), t("animal_deleted"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_delete_animal"), "error");
    }
  };

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      const filters = {
        tagId: searchTagId,
        animalType: searchAnimalType,
        breed: searchBreed,
        locationShed: searchLocationShed,
        gender: searchGender,
      };

      const { data } = await getAnimals(currentPage, animalsPerPage, filters);
      setAnimals(data.data.animals);
      setPagination(data.pagination);
      const total = data.pagination.totalPages;
      setTotalPages(total);
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_fetch_data"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [currentPage]);

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
      if (result.isConfirmed) {
        removeItem(id);
      }
    });
  };

  const editAnimal = (id) => {
    navigate(`/editAnimal/${id}`);
  };

  const viewAnimal = (id) => {
    navigate(`/viewDetailsofAnimal/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAnimals();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Modern pagination rendering function
  const renderModernPagination = () => {
    const total = pagination.totalPages || 1;
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
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === total}
          >
            {t("Next")} &gt;
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
        <div className={`animal-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="animal-info">
              <h2 className="animal-title">{t("animals")}</h2>
              <p className="animal-subtitle">{t("manage_animals")}</p>
            </div>
          </div>

          <div className="statistics-section">
            <AnimalStatistics />
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h6 className="search-title">{t("filter_animals")}</h6>

            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="tagIdInput" className="search-label">
                  {t("tag_id")}
                </label>
                <input
                  type="text"
                  className="search-input"
                  id="tagIdInput"
                  placeholder={t("search_by_tag_id")}
                  value={searchTagId}
                  onChange={(e) => setSearchTagId(e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="animalTypeInput" className="search-label">
                  {t("animal_type")}
                </label>
                <select
                  className="search-input"
                  id="animalTypeInput"
                  value={searchAnimalType}
                  onChange={(e) => setSearchAnimalType(e.target.value)}
                >
                  <option value="">{t("select_animal_type")}</option>
                  <option value="goat">{t("goat")}</option>
                  <option value="sheep">{t("sheep")}</option>
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="locationShedInput" className="search-label">
                  {t("location_shed")}
                </label>
                <input
                  type="text"
                  className="search-input"
                  id="locationShedInput"
                  placeholder={t("search_by_location_shed")}
                  value={searchLocationShed}
                  onChange={(e) => setSearchLocationShed(e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="breedInput" className="search-label">
                  {t("breed")}
                </label>
                <select
                  className="search-input"
                  id="breedInput"
                  value={searchBreed}
                  onChange={(e) => setSearchBreed(e.target.value)}
                >
                  <option value="">{t("select_breed")}</option>
                  {breeds.map((breed) => (
                    <option key={breed._id} value={breed._id}>
                      {breed.breedName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="genderInput" className="search-label">
                  {t("gender")}
                </label>
                <select
                  className="search-input"
                  id="genderInput"
                  value={searchGender}
                  onChange={(e) => setSearchGender(e.target.value)}
                >
                  <option value="">{t("select_gender")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="male">{t("male")}</option>
                </select>
              </div>

              <div className="search-button">
                <button className="btn-search" onClick={handleSearch}>
                  <FiSearch /> {t("search")}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="action-buttons-container">
            <div className="action-buttons">
              <button
                className="btn-export"
                onClick={handleExportToExcel}
                title={t("export_all_data")}
              >
                <i className="fas fa-download me-1"></i> {t("export_all_data")}
              </button>
              <button
                className="btn-template"
                onClick={handleDownloadTemplate}
                title={t("download_template")}
              >
                <i className="fas fa-file-arrow-down me-1"></i> {t("download_template")}
              </button>
              <label
                className="btn-import"
                title={t("import_from_excel")}
              >
                <i className="fas fa-file-import me-1"></i> {t("import_from_excel")}
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={handleImportFromExcel}
                />
              </label>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {animals.map((animal, index) => (
              <div key={`${animal.id || animal._id}-${index}`} className="animal-card">
                <div className="card-content">
                  <div className="card-row">
                    <span className="card-label">#</span>
                    <span className="card-value">
                      {(currentPage - 1) * animalsPerPage + index + 1}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("tag_id")}</span>
                    <span className="card-value">{animal.tagId}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("animal_type")}</span>
                    <span className="card-value">{animal.animalType}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("breed")}</span>
                    <span className="card-value">
                      {animal.breed?.breedName || animal.breed || "-"}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("location_shed")}</span>
                    <span className="card-value">
                      {animal.locationShed?.locationShedName || animal.locationShed || "-"}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t("gender")}</span>
                    <span className="card-value">{animal.gender}</span>
                  </div>
                  <div className="card-actions">
                  <button
                    className="btn-view"
                    onClick={() => viewAnimal(animal._id)}
                    title={t("view")}
                  >
                    <IoEyeOutline />
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => editAnimal(animal._id)}
                    title={t("edit")}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleClick(animal.id || animal._id)}
                    title={t("delete")}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
                </div>
                
              </div>
            ))}
            {animals.length === 0 && (
              <div className="no-data-mobile">
                {t("no_animals_found")}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("tag_id")}</th>
                  <th className="text-center">{t("animal_type")}</th>
                  <th className="text-center">{t("breed")}</th>
                  <th className="text-center">{t("location_shed")}</th>
                  <th className="text-center">{t("gender")}</th>
                  <th className="text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal, index) => (
                  <tr key={`${animal.id || animal._id}-${index}`}>
                    <td className="text-center">
                      {(currentPage - 1) * animalsPerPage + index + 1}
                    </td>
                    <td className="text-center">{animal.tagId}</td>
                    <td className="text-center">{animal.animalType}</td>
                    <td className="text-center">
                      {animal.breed?.breedName || animal.breed || "-"}
                    </td>
                    <td className="text-center">
                      {animal.locationShed?.locationShedName || animal.locationShed || "-"}
                    </td>
                    <td className="text-center">{animal.gender}</td>
                    <td className="text-center action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => viewAnimal(animal._id)}
                        title={t("view")}
                      >
                        <IoEyeOutline />
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => editAnimal(animal._id)}
                        title={t("edit")}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleClick(animal.id || animal._id)}
                        title={t("delete")}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
                {animals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center no-data">
                      {t("no_animals_found")}
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