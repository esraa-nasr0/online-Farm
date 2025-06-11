import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BreedingContext } from '../../Context/BreedingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../Vaccine/styles.css"

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
                    &lt; Back
                </button>
            </li>
            {pageButtons}
            <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
                    Next &gt;
                </button>
            </li>
        </ul>
    );
  };

  const handleDownloadExcel = async () => {
    const token = localStorage.getItem('Authorization');
    const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await axios.get(
        'https://farm-project-bbzj.onrender.com/api/breeding/downloadBreedingTemplate',
        {
          responseType: 'blob',
          headers: { Authorization: formattedToken },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'breeding_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file.');
    }
  };

  const handleExportTemplate = async () => {
 const token = localStorage.getItem('Authorization');
    const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await axios.get(
        'https://farm-project-bbzj.onrender.com/api/breeding/exportbreedingToExcel',
        {
          responseType: 'blob',
          headers: { Authorization: formattedToken },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'breeding_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file.');
    }
  };

  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('Authorization');
    const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('https://farm-project-bbzj.onrender.com/api/breeding/import', formData, {
        headers: {
          Authorization: formattedToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire(t("Success!"), t("Excel data uploaded successfully."), "success");
      getItem();
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire(t("Error!"), t("Failed to upload file."), "error");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
        </div>
      ) : (
        <div className='container mt-5 vaccine-table-container'>
          <div className='container'>
          

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
        <h2 className="vaccine-table-title"> {t("Breeding")}</h2>




        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-dark" onClick={handleExportTemplate} title={t('export_all_data')}>
            <i className="fas fa-download me-1"></i> {t('export_all_data')}
          </button>
          <button className="btn btn-success" onClick={handleDownloadExcel} title={t('download_template')}>
            <i className="fas fa-file-arrow-down me-1"></i> {t('download_template')}
          </button>
          <label className="btn btn-dark  btn-outline-dark mb-0 d-flex align-items-center" style={{ cursor: 'pointer', color:"white" }} title={t('import_from_excel')}>
            <i className="fas fa-file-import me-1"></i> {t('import_from_excel')}
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleUploadExcel}/>
          </label>
        </div>







      </div>
           

                  <div className="row g-2 mb-3">
        <div className="col-md-4">
                      <input type="text" className="form-control" value={searchCriteria.tagId} placeholder={t("Search Tag ID")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, tagId: e.target.value }))} />

        </div>
        <div className="col-md-4">
                       <input type="text" className="form-control" value={searchCriteria.deliveryDate} placeholder={t("Search Delivery Date")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, deliveryDate: e.target.value }))} />

        </div>
        <div className="col-md-4">
                      <input type="text" className="form-control" value={searchCriteria.animalType} placeholder={t("Search Animal Type")} onChange={(e) => setSearchCriteria((prev) => ({ ...prev, animalType: e.target.value }))} />

        </div>
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
      </div>
      </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className=" bg-color">#</th>
                  <th className=" bg-color">{t('Tag ID')}</th>
                  <th className=" bg-color">{t('Delivery State')}</th>
                  <th className=" bg-color">{t('Delivery Date')}</th>
                  <th className="text-center bg-color">{t('Birth Entries')}</th>
                  <th className=" bg-color">{t('Mothering Ability')}</th>
                  <th className=" bg-color">{t('Milking')}</th>
                   <th className=" bg-color">{t('actions')}</th>
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
                      {breeding.birthEntries?.length > 0 ? (
                        <ul className="list-group">
                          {breeding.birthEntries.map((entry, idx) => (
                            <li key={idx} className="list-group-item">
                              <strong>{t('Tag ID')}:</strong> {entry.tagId},
                              <strong> {t('Gender')}:</strong> {entry.gender},
                              <strong> {t('Birthweight')}:</strong> {entry.birthweight} kg
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">{t("No Birth Entries")}</span>
                      )}
                    </td>
                    <td>{breeding.motheringAbility || "--"}</td>
                    <td>{breeding.milking || "--"}</td>
                 

                        <td className="text-center">
                    
                                        <button className="btn btn-link p-0 me-2" onClick={() => editMating(breeding._id)} title={t('edit')} style={{
                                          color:"#808080"
                                        }}><FaRegEdit /></button>
                                        <button className="btn btn-link  p-0" style={{
                                          color:"#808080"
                                        }} onClick={() => handleClick(breeding._id)} title={t('delete')}  ><RiDeleteBinLine/></button>
                                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-center mt-4">
              <nav>
                {renderModernPagination()}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BreadingTable;
