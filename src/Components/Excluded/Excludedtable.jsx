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

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
  
                           <h2 className="vaccine-table-title">{t('Excluded Records')}</h2>
                   

                          <div className="row g-2 mb-3">
        <div className="col-md-4">
                                    <input type="text" className="form-control" placeholder={t('search_tag_id')} value={searchCriteria.tagId} onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))} style={{ flex: 1 }} />

        </div>
     
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
      </div>
      </div>
                    <div className="table-responsive mt-4">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center bg-color">{t('tag_id')}</th>
                                    <th className="text-center bg-color">{t('excluded_reason')}</th>
                                    <th className="text-center bg-color">{t('date')}</th>
              <th className="text-center bg-color">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excluded.length > 0 ? (
                                    excluded.map(item => (
                                        <tr key={item._id}>
                                            <td>{item.tagId}</td>
                                            <td>{item.excludedType}</td>
                                            <td>{formatDate(item.Date)}</td>
                                          

                                                       
                                                            
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
            )}
        </>
    );
}

export default ExcludedTable;