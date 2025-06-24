import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "../../Context/LocationContext";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "../Vaccine/styles.css";
import { useTranslation } from "react-i18next";

function LocationTable() {
  let navigate = useNavigate();
  const { getLocation, removeLocation } = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const locationPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const { t } = useTranslation();

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

  // التوجه لتعديل الموقع
  function editLocations(id) {
    navigate(`/editLocation/${id}`);
  }

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
        <div className="container mt-5 vaccine-table-container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
            <h2 className="vaccine-table-title">{t("location_shed")}</h2>

            {/* 
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-dark" onClick={handleExportToExcel} title={t('export_all_data')}>
            <i className="fas fa-download me-1"></i> {t('export_all_data')}
          </button>
          <button className="btn btn-success" onClick={handleDownloadTemplate} title={t('download_template')}>
            <i className="fas fa-file-arrow-down me-1"></i> {t('download_template')}
          </button>
          <label className="btn btn-dark  btn-outline-dark mb-0 d-flex align-items-center" style={{ cursor: 'pointer', color:"white" }} title={t('import_from_excel')}>
            <i className="fas fa-file-import me-1"></i> {t('import_from_excel')}
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleImportFromExcel} />
          </label>
        </div> */}
          </div>

          <div className="table-responsive">
            <div className="full-width-table">
              <table className="table table-hover mt-5">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">
                      {t("location_shed_name")}
                    </th>
                    <th className="text-center bg-color">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, index) => (
                    <tr key={location._id}>
                      <td>{(currentPage - 1) * locationPerPage + index + 1}</td>
                      <td>{location.locationShedName}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-link p-0 me-2"
                          onClick={() => editLocations(location._id)}
                          title={t("edit")}
                          style={{
                            color: "#808080",
                          }}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn btn-link p-0"
                          style={{
                            color: "#808080",
                          }}
                          onClick={() => handleClick(location._id)}
                          title={t("delete")}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <nav>{renderModernPagination()}</nav>
          </div>
        </div>
      )}
    </>
  );
}

export default LocationTable;
