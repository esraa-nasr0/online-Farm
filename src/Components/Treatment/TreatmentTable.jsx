import React, { useContext, useState, useEffect } from 'react';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { Rings } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import Swal from 'sweetalert2';
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import "../Vaccine/styles.css"

function TreatmentTable() {
    const { t } = useTranslation();
    const { getTreatment, deleteTreatment } = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);
    const [treatment, setTreatment] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [treatmentPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchType, setSearchType] = useState('');
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const fetchTreatment = async () => {
        setIsLoading(true);
        setError(null);

        const filters = {
            name: searchName,
            type: searchType,
        };

        try {
            const { data } = await getTreatment(currentPage, treatmentPerPage, filters);
            setTreatment(data?.data?.treatments || []); 
            setPagination(data.pagination || {});
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            Swal.fire(t('error'), t('failed_to_fetch_data'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts or when the page changes
    useEffect(() => {
        fetchTreatment();
    }, [currentPage]); // Only trigger fetch on page change

    const deleteItem = async (id) => {
        try {
            await deleteTreatment(id);
            setTreatment((prevTreatment) => prevTreatment.filter((item) => item._id !== id));
            Swal.fire(t('deleted'), t('treatment_deleted'), 'success');
        } catch (error) {
            console.error('Failed to delete treatment:', error);
            Swal.fire(t('error'), t('failed_to_fetch_data'), 'error');
        }
    };

    const editTreatment = (id) => {
        navigate(`/editTreatment/${id}`);
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: t('are_you_sure'),
            text: t('cannot_revert'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete_it'),
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages;
        for (let i = 1; i <= total; i++) {
            buttons.push(
                <li  key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
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
                <div className="container mt-5 vaccine-table-container">
                    <h2 className="vaccine-table-title">{t('treatment')}</h2>

                    <div className="container mt-5">
            

   <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_name')}
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                style={{ flex: 1 }}
                            />
        </div>
        <div className="col-md-4">
           <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_type')}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                style={{ flex: 1 }}
                            />
        </div>
        <div className="col-md-4">
            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t('search_by_type')}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                style={{ flex: 1 }}
                            />
        </div>
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
      </div>
      </div>


                        
                    </div>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table align-middle" aria-label={t('treatment_table')}>
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center bg-color">#</th>
                                        <th scope="col" className="text-center bg-color">{t('name')}</th>
                                        <th scope="col" className="text-center bg-color">{t('type')}</th>
                                        <th scope="col" className="text-center bg-color">{t('volume')}</th>
                                        <th scope="col" className="text-center bg-color">{t('price')}</th>
                                           <th className="text-center bg-color">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {treatment.length > 0 ? (
                                        treatment.map((item, index) => (
                                            <tr key={item._id || index}>
                                                <th scope="row">{(currentPage - 1) * treatmentPerPage + index + 1}</th>
                                                <td>{item.name}</td>
                                                <td>{item.type}</td>
                                                <td>{item.volume}</td>
                                                <td>{item.price}</td>
                                              

                                                  <td className="text-center">
                                                                                                                                                        
 <button className="btn btn-link p-0 me-2"   onClick={() => editTreatment(item._id)} title={t('edit')} style={{
   color:"#808080"
 }}><FaRegEdit /></button>
 <button className="btn btn-link  p-0" style={{
   color:"#808080"
 }}  onClick={() => confirmDelete(item._id)} title={t('delete')}  ><RiDeleteBinLine/></button>
                                                                                                                                                                          </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">{t('no_treatments_found')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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

export default TreatmentTable;
