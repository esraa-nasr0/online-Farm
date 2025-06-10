import React, { useContext, useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { Feedcontext } from '../../Context/FeedContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../Vaccine/styles.css"

export default function FodderTable() {
    const { t } = useTranslation();
    const { getFodder , deleteFodder } = useContext(Feedcontext);
    const [isLoading, setIsLoading] = useState(false);
    const [fodder, setFodder] = useState([]);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState('');
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [FodderPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const fetchFodder = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = { name: searchName };
            const { data } = await getFodder(currentPage, FodderPerPage, filters);
            setFodder(data?.data?.fodders || []);
            setPagination(data.pagination);
            const total = data.pagination.totalPages;
            setTotalPages(total);
        } catch (error) {
            Swal.fire('Error', t('fodder.fetch.error'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteItem = async (id) => {
        try {
            await deleteFodder(id);
            setFodder((prev) => prev.filter((item) => item._id !== id));
            Swal.fire('Deleted!', t('fodder.delete.success'), 'success');
        } catch (error) {
            console.error('Failed to delete fodder:', error);
            Swal.fire('Error', t('fodder.delete.error'), 'error');
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: t('fodder.delete.confirmTitle'),
            text: t('fodder.delete.confirmText'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('fodder.delete.confirmButton'),
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };

    useEffect(() => {
        fetchFodder();
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchFodder();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages;
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

    const editFodder = (id) => {
        navigate(`/editFodder/${id}`);
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    <h2 className="vaccine-table-title">{t('fodder.title')}</h2>
                    {error && <p className="text-danger mt-3">{error}</p>}

                    <div className='container mt-4'>
                     



                                          <div className="row g-2 mb-3">
        <div className="col-md-4">
  <input
                                type="text"
                                className="form-control"
                                placeholder={t('fodder.searchPlaceholder')}
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                style={{ flex: 1 }}
                            />
        </div>
   
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
      </div>
      </div>
                    </div>

                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th scope="col" className=" bg-color">{t('fodder.table.index')}</th>
                                <th scope="col" className=" bg-color">{t('fodder.table.name')}</th>
                                <th scope="col" className=" bg-color">{t('fodder.table.components')}</th>
                                <th scope="col" className=" bg-color">{t('fodder.table.totalQuantity')}</th>
                                <th scope="col" className=" bg-color">{t('fodder.table.totalPrice')}</th>
                              <th className="text-center bg-color">{t('actions')}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {fodder.length > 0 ? (
                                fodder.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <th scope="row">{(currentPage - 1) * FodderPerPage + index + 1}</th>
                                        <td>{item.name}</td>
                                        <td>Quantity : {item.components.map((comp) => comp.quantity).join(', ')}</td>
                                        <td>{item.totalQuantity}</td>
                                        <td>{item.totalPrice}</td>
                                   
                                        
                                                                                 <td className="text-center">
                                                                                                                                                                                        
                                                                                                  <button className="btn btn-link p-0 me-2"   onClick={() => editFodder(item._id)} title={t('edit')} style={{
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
                                    <td colSpan="7" className="text-center">{t('fodder.table.noData')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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
