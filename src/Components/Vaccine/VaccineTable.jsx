import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import "./styles.css";

function VaccineTable() {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const { getallVaccineanimal, DeletVaccineanimal } = useContext(VaccineanimalContext);

    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '', animalType: '', vaccineName: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [animalsPerPage] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function getItem() {
        setIsLoading(true);
        try {
            const filters = {
                vaccineName: searchCriteria.vaccineName,
                tagId: searchCriteria.tagId,
            };

            let { data } = await getallVaccineanimal(currentPage, animalsPerPage, filters);
            if (data && data.vaccines) {
                const uniqueVaccines = Array.from(new Set(data.vaccines.map(vaccine => vaccine._id)))
                    .map(id => data.vaccines.find(vaccine => vaccine._id === id));
                setVaccines(uniqueVaccines);
                setPagination(data.pagination || { totalPages: 1 });
            } else {
                setVaccines([]);
                Swal.fire({
                    icon: 'error',
                    title: 'Data Error',
                    text: 'Received unexpected data structure from server'
                });
            }
        } catch (error) {
            console.error("Error fetching vaccine data:", error);
            setVaccines([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load vaccine data'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = () => {
        setCurrentPage(1);
        getItem();
    };

    useEffect(() => {
        getItem();
    }, [currentPage]);

    async function deleteItem(id) {
        try {
            let response = await DeletVaccineanimal(id);
            if (response.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Vaccine record has been deleted.',
                    timer: 1500
                });
                setVaccines(prev => prev.filter(vaccine => vaccine._id !== id));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete vaccine record'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting'
            });
        }
    }

    function handleClick(id) {
        Swal.fire({
            title: t("Are you sure?"),
            text: t("You won't be able to revert this!"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t("Yes, delete it!"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem(id);
            }
        });
    }

    function editVaccine(id) {
        navigate(`/editVaccine/${id}`);
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
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

    
    return (
        <>
            {isLoading ? (
                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
                        <h2 className="vaccine-table-title">{t('Vaccines')}</h2>
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
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mt-3 p-2">
                            <thead>
                                <tr>
                                    <th className="text-center bg-color">#</th>
                                    <th className="text-center bg-color">{t('Vaccine Name')}</th>
                                    <th className="text-center bg-color">{t('Bottles')}</th>
                                    <th className="text-center bg-color">{t('Doses Per Bottle')}</th>
                                    <th className="text-center bg-color">{t('Total Doses')}</th>
                                    <th className="text-center bg-color">{t('Bottle Price')}</th>
                                    <th className="text-center bg-color">{t('Dose Price')}</th>
                                    <th className="text-center bg-color">{t('Booster Dose')}</th>
                                    <th className="text-center bg-color">{t('Annual Dose')}</th>
                                    <th className="text-center bg-color">{t('Expiry Date')}</th>
                                    <th className="text-center bg-color">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccines.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="text-center">{t('No vaccines found')}</td>
                                    </tr>
                                ) : (
                                    vaccines.map((vaccine, index) => (
                                        <tr key={vaccine._id}>
                                            <td className="text-center align-middle">{index + 1}</td>
                                            <td className="align-middle">
                                                <div className="d-flex flex-column align-items-center">
                                                    {vaccine.vaccineType?.image && (
                                                        <img 
                                                            src={`https://farm-project-bbzj.onrender.com/${vaccine.vaccineType.image.replace(/\\/g, "/")}`}
                                                            alt={i18n.language === "ar" ? vaccine.vaccineType?.arabicName : vaccine.vaccineType?.englishName}
                                                            width="50"
                                                            height="50"
                                                            className="mb-2"
                                                            style={{ 
                                                                borderRadius: "5px", 
                                                                objectFit: "cover",
                                                                border: "1px solid #ddd"
                                                            }}
                                                        />
                                                    )}
                                                    <span className="text-center">
                                                        {i18n.language === "ar" ? vaccine.vaccineType?.arabicName : vaccine.vaccineType?.englishName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">{vaccine.stock?.bottles || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.stock?.dosesPerBottle || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.stock?.totalDoses || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.pricing?.bottlePrice || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.pricing?.dosePrice || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.BoosterDose || 'N/A'}</td>
                                            <td className="text-center align-middle">{vaccine.AnnualDose || 'N/A'}</td>
                                            <td className="text-center align-middle">
                                                {vaccine.expiryDate ? new Date(vaccine.expiryDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="text-center align-middle">
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
                                                    style={{ color: "#808080" }} 
                                                    onClick={() => handleClick(vaccine._id)} 
                                                    title={t('delete')}
                                                >
                                                    <RiDeleteBinLine />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>{t('Previous')}</button>
                                </li>
                                {renderPaginationButtons()}
                                <li className={`page-item ${currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>{t('Next')}</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            )}
        </>
    );
}

export default VaccineTable;