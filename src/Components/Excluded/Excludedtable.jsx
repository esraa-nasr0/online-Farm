import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { ExcludedContext } from '../../Context/ExcludedContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const NO_DATE = 'No Date';

function formatDate(date) {
    if (!date) return NO_DATE;
    try {
        return new Date(date).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
        return NO_DATE;
    }
}

function Excludedtable() {
    const { t } = useTranslation(); // استخدام الترجمة
    const navigate = useNavigate();
    const { getExcluted, deleteExcluted } = useContext(ExcludedContext);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [animalsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '', animalType: '' });
    const [excluded, setExcluded] = useState([]);

    async function fetchExcluted() {
        setIsLoading(true);
        try {
            const filters = { tagId: searchCriteria.tagId, animalType: searchCriteria.animalType };
            const { data } = await getExcluted(currentPage, animalsPerPage, filters);
            setExcluded(data.data.excluded || []);
            setTotalPages(data.pagination?.totalPages ?? 1);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchExcluted();
    }, [currentPage]);

    function editMating(id) {
        navigate(`/editExcluded/${id}`);
    }

    async function deleteItem(id) {
        try {
            const response = await deleteExcluted(id);
            if (response.data.status === "success") {
                setExcluded(prevExcluded => prevExcluded.filter(item => item._id !== id));
            } else {
                console.error("Error deleting item:", response);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to delete item', 'error');
        }
    }

    function handleClick(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem(id);
            }
        });
    }

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">{t("Excluted Records")}</div>

                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4">
                        <input type="text" className="form-control" value={searchCriteria.tagId} placeholder={t("Search Tag ID")} onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))} />
                        <input type="text" className="form-control" value={searchCriteria.animalType} placeholder={t("Search animalType")} onChange={(e) => setSearchCriteria(prev => ({ ...prev, animalType: e.target.value }))} />
                        <button className="btn" onClick={fetchExcluted} style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mt-3 p-2">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t("Date")}</th>
                                    <th> {t("Tag Id")}</th>
                                    <th>{t("Excluded Type")}</th>
                                    <th>{t("Reason")}</th>
                                    <th>{t("Price")}</th>
                                    <th>{t("Weight")}</th>
                                    <th>{t('edit_Excluded')}</th>
                                    <th>{t('remove_Excluded')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excluded.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                                        <td>{formatDate(item.Date)}</td>
                                        <td>{item.tagId}</td>
                                        <td>{item.excludedType}</td>
                                        <td>{item.reasoneOfDeath ? item.reasoneOfDeath : "_"}</td>
                                        <td>{item.price ? item.price : "_"}</td>
                                        <td>{item.weight}</td>

                                        <td onClick={() => editMating(item._id)} style={{ cursor: 'pointer' }} className='text-success'>
                                            <FaRegEdit /> {t('edit_Excluded')}
                                        </td>
                                        <td onClick={() => handleClick(item._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                            <RiDeleteBin6Line /> {t('remove_Excluded')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

export default Excludedtable;
