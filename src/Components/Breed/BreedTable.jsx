import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "../../Context/LocationContext";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BreedContext } from "../../Context/BreedContext";
import "../Vaccine/styles.css";
import { useTranslation } from "react-i18next";

function BreedTable() {
  let navigate = useNavigate();
  const { getBreed, removeBreed } = useContext(BreedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [breed, setBreed] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const breedPerPage = 10;
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const { t } = useTranslation();

  async function fetchBreed() {
    setIsLoading(true);
    try {
      let { data } = await getBreed(currentPage, breedPerPage);
      setBreed(data.data.breeds);
      setPagination(data.pagination || { totalPages: 1 });
    } catch (error) {
      console.error(t('error_fetching_breed_data'), error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBreed();
  }, [currentPage]);

  const deleteItem = async (id) => {
    try {
      await removeBreed(id);
      setBreed((prev) => prev.filter((breed) => breed._id !== id));
      Swal.fire(t('deleted'), t('breed_has_been_deleted'), "success");
    } catch (error) {
      console.error(t('failed_to_delete_breed'), error);
      Swal.fire(t('error'), t('failed_to_delete_breed'), "error");
    }
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t('are_you_sure'),
      text: t('you_wont_be_able_to_revert_this'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t('yes_delete_it'),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  // Go to edit breed
  function editBreed(id) {
    navigate(`/editBreed/${id}`);
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
            &lt; {t('back')}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === total}
          >
            {t('next')} &gt;
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
          <h2 className="vaccine-table-title">{t('breed')}</h2>

          <div className="table-responsive">
            <div className="full-width-table">
              <table className="table table-hover mt-5">
                <thead>
                  <tr>
                    <th className="text-center bg-color">#</th>
                    <th className="text-center bg-color">{t('breed_name')}</th>
                    <th className="text-center bg-color">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {breed.map((breeds, index) => (
                    <tr key={breeds._id}>
                      <td>{(currentPage - 1) * breedPerPage + index + 1}</td>
                      <td>{breeds.breedName}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-link p-0 me-2"
                          onClick={() => editBreed(breeds._id)}
                          title={t('edit')}
                          style={{ color: "#0f7e34ff" }}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn btn-link  p-0"
                          style={{ color:"#d33" }}
                          onClick={() => handleClick(breeds._id)}
                          title={t('delete')}
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

          <div className="d-flex justify-content-center mt-4">
            <nav>{renderModernPagination()}</nav>
          </div>
        </div>
      )}
    </>
  );
}

export default BreedTable;