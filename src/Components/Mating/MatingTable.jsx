import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { MatingContext } from '../../Context/MatingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import UploadMatExcel from './UploadMatExcel';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../Vaccine/styles.css"

const NO_DATE = 'No Date';

function MatingTable() {
    const navigate = useNavigate();
    const { getMating, deleteMating } = useContext(MatingContext);
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const animalsPerPage = 10;
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        matingDate: '',
        sonarRsult: '',
        animalType: '',
        sonarDate: '',
        matingName: '',
        locationShed: '',
        entryType: ''
    });
    const [matings, setMatings] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1 }); 

    async function fetchMating() {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                matingDate: searchCriteria.matingDate,
                sonarRsult: searchCriteria.sonarRsult,
                animalType: searchCriteria.animalType,
                sonarDate: searchCriteria.sonarDate,
                matingName: searchCriteria.matingName,
                locationShed: searchCriteria.locationShed,
                entryType: searchCriteria.entryType
            };
            const { data } = await getMating(currentPage, animalsPerPage, filters);
            setMatings(data.data.mating);
            setPagination(data.pagination || { totalPages: 1 }); 
            const total = data.pagination?.totalPages || 1;
            setTotalPages(total); 
        } catch (error) {
            Swal.fire(t('error'), t('fetch_error'), 'error');
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
            setMatings((prevMatings) => prevMatings.filter((mating) => mating._id !== id));
            Swal.fire({
                icon: 'success',
                title: t('deleted'),
                text: t('mating_deleted'),
                timer: 1500
            });
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error.message || t('delete_failed')
            });
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: t('are_you_sure'),
            text: t('cannot_undo'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete'),
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

    // عرض أزرار الصفحات
    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination?.totalPages || 1; 
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

    const addMatingData = (newMatings) => {  
        setMatings((prevMatings) => {  
            const updatedMatings = [...prevMatings, ...newMatings];  
            localStorage.setItem('matings', JSON.stringify(updatedMatings)); // Update localStorage  
            return updatedMatings;  
        });  
        fetchMating(); // Reload data from the API  
    };

    // Helper function to get headers with token
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

    // Handle download template
    const handleDownloadTemplate = async () => {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/mating/downloadTemplate',
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
            link.setAttribute('download', 'mating_template.xlsx');
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

    // Handle export to Excel
    const handleExportToExcel = async () => {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/mating/export',
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
            link.setAttribute('download', 'matings.xlsx');
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

    // Handle import from Excel
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
                            - ${t('mating_date')}: YYYY-MM-DD
                        </p>
                    </div>
                `,
                icon: 'error'
            });
            return;
        }

        // Check file extension
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
                'https://farm-project-bbzj.onrender.com/api/mating/import',
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
                    text: t('matings_imported_successfully'),
                    icon: 'success'
                });
                // Refresh data if needed
                fetchMating();
            } else {
                throw new Error(response.data?.message || 'Import failed');
            }
        } catch (error) {
            console.error("Error details:", error);
            let errorMessage = t('failed_to_import_from_excel');
            let errorDetails = '';
            
            if (error.response?.data?.message) {
                const message = error.response.data.message;
                
                // Check if it's a date format error
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
            event.target.value = ''; // Reset file input
        }
    };

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    <div className="container mt-5">
                      

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
        <h2 className="vaccine-table-title">{t('Mating Records')}</h2>

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
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder={t('search_by_tag_id')}
            value={searchCriteria.tagId}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
        />
        </div>
        <div className="col-md-4">
         <select
            value={searchCriteria.animalType}
            className="form-select"
            onChange={(e) => setSearchCriteria({ ...searchCriteria, animalType: e.target.value })}
        >
            <option value="">{t('animal_type')}</option>
            <option value="goat">{t('goat')}</option>
            <option value="sheep">{t('sheep')}</option>
        </select>
        </div>
        <div className="col-md-4">
         <input
            type="text"
            className="form-control"
            placeholder={t('search_mating_date')}
            value={searchCriteria.matingDate}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, matingDate: e.target.value })}
        />
        </div>
        <div className="col-md-4">
            <input
            type="text"
            className="form-control"
            placeholder={t('search_sonar_result')}
            value={searchCriteria.sonarRsult}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarRsult: e.target.value })}
        />
        </div>
        <div className="col-md-4">
            <input
            type="text"
            className="form-control"
            placeholder={t('search_sonar_date')}
            value={searchCriteria.sonarDate}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarDate: e.target.value })}
        />
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
                                <th className=" bg-color">{t('female_tag_id')}</th>
                                <th className=" bg-color">{t('male_tag_id')}</th>
                                <th className=" bg-color">{t('mating_type')}</th>
                                <th className=" bg-color">{t('mating_date')}</th>
                                <th className=" bg-color">{t('sonar_date')}</th>
                                <th className=" bg-color">{t('sonar_result')}</th>
                                <th className=" bg-color">{t('expected_delivery_date')}</th>
                                <th className=" bg-color">{t('actions')}</th>

                                </tr>
                            </thead>
                            <tbody>
    {matings.length > 0 ? (
        matings.map((mating, index) => (
            <tr key={mating._id}>
                <th scope="row">{(currentPage - 1) * animalsPerPage + index + 1}</th>
                <td>{mating.tagId}</td>
                <td>{mating.maleTag_id}</td>
                <td>{mating.matingType}</td>
                <td>{mating.matingDate ? mating.matingDate.split('T')[0] : NO_DATE}</td>
                <td>{mating.sonarDate ? mating.sonarDate.split('T')[0] : NO_DATE}</td>
                <td>{mating.sonarRsult}</td>
                <td>{mating.expectedDeliveryDate ? mating.expectedDeliveryDate.split('T')[0] : NO_DATE}</td>
                <td className="text-center">
                    <button className="btn btn-link p-0 me-2" onClick={() => editMating(mating._id)} title={t('edit')} style={{ color:"#808080" }}>
                        <FaRegEdit />
                    </button>
                    <button className="btn btn-link p-0" style={{ color:"#808080" }} onClick={() => confirmDelete(mating._id)} title={t('delete')}>
                        <RiDeleteBinLine/>
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="9" className="text-center py-4 text-muted">{t('no_mating_records')}</td>
        </tr>
    )}
</tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {renderPaginationButtons()}
                            </ul>
                        </nav>
                    </div>
   
                </div>
            )}
        </>
    );
}

export default MatingTable;