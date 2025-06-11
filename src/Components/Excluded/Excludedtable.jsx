import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { ExcludedContext } from '../../Context/ExcludedContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'; 
import axios from 'axios';
import "../Vaccine/styles.css"
const NO_DATE = 'No Date';

function formatDate(date) {
    if (!date) return NO_DATE;
    try {
        return new Date(date).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
        return NO_DATE;
    }
}

function ExcludedTable() {
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const { getExcluted, deleteExcluted } = useContext(ExcludedContext);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const excludedPerPage = 10;
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        excludedDate: '',
        animalType: '',
        locationShed: ''
    });
    const [excluded, setExcluded] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1 }); 

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

    async function fetchExcluded() {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                excludedDate: searchCriteria.excludedDate,
                animalType: searchCriteria.animalType,
                locationShed: searchCriteria.locationShed
            };
            const { data } = await getExcluted(currentPage, excludedPerPage, filters);
            setExcluded(data.data.excluded);
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
        fetchExcluded();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await deleteExcluted(id);
            setExcluded((prevExcluded) => prevExcluded.filter((item) => item._id !== id));
            Swal.fire({
                icon: 'success',
                title: t('deleted'),
                text: t('excluded_deleted'),
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

    const editExcluded = (id) => {
        navigate(`/editExcluded/${id}`);
    };

    const handleSearch = () => {
        setCurrentPage(1); 
        fetchExcluded();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    const handleDownloadTemplate = async () => {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/excluded/template',
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
            link.setAttribute('download', 'excluded_template.xlsx');
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
                'https://farm-project-bbzj.onrender.com/api/excluded/export',
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
            link.setAttribute('download', 'excluded_records.xlsx');
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
                            ${t('supported_formats')}: .xlsx, .xls
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
                'https://farm-project-bbzj.onrender.com/api/excluded/import',
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
                    text: t('excluded_records_imported_successfully'),
                    icon: 'success'
                });
                fetchExcluded();
            } else {
                throw new Error(response.data?.message || 'Import failed');
            }
        } catch (error) {
            console.error("Error details:", error);
            let errorMessage = t('failed_to_import_from_excel');
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                title: t('error'),
                html: `
                    <div>
                        <p>${errorMessage}</p>
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
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    <div className="container mt-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
                            <h2 className="vaccine-table-title">{t('Excluded Records')}</h2>
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
                                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))} 
                                    style={{ flex: 1 }} 
                                />
                            </div>
                            <div className="d-flex justify-content-end mb-3">
                                <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
                            </div>
                        </div>

                        <div className="table-responsive mt-4">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                    <th className="text-center bg-color">#</th>
                                    <th className="text-center bg-color"> {t("Tag Id")}</th>
                                    <th className="text-center bg-color">{t("Date")}</th>
                                    <th className="text-center bg-color">{t("Excluded Type")}</th>
                                    <th className="text-center bg-color">{t('excluded_reason')}</th>
                                    <th className="text-center bg-color">{t("Price")}</th>
                                    <th className="text-center bg-color">{t("Weight")}</th>
                                    <th className="text-center bg-color">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
    {excluded.length > 0 ? (
        excluded.map((item, index) => (
            <tr key={item._id}>
                <td className="text-center ">{(currentPage - 1) * excludedPerPage + index + 1}</td>
                <td className="text-center ">{item.tagId}</td>
                <td className="text-center ">{formatDate(item.Date)}</td>
                <td className="text-center ">{item.excludedType}</td>
                <td className="text-center ">{item.reasoneOfDeath ? item.reasoneOfDeath : "_"}</td>
                <td className="text-center ">{item.price ? item.price : "_"}</td>
                <td className="text-center ">{item.weight}</td>
                <td className="text-center">
                    <button className="btn btn-link p-0 me-2" onClick={() => editExcluded(item._id)}  title={t('edit')} style={{
                    color:"#808080"
                    }}><FaRegEdit /></button>
                    <button className="btn btn-link  p-0" style={{
                    color:"#808080"
                    }} onClick={() => confirmDelete(item._id)} title={t('delete')}  ><RiDeleteBinLine/></button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5" className="text-center py-4 text-muted">{t('no_excluded_records')}</td>
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
                </div>
            )}
        </>
    );
}

export default ExcludedTable;