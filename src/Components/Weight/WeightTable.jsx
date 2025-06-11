import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { WeightContext } from '../../Context/WeightContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../Vaccine/styles.css";

function WeightTable() {
    const navigate = useNavigate();
    const { getWeight, deleteWeight } = useContext(WeightContext);
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [weightsPerPage] = useState(10);
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        weightDate: '',
        animalType: '',
        locationShed: '',
        weightType: '',
        Date: ''
    });
    const [weights, setWeights] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function fetchWeights() {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                weightDate: searchCriteria.weightDate,
                animalType: searchCriteria.animalType,
                locationShed: searchCriteria.locationShed,
                weightType: searchCriteria.weightType,
                Date: searchCriteria.Date
            };
            const { data } = await getWeight(currentPage, weightsPerPage, filters);
            setWeights(data.data.weight);
            setPagination(data.pagination || { totalPages: 1 });
        } catch (error) {
            Swal.fire(t('error'), t('fetch_error'), 'error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchWeights();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await deleteWeight(id);
            setWeights((prevWeights) => prevWeights.filter((weight) => weight._id !== id));
            Swal.fire({
                icon: 'success',
                title: t('deleted'),
                text: t('weight_deleted'),
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

    const editWeight = (id) => {
        navigate(`/editWeight/${id}`);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchWeights();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderModernPagination = () => {
        const total = pagination?.totalPages || 1;
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
                        &lt; {t ? t('Back') : 'Back'}
                    </button>
                </li>
                {pageButtons}
                <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
                        {t ? t('Next') : 'Next'} &gt;
                    </button>
                </li>
            </ul>
        );
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
                'https://farm-project-bbzj.onrender.com/api/weight/downloadWeightTemplate',
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
            link.setAttribute('download', 'weight_template.xlsx');
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
                'https://farm-project-bbzj.onrender.com/api/weight/exportWeightsToExcel',
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
            link.setAttribute('download', 'weights.xlsx');
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
                            - ${t('weight_date')}: YYYY-MM-DD
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
                'https://farm-project-bbzj.onrender.com/api/weight/importWeightsFromExcel',
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
                    text: t('weights_imported_successfully'),
                    icon: 'success'
                });
                fetchWeights();
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
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    <div className="container mt-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
                            <h2 className="vaccine-table-title">{t('Weight Records')}</h2>
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
                                    placeholder={t('search_by_tag_id')}
                                    value={searchCriteria.tagId}
                                    onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('search_by_weight_type')}
                                    value={searchCriteria.weightType}
                                    onChange={(e) => setSearchCriteria({ ...searchCriteria, weightType: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('search_by_date')}
                                    value={searchCriteria.Date}
                                    onChange={(e) => setSearchCriteria({ ...searchCriteria, Date: e.target.value })}
                                />
                            </div>
                            <div className="d-flex justify-content-end mb-3">
                                <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th className="bg-color">#</th>
                                        <th className="bg-color">{t('tag_id')}</th>
                                        <th className="bg-color">{t('weight_type')}</th>
                                        <th className="bg-color">{t('weight')}</th>
                                        <th className="bg-color">{t('height')}</th>
                                        <th className="bg-color">{t('date')}</th>
                                        <th className="bg-color">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weights.length > 0 ? (
                                        weights.map((weight, index) => (
                                            <tr key={weight._id}>
                                                <td>{(currentPage - 1) * weightsPerPage + index + 1}</td>
                                                <td>{weight.tagId}</td>
                                                <td>{weight.weightType}</td>
                                                <td>{weight.weight}</td>
                                                <td>{weight.height}</td>
                                                <td>{weight.Date ? weight.Date.split('T')[0] : t('no_date')}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-link p-0 me-2" onClick={() => editWeight(weight._id)} title={t('edit')} style={{ color:"#808080" }}>
                                                        <FaRegEdit />
                                                    </button>
                                                    <button className="btn btn-link p-0" style={{ color:"#808080" }} onClick={() => confirmDelete(weight._id)} title={t('delete')}>
                                                        <RiDeleteBinLine/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4 text-muted">{t('no_weight_records')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            {renderModernPagination()}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

export default WeightTable;