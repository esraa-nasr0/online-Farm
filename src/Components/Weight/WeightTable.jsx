import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { WeightContext } from '../../Context/WeightContext';
import { useTranslation } from 'react-i18next';

function WeightTable() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getWeight, deleteWeight } = useContext(WeightContext);

    const [weights, setWeight] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        weightType: '',
        Date: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const animalsPerPage = 10;
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function fetchWeight() {
        setIsLoading(true);
        const filters = {
            tagId: searchCriteria.tagId,
            weightType: searchCriteria.weightType,
            Date: searchCriteria.Date,
        };
        try {
            const { data } = await getWeight(currentPage, animalsPerPage, filters);
            setWeight(data.data.weight);
            setPagination(data.pagination || { totalPages: 1 });
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching weight data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchWeight();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await deleteWeight(id);
            setWeight((prev) => prev.filter((w) => w._id !== id));
            Swal.fire(t('deleted'), t('weight_deleted_success'), 'success');
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire(t('error'), t('weight_deleted_fail'), 'error');
        }
    };

    const handleClick = (id) => {
        Swal.fire({
            title: t('confirm_delete'),
            text: t('delete_warning'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete')
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };

    const editWeight = (id) => navigate(`/editWeight/${id}`);

    function handleSearch() {
        setCurrentPage(1);
        fetchWeight();
    }

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
                <div className="container">
                    <div className="title2">{t('weight_title')}</div>

                    <div className="container mt-5">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_tag_id')}
                                value={searchCriteria.tagId}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_weight_type')}
                                value={searchCriteria.weightType}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, weightType: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_date')}
                                value={searchCriteria.Date}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, Date: e.target.value })}
                            />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#FAA96C', color: '#E9E6E2' }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive full-width-table">
                        <table className="table table-hover mt-6">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t('tag_id')}</th>
                                    <th>{t('weight_type')}</th>
                                    <th>{t('weight')}</th>
                                    <th>{t('height')}</th>
                                    <th>{t('date')}</th>
                                    <th>{t('edit_weight')}</th>
                                    <th>{t('remove_weight')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weights.map((weight, index) => (
                                    <tr key={`${weight.id || weight._id}-${index}`}>
                                        <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                                        <td>{weight.tagId}</td>
                                        <td>{weight.weightType}</td>
                                        <td>{weight.weight}</td>
                                        <td>{weight.height}</td>
                                        <td>{weight.Date ? weight.Date.split('T')[0] : t('no_date')}</td>
                                        <td onClick={() => editWeight(weight._id)} className="text-success" style={{ cursor: 'pointer' }}>
                                            <FaRegEdit /> {t('edit_weight')}
                                        </td>
                                        <td onClick={() => handleClick(weight._id)} className="text-danger" style={{ cursor: 'pointer' }}>
                                            <RiDeleteBin6Line /> {t('remove_weight')}
                                        </td>
                                    </tr>
                                ))}
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

export default WeightTable;
