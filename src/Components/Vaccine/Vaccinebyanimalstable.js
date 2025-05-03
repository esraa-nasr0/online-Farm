import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Vaccinetableentriescontext } from '../../Context/Vaccinetableentriescontext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function VaccineTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getallVaccineanimalEntries, DeletVaccineanimal } = useContext(Vaccinetableentriescontext);

  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: '',
    vaccineName: '',
    locationShed: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    getItem();
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("no_revert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yes_delete_it"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id);
      }
    });
  };

  const editVaccine = (id) => {
    navigate(`/editVaccineanimals/${id}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const total = pagination.totalPages;
    for (let i = 1; i <= total; i++) {
      buttons.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => paginate(i)}>
            {i}
          </button>
        </li>
      );
    }
    return buttons;
  };

  const getItem = async () => {
    setIsLoading(true);
    try {
      const filters = {
        tagId: searchCriteria.tagId,
        vaccineName: searchCriteria.vaccineName,
        locationShed: searchCriteria.locationShed,
        entryType:searchCriteria.entryType
      };

      const { data } = await getallVaccineanimalEntries(currentPage, animalsPerPage, filters);

      if (data?.entries?.length) {
        setVaccines(data.entries);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('no_data'),
          text: t('no_vaccine_records')
        });
        setVaccines([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('fetch_vaccine_failed')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getItem();
  };

  const deleteItem = async (id) => {
    try {
      const response = await DeletVaccineanimal(id);

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: t('deleted'),
          text: response.data.message || t('vaccine_deleted'),
          timer: 1500
        });
        setVaccines(prev => prev.filter(item => item._id !== id));
      } else {
        throw new Error('Failed to delete vaccine');
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: error.message || t('delete_failed')
      });
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}>
          <Rings height="100" width="100" color="#9cbd81" ariaLabel="loading-indicator" />
        </div>
      ) : (
        <>
          <div className='container'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4" style={{ marginTop: "140px" }}>
              <h2 className="bottom-line pb-2" style={{ color: "#778983" }}>{t('Vaccine Records')}</h2>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4 mb-4">
   
              <input
                type="text"
                className="form-control"
                value={searchCriteria.tagId}
                placeholder={t("search_tag_id")}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))}
              />
            <input
                            type="text"
                            className="form-control"
                            value={searchCriteria.locationShed}
                            placeholder= {t('search_by_location_shed')}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))}
                        /> 


<input
                type="text"
                className="form-control"
                value={searchCriteria.entryType}
                placeholder={t('Search Entry Type')}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, entryType: e.target.value }))}
              />
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
                    <th>{t('tag_id')}</th>
                    <th>{t('vaccine_name')}</th>
                    <th>{t('dose_price')}</th>
                    <th>{t('Entry Type')}</th>
                    <th>{t('date')}</th>
                    <th>{t('location_shed')}</th>
                    <th>{t('edit_vaccine')}</th>
                    <th>{t('remove_vaccine')}</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccines.length > 0 ? (
                    vaccines.map(vaccine => (
                      <tr key={vaccine._id}>
                        <td>{vaccine.tagId}</td>
                        <td>{vaccine.Vaccine?.vaccineName || '--'}</td>
                        <td>{vaccine.Vaccine?.pricing?.dosePrice || '--'}</td>
                        <td>{vaccine.entryType}</td>
                        <td>{new Date(vaccine.date).toLocaleDateString()}</td>
                        <td>{vaccine.locationShed?.locationShedName || '--'}</td>
                        <td onClick={() => editVaccine(vaccine._id)} style={{ cursor: 'pointer' }} className='text-success'>
                          <FaRegEdit /> {t('edit_vaccine')}
                        </td>
                        <td onClick={() => handleClick(vaccine._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                          <RiDeleteBin6Line /> {t('remove_vaccine')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">{t('no_vaccine_records')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                {renderPaginationButtons()}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

export default VaccineTable;
