import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BreedingContext } from '../../Context/BreedingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function BreadingTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAllBreeding, deleteBreeding } = useContext(BreedingContext);
  const [breading, setBreading] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ tagId: '', animalType: '', deliveryDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [animalsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const getItem = async () => {
    setIsLoading(true);
    try {
      const filters = { tagId: searchCriteria.tagId, animalType: searchCriteria.animalType, deliveryDate: searchCriteria.deliveryDate };
      let { data } = await getAllBreeding(currentPage, animalsPerPage, filters);
      if (data?.breeding) {
        setBreading(data.breeding);
        if (data?.pagination) {
          setPagination(data.pagination);
          setTotalPages(data.pagination.totalPages || 1);
        }
      } else {
        setBreading([]);
      }
    } catch (error) {
      setBreading([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getItem();
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it!'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBreeding(id);
          setBreading(breading.filter((breeding) => breeding._id !== id));
          Swal.fire(t("Deleted!"), t("Your breeding has been deleted."), "success");
        } catch (error) {
          Swal.fire(t("Error!"), t("Failed to delete the breeding. Please try again."), "error");
        }
      }
    });
  };

  const editMating = (id) => {
    navigate(`/editbreading/${id}`);
  };

  useEffect(() => {
    getItem();
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const total = pagination.totalPages;
    for (let i = 1; i <= total; i++) {
      buttons.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => paginate(i)}>{i}</button>
        </li>
      );
    }
    return buttons;
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
        </div>
      ) : (
        <div>
          <div className='container'>
            <div className="title2">{t("Breeding")}</div>
            <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4" style={{ flexWrap: 'nowrap' }}>
              <input type="text" className="form-control" value={searchCriteria.tagId} placeholder={t("Search Tag ID")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, tagId: e.target.value }))} style={{ flex: '1' }} />
              <input type="text" className="form-control" value={searchCriteria.animalType} placeholder={t("Search Animal Type")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, animalType: e.target.value }))} style={{ flex: '1' }} />
              <input type="text" className="form-control" value={searchCriteria.deliveryDate} placeholder={t("Search Delivery Date")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, deliveryDate: e.target.value }))} style={{ flex: '1' }} />
              <button className="btn" onClick={handleSearch} style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <div className="full-width-table">
              <table className="table table-hover mt-3 p-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t('Tag ID')}</th>
                    <th>{t('Delivery State')}</th>
                    <th>{t('Delivery Date')}</th>
                    <th>{t('Birth Entries')}</th>
                    <th>{t('Mothering Ability')}</th>
                    <th>{t('Milking')}</th>
                    <th>{t('Edit')}</th>
                    <th>{t('Delete')}</th>
                  </tr>
                </thead>
                <tbody>
                  {breading.map((breeding, index) => (
                    <tr key={`${breeding._id}-${index}`}>
                      <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                      <td>{breeding.tagId}</td>
                      <td>{breeding.deliveryState}</td>
                      <td>{breeding.deliveryDate ? breeding.deliveryDate.split('T')[0] : t("No Date")}</td>
                      <td>
                        {breeding.birthEntries && breeding.birthEntries.length > 0 ? (
                          <ul className="list-group">
                            {breeding.birthEntries.map((entry, idx) => (
                              <li key={idx} className="list-group-item">
                                <strong>{t('Tag ID')}:</strong> {entry.tagId}, 
                                <strong>{t('Gender')}:</strong> {entry.gender}, 
                                <strong>{t('Birthweight')}:</strong> {entry.birthweight} kg
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted">{t("No Birth Entries")}</span>
                        )}
                      </td>
                      <td>{breeding.motheringAbility || "--"}</td>
                      <td>{breeding.milking || "--"}</td>
                      <td onClick={() => editMating(breeding._id)} style={{ cursor: 'pointer', color: "#198754" }}>
                        <FaRegEdit /> {t('Edit')}
                      </td>
                      <td onClick={() => handleClick(breeding._id)} className="text-danger" style={{ cursor: "pointer" }}>
                        <RiDeleteBin6Line /> {t('Remove')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">{renderPaginationButtons()}</ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BreadingTable;
