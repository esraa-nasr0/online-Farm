import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
function VaccineTable() {
    const { t } = useTranslation();
    let navigate = useNavigate();
    let { getallVaccineanimal, DeletVaccineanimal } = useContext(VaccineanimalContext);
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({ 
        tagId: '', 
        animalType: '', 
        vaccineName: '',
        locationShed: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [animalsPerPage] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function getItem() {
        setIsLoading(true);
        try {
            const filters = {
                vaccineName: searchCriteria.vaccineName,
                tagId: searchCriteria.tagId,
                locationShed: searchCriteria.locationShed
            };

            let { data } = await getallVaccineanimal(currentPage, animalsPerPage, filters);
            console.log("API Response:", JSON.stringify(data, null, 2));

            if (data && data.vaccines) {
                const uniqueVaccines = Array.from(new Set(data.vaccines.map(vaccine => vaccine._id)))
                    .map(id => data.vaccines.find(vaccine => vaccine._id === id));
                setVaccines(uniqueVaccines);
                setPagination(data.pagination || { totalPages: 1 });
            } else {
                console.error("Unexpected data structure:", data);
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
                setVaccines(prevVaccines => prevVaccines.filter(vaccine => vaccine._id !== id));
            } else {
                console.error("Error deleting vaccine:", response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete vaccine record'
                });
            }
        } catch (error) {
            console.error("Error occurred:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting'
            });
        }
    }

    function handleClick(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
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
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4" style={{ marginTop: "140px" }}>
                        <h2 className="bottom-line pb-2" style={{ color: "#778983" }}>  {t('Vaccine Records')}</h2>
                        <div className='d-flex flex-column flex-sm-row gap-2'>
                           
                      
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 mb-4">
                        <input
                            type="text"
                            className="form-control"
                            value={searchCriteria.vaccineName}
                            placeholder=  {t('Search Vaccine Name')}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, vaccineName: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={searchCriteria.tagId}
                            placeholder=  {t('Search Tag ID')}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={searchCriteria.locationShed}
                            placeholder=  {t('Search Location Shed')}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))}
                        />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                <i className="fas fa-search"></i>
                            </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mt-3 p-2">
                            <thead >
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">  {t('Vaccine Name')}</th>
                                    <th scope="col">  {t('Bottles')}</th>
                                    <th scope="col">  {t('Doses Per Bottle')}</th>
                                    <th scope="col">  {t('Total Doses')}</th>
                                    <th scope="col">  {t('Bottle Price')}</th>
                                    <th scope="col">  {t('Dose Price')}</th>
                                    <th scope="col">  {t('Booster Dose')}</th>
                                    <th scope="col">  {t('Annual Dose')}</th>
                                    <th scope="col">{t('edit_vaccine')}</th>
                                    <th scope="col">{t('remove_vaccine')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccines.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center"> {t('No vaccines found')}</td>
                                    </tr>
                                ) : (
                                    vaccines.map((vaccine, index) => (
                                        <tr key={vaccine._id}>
                                            <td>{index + 1}</td>
                                            <td>{vaccine.vaccineName || 'N/A'}</td>
                                            <td>{vaccine.stock?.bottles || 'N/A'}</td>
                                            <td>{vaccine.stock?.dosesPerBottle || 'N/A'}</td>
                                            <td>{vaccine.stock?.totalDoses || 'N/A'}</td>
                                            <td>{vaccine.pricing?.bottlePrice || 'N/A'}</td>
                                            <td>{vaccine.pricing?.dosePrice || 'N/A'}</td>
                                            <td>{vaccine.BoosterDose || 'N/A'}</td>
                                            <td>{vaccine.AnnualDose || 'N/A'}</td>
                                        

                                            <td    onClick={() => editVaccine(vaccine._id)} style={{ cursor: 'pointer' }} className='text-success'>
                                                                                                            <FaRegEdit /> {t('edit_vaccine')}
                                                                                                        </td>
                                                                                                        <td   onClick={() => handleClick(vaccine._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                                                                                            <RiDeleteBin6Line /> {t('remove_vaccine')}
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
                                    <button 
                                        className="page-link" 
                                        onClick={() => paginate(currentPage - 1)}
                                    >
                                        
                                        {t('Previous')}
                                    </button>
                                </li>
                                {renderPaginationButtons()}
                                <li className={`page-item ${currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => paginate(currentPage + 1)}
                                    >
                                        
                                        {t('Next')}
                                    </button>
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