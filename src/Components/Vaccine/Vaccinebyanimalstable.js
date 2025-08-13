import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Vaccinetableentriescontext } from '../../Context/Vaccinetableentriescontext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import axios from 'axios';
import "./styles.css";
import { RiDeleteBinLine } from "react-icons/ri";

if (typeof document !== 'undefined' && !document.getElementById('vaccine-modern-table-style')) {
  const style = document.createElement('style');
  style.id = 'vaccine-modern-table-style';
  document.head.appendChild(style);
}

function Vaccinebyanimaltable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getallVaccineanimalEntries, DeletVaccineanimal } = useContext(Vaccinetableentriescontext);
  const { getallVaccineanimal } = useContext(VaccineanimalContext);

  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: '',
    vaccineName: '',
    locationShed: '',
    entryType: ''
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

  const renderModernPagination = () => {
    const total = pagination.totalPages;
    const pageButtons = [];
    const maxButtons = 5;
    const addPage = (page) => {
        pageButtons.push(
            <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                <button className="page-link" onClick={() => paginate(page)}>{page}</button>
            </li>
        );
    };
    if (total <= maxButtons) {
        for (let i = 1; i <= total; i++) addPage(i);
    } else {
        addPage(1);
        if (currentPage > 3) {
            pageButtons.push(<li key="start-ellipsis" className="pagination-ellipsis">...</li>);
        }
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(total - 1, currentPage + 1);
        if (currentPage <= 3) end = 4;
        if (currentPage >= total - 2) start = total - 3;
        for (let i = start; i <= end; i++) {
            if (i > 1 && i < total) addPage(i);
        }
        if (currentPage < total - 2) {
            pageButtons.push(<li key="end-ellipsis" className="pagination-ellipsis">...</li>);
        }
        addPage(total);
    }
    return (
        <ul className="pagination">
            <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    &lt; {t('Back')}
                </button>
            </li>
            {pageButtons}
            <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
                    {t('Next')} &gt;
                </button>
            </li>
        </ul>
    );
  };

  const getItem = async () => {
    setIsLoading(true);
    try {
      const filters = {
        tagId: searchCriteria.tagId,
        vaccineName: searchCriteria.vaccineName,
        locationShed: searchCriteria.locationShed,
        entryType: searchCriteria.entryType
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

  const getHeaders = () => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      navigate('/login');
      throw new Error('No authorization token found');
    }
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
    };
  };

  const handleDownloadTemplate = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://farm-project-bbzj.onrender.com/api/vaccine/downloadTemplate',
        {
          responseType: 'blob',
          headers: {
            ...headers,
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vaccine_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      Swal.fire(t('error'), t('failed_to_download_template'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://farm-project-bbzj.onrender.com/api/vaccine/export',
        {
          responseType: 'blob',
          headers: {
            ...headers,
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vaccines.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire(t('error'), t('failed_to_export_to_excel'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        title: t('error'),
        html: `
          <div>
            <p>${t('please_select_file')}</p>
            <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
              ${t('date_format_note')}:<br/>
              - ${t('vaccine_date')}: YYYY-MM-DD
            </p>
          </div>
        `,
        icon: 'error'
      });
      return;
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      Swal.fire({
        title: t('error'),
        html: `
          <div>
            <p>${t('please_upload_valid_excel')}</p>
            <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
              ${t('supported_formats')}: .xlsx, .xls
            </p>
          </div>
        `,
        icon: 'error'
      });
      return;
    }

    const headers = getHeaders();
    const formData = new FormData();
    
    try {
      setIsLoading(true);
      formData.append('file', file);

      const response = await axios.post(
        'https://farm-project-bbzj.onrender.com/api/vaccine/import',
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data && response.data.status === 'success') {
        Swal.fire({
          title: t('success'),
          text: t('vaccines_imported_successfully'),
          icon: 'success'
        });
        getallVaccineanimal();
      } else {
        throw new Error(response.data?.message || 'Import failed');
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = t('failed_to_import_from_excel');
      let errorDetails = '';
      
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        
        if (message.includes('Invalid date format in row')) {
          const row = message.match(/row (\d+)/)?.[1] || '';
          errorMessage = t('date_format_error');
          errorDetails = `
            <p style="margin-top: 10px; color: #666;">
              ${t('error_in_row')}: ${row}<br/>
              ${t('correct_date_format')}: YYYY-MM-DD<br/>
              ${t('example')}: 2024-03-20
            </p>
          `;
        } else {
          errorMessage = message;
        }
      }

      Swal.fire({
        title: t('error'),
        html: `
          <div>
            <p>${errorMessage}</p>
            ${errorDetails}
          </div>
        `,
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
      event.target.value = ''; 
    }
  };

  return (
    isLoading ? (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
        <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
      </div>
    ) : (
      <div className="container mt-5 vaccine-table-container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
          <h2 className="vaccine-table-title">{t('Vaccines')}</h2>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-dark" onClick={handleExportToExcel} title={t('export_all_data')}>
              <i className="fas fa-download me-1"></i> {t('export_all_data')}
            </button>
            <button className="btn btn-success" onClick={handleDownloadTemplate} title={t('download_template')}>
              <i className="fas fa-file-arrow-down me-1"></i> {t('download_template')}
            </button>
            <label className="btn btn-dark btn-outline-dark mb-0 d-flex align-items-center" style={{ cursor: 'pointer', color:"white" }} title={t('import_from_excel')}>
              <i className="fas fa-file-import me-1"></i> {t('import_from_excel')}
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleImportFromExcel} />
            </label>
          </div>
        </div>
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder={t('search_tag_id')}
              value={searchCriteria.tagId}
              onChange={e => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder={t('search_by_vaccine_name')}
              value={searchCriteria.vaccineName}
              onChange={e => setSearchCriteria(prev => ({ ...prev, vaccineName: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder={t('search_by_location_shed')}
              value={searchCriteria.locationShed}
              onChange={e => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))}
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
          </div>
        </div>
      
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead className='bg-color'>
              <tr className='bg-color'>  
                <th className="bg-color">{t('tag_id')}</th>
                <th className="bg-color">{t('vaccine_name')}</th>
                <th className="bg-color">{t('dose_price')}</th>
                <th className="bg-color">{t('Entry Type')}</th>
                <th className="bg-color">{t('date')}</th>
                <th className="bg-color">{t('location_shed')}</th>
                <th className="text-center bg-color">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
  {vaccines.length > 0 ? (
    vaccines.map(vaccine => (
      <tr key={vaccine._id}>
        <td>{vaccine.tagId}</td>
        <td>{vaccine.vaccine?.name || '--'}</td>
        <td>{vaccine.vaccine?.dosePrice ?? '--'}</td>
        <td>{vaccine.entryType}</td>
        <td>{new Date(vaccine.date).toLocaleDateString()}</td>
        <td>{vaccine.locationShed?.name || '--'}</td>
        <td className="text-center">
          <button
            className="btn btn-link p-0 me-2"
            onClick={() => editVaccine(vaccine._id)}
            title={t('edit')}
            style={{ color: "#808080" }}
          >
            <FaRegEdit />
          </button>
          <button
            className="btn btn-link p-0"
            style={{ color: "#ff4d4f" }}
            onClick={() => handleClick(vaccine._id)}
            title={t('delete')}
          >
            <RiDeleteBinLine />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-4 text-muted">
        {t('no_vaccine_records')}
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <nav>
            {renderModernPagination()}
          </nav>
        </div>
      </div>
    )
  );
}

export default Vaccinebyanimaltable;