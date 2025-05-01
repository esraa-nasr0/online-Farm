import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { MatingContext } from '../../Context/MatingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import UploadMatExcel from './UploadMatExcel';
import { useTranslation } from 'react-i18next';


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
        sonarDate :'',
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
            };
            const { data } = await getMating(currentPage, animalsPerPage, filters);
            setMatings(data.data.mating);
            setPagination(data.pagination || { totalPages: 1 }); 
            const total = data.pagination?.totalPages || 1;
            console.log("Calculated Total Pages:", total);
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
            Swal.fire(t('deleted'), t('mating_deleted'), 'success');
        } catch (error) {
            Swal.fire(t('error'), t('delete_error'), 'error');
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

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    
                    <div className="title2">{t('mating')}</div>
                    
                    {/* <UploadMatExcel addMatingData={addMatingData} /> */}

                    <div className="container mt-5">
    <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
        <input
            type="text"
            className="form-control"
            placeholder={t('search_by_tag_id')}
            value={searchCriteria.tagId}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
        />
        <select
            value={searchCriteria.animalType}
            className="form-select"
            onChange={(e) => setSearchCriteria({ ...searchCriteria, animalType: e.target.value })}
        >
            <option value="">{t('animal_type')}</option>
            <option value="goat">{t('goat')}</option>
            <option value="sheep">{t('sheep')}</option>
        </select>
        <input
            type="text"
            className="form-control"
            placeholder={t('search_mating_date')}
            value={searchCriteria.matingDate}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, matingDate: e.target.value })}
        />
        <input
            type="text"
            className="form-control"
            placeholder={t('search_sonar_result')}
            value={searchCriteria.sonarRsult}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarRsult: e.target.value })}
        />
        <input
            type="text"
            className="form-control"
            placeholder={t('search_sonar_date')}
            value={searchCriteria.sonarDate}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarDate: e.target.value })}
        />
        <button
            className="btn mb-2 me-2"
            onClick={handleSearch}
            style={{ backgroundColor: '#FAA96C', color: 'white' }}
        >
            <i className="fas fa-search"></i>
        </button>
    </div>
</div>
                    <div className="table-responsive">
                    <div className="full-width-table">
                    <table className="table table-hover mt-4">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{t('female_tag_id')}</th>
                                <th>{t('male_tag_id')}</th>
                                <th>{t('mating_type')}</th>
                                <th>{t('mating_date')}</th>
                                <th>{t('sonar_date')}</th>
                                <th>{t('sonar_result')}</th>
                                <th>{t('expected_delivery_date')}</th>
                                <th>{t('edit')}</th>
                                <th>{t('delete')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matings.map((mating, index) => (
                                <tr key={mating._id}>
                                    <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                                    <td>{mating.tagId}</td>
                                    <td>{mating.maleTag_id}</td>
                                    <td>{mating.matingType}</td>
                                    <td>{mating.matingDate ? mating.matingDate.split('T')[0] : NO_DATE}</td>
                                    <td>{mating.sonarDate ? mating.sonarDate.split('T')[0] : NO_DATE}</td>
                                    <td>{mating.sonarRsult}</td>
                                    <td>{mating.expectedDeliveryDate ? mating.expectedDeliveryDate.split('T')[0] : NO_DATE}</td>
                                    <td onClick={() => editMating(mating._id)} className='text-success' style={{ cursor: 'pointer' }}>
                                        <FaRegEdit /> {t('edit')}
                                    </td>
                                    <td onClick={() => confirmDelete(mating._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                        <RiDeleteBin6Line /> {t('delete')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                    </div>
                    </div>

                    {/* أزرار الصفحات */}
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
