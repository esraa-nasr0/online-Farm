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
                <div className="container mt-5 vaccine-table-container">
                  
 <h2 className="vaccine-table-title">{t('treatment_by_animal')}</h2>
            
                      <div className="row g-2 mb-3">
        <div className="col-md-4">
                                  <input type="text" className="form-control me-2 mb-2" placeholder={t('search_tag_id')} value={searchTagId} onChange={(e) => setSearchTagId(e.target.value)} style={{ flex: 1 }} />

        </div>
        <div className="col-md-4">
                                  <input type="text" className="form-control me-2 mb-2" placeholder={t('search_location_shed')} value={searchLocationShed} onChange={(e) => setSearchLocationShed(e.target.value)} style={{ flex: 1 }} />

        </div>
        <div className="col-md-4">
                                    <input type="text" className="form-control me-2 mb-2" placeholder={t('search_date')} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={{ flex: 1 }} />

        </div>
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
      </div>
      </div>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    <div className="table-responsive">
                    <div className="full-width-table">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center bg-color">#</th>
                                <th scope="col" className="text-center bg-color">{t('tag_id')}</th>
                                <th scope="col" className="text-center bg-color">{t('location_shed')}</th>
                                <th scope="col" className="text-center bg-color">{t('treatment_name')}</th>
                                <th scope="col" className="text-center bg-color">{t('volume')}</th>
                                <th scope="col" className="text-center bg-color">{t('date')}</th>
                              <th className="text-center bg-color">{t('actions')}</th>
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
                                       

                                         <td className="text-center">
                                                                                                                                                
                                                          <button className="btn btn-link p-0 me-2" onClick={() => editTreatment(item._id)} title={t('edit')} style={{
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
                                    <td colSpan="8" className="text-center">{t('no_treatments_found')}</td>
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

export default TreatAnimalTable;
