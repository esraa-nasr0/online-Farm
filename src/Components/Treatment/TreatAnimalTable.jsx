import React, { useContext, useState, useEffect } from 'react';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { Rings } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function TreatAnimalTable() {
    const { t } = useTranslation();
    const { getTreatmentByAnimal, deleteTreatmentByAnimal } = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);
    const [treatment, setTreatment] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [TreatAnimalPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [searchLocationShed, setSearchLocationShed] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchTagId, setSearchTagId] = useState('');

    const fetchTreatment = async () => {
        setIsLoading(true);
        setError(null);
        const filters = {
            tagId: searchTagId,
            locationShed: searchLocationShed,
            date: searchDate,
        };
        try {
            const { data } = await getTreatmentByAnimal(currentPage, TreatAnimalPerPage, filters);
            setTreatment(data?.data?.treatmentShed || []);
            setTotalPages(data.data.pagination?.totalPages);
        } catch (error) {
            Swal.fire(t('error_fetching_data'), '', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchTreatment();
    }, [currentPage]);
    
    const deleteItem = async (id) => {
        try {
            await deleteTreatmentByAnimal(id);
            setTreatment((prevTreatment) => prevTreatment.filter((item) => item._id !== id));
            Swal.fire(t('deleted_success'), '', 'success');
        } catch (error) {
            console.error('Failed to delete treatment:', error);
            Swal.fire(t('error_fetching_data'), '', 'error');
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: t('delete_warning'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('delete_confirm'),
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };

    const editTreatment = (id) => {
        navigate(`/editTreatAnimal/${id}`);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    

    const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
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


    const handleSearch = () => {
        setCurrentPage(1);
        fetchTreatment();
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">{t('treatment_by_animal')}</div>

                    <div className="container mt-5">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input type="text" className="form-control me-2 mb-2" placeholder={t('search_tag_id')} value={searchTagId} onChange={(e) => setSearchTagId(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control me-2 mb-2" placeholder={t('search_location_shed')} value={searchLocationShed} onChange={(e) => setSearchLocationShed(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control me-2 mb-2" placeholder={t('search_date')} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={{ flex: 1 }} />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#FAA96C',  color: 'white' }}>
                                <i className="fas fa-search"></i> {t('search_button')}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    <div className="table-responsive">
                    <div className="full-width-table">
                    <table className="table table-hover mt-4" aria-label={t('treatment_by_animal')}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{t('tag_id')}</th>
                                <th scope="col">{t('location_shed')}</th>
                                <th scope="col">{t('treatment_name')}</th>
                                <th scope="col">{t('volume')}</th>
                                <th scope="col">{t('date')}</th>
                                <th scope="col">{t('edit_treatment')}</th>
                                <th scope="col">{t('remove_treatment')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treatment.length > 0 ? (
                                treatment.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <th scope="row">{(currentPage - 1) * TreatAnimalPerPage + index + 1}</th>
                                        <td>{item.tagId}</td>
                                        <td>{item.locationShed?.locationShedName || item.locationShed || '-'}</td>
                                        <td>{item.treatments && item.treatments[0] ? item.treatments[0].treatmentName : "No Treatment"}</td>
                                        <td>{item.treatments && item.treatments[0] ? item.treatments[0].volume : "N/A"}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td onClick={() => editTreatment(item._id)} className="text-success" style={{ cursor: 'pointer' }}>
                                            <FaRegEdit /> {t('edit_treatment')}
                                        </td>
                                        <td onClick={() => confirmDelete(item._id)} className="text-danger" style={{ cursor: 'pointer' }}>
                                            <RiDeleteBin6Line /> {t('remove_treatment')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">{t('no_treatments_found')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                    </div>
                    {/* Pagination */}
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

export default TreatAnimalTable;
