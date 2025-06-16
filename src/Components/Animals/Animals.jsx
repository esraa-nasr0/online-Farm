import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Rings } from 'react-loader-spinner';
import { AnimalContext } from '../../Context/AnimalContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { useTranslation } from 'react-i18next';
import AnimalStatistics from './AnimalStatistics';
import axios from 'axios';
import "../Vaccine/styles.css";
import { IoEyeOutline } from "react-icons/io5";

export default function Animals() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { removeAnimals, getAnimals } = useContext(AnimalContext);

    const [animals, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [animalsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTagId, setSearchTagId] = useState('');
    const [searchAnimalType, setSearchAnimalType] = useState('');
    const [searchLocationShed, setSearchLocationShed] = useState('');
    const [searchBreed, setSearchBreed] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    const handleDownloadTemplate = async () => {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/animal/downloadAnimalTemplate',
                {
                    responseType: 'blob',
                    headers: {
                        ...headers,
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                }
            );

            if (response.data.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                throw new Error('Invalid file type received');
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'animal_template.xlsx');
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
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/animal/exportAnimalsToExcel',
                {
                    responseType: 'blob',
                    headers
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'animals.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            Swal.fire(t('error'), t('failed_to_export_to_excel'), 'error');
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
                            - ${t('birth_date')}: YYYY-MM-DD<br/>
                            - ${t('purchase_date')}: YYYY-MM-DD
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
                'https://farm-project-bbzj.onrender.com/api/animal/import',
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data && response.data.status === 'success') {
                await fetchAnimals();
                Swal.fire({
                    title: t('success'),
                    text: t('animals_imported_successfully'),
                    icon: 'success'
                });
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
                        <p style="margin-top: 10px; color: #666;">
                            ${t('please_check_dates')}:
                            <ul style="text-align: left; margin-top: 5px;">
                                <li>${t('birth_date')}</li>
                                <li>${t('purchase_date')}</li>
                            </ul>
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

    const removeItem = async (id) => {
        try {
            await removeAnimals(id);
            setAnimals(prevAnimals => prevAnimals.filter(animal => animal._id !== id));
            Swal.fire(t('deleted'), t('animal_deleted'), 'success');
        } catch (error) {
            Swal.fire(t('error'), t('failed_to_delete_animal'), 'error');
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
            Swal.fire(t('error'), t('failed_to_fetch_data'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, [currentPage]);

    const handleClick = (id) => {
        Swal.fire({
            title: t('are_you_sure'),
            text: t('you_wont_be_able_to_revert_this'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete_it'),
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
        const total = pagination.totalPages;
        const pageButtons = [];
        const maxButtons = 5; // How many page numbers to show (excluding ellipsis)

        // Helper to add a page button
        const addPage = (page) => {
            pageButtons.push(
                <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(page)}>{page}</button>
                </li>
            );
        };

        // Always show first, last, current, and neighbors
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

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
                </div>
            ) : (
                <>

                    <div className='container mt-5 vaccine-table-container'>
                                            <AnimalStatistics className='mt-3 mb-5'/>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
                            <h2 className="vaccine-table-title">{t('animals')}</h2>
                            
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

                        <div className="row g-2 mt-3 mb-3">
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder={t('search_by_tag_id')} value={searchTagId} onChange={(e) => setSearchTagId(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder={t('search_by_animal_type')} value={searchAnimalType} onChange={(e) => setSearchAnimalType(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder={t('search_by_location_shed')} value={searchLocationShed} onChange={(e) => setSearchLocationShed(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder={t('search_by_breed')} value={searchBreed} onChange={(e) => setSearchBreed(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder={t('search_by_gender')} value={searchGender} onChange={(e) => setSearchGender(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <div className="d-flex justify-content-end mb-3">
                                <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <div className="full-width-table">
                                <table className="table vaccine-modern-table align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="bg-color">#</th>
                                            <th scope="col" className="bg-color">{t('tag_id')}</th>
                                            <th scope="col" className="bg-color">{t('animal_type')}</th>
                                            <th scope="col" className="bg-color">{t('breed')}</th>
                                            <th scope="col" className="bg-color">{t('location_shed')}</th>
                                            <th scope="col" className="text-center bg-color">{t('gender')}</th>
                                            <th className="bg-color">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {animals.map((animal, index) => (
                                            <tr key={`${animal.id || animal._id}-${index}`}>
                                                <th scope="row">{(currentPage - 1) * animalsPerPage + index + 1}</th>
                                                <td>{animal.tagId}</td>
                                                <td>{animal.animalType}</td>
                                                <td>{animal.breed?.breedName || animal.breed || '-'}</td>
                                                <td>{animal.locationShed?.locationShedName || animal.locationShed || '-'}</td>
                                                <td>{animal.gender}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-link p-0 me-2" onClick={() => viewAnimal(animal._id)} title={t('view')} style={{ color:"#808080" }}>
                                                        <IoEyeOutline />
                                                    </button>
                                                    <button className="btn btn-link p-0 me-2" onClick={() => editAnimal(animal._id)} title={t('edit')} style={{ color:"#808080" }}>
                                                        <FaRegEdit />
                                                    </button>
                                                    <button className="btn btn-link p-0" style={{ color:"#808080" }} onClick={() => handleClick(animal.id || animal._id)} title={t('delete')}>
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
                            <nav>
                                {renderModernPagination()}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}