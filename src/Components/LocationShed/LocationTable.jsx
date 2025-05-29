import React, { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../../Context/LocationContext';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { Rings } from 'react-loader-spinner';
import {  useNavigate } from 'react-router-dom';
import "../Vaccine/styles.css"

function LocationTable() {
        let navigate = useNavigate();
    const { getLocation, removeLocation } = useContext(LocationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const locationPerPage = 10;
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function fetchShed() {
        setIsLoading(true);
        try {
            let { data } = await getLocation(currentPage, locationPerPage);
            setLocations(data.data.locationSheds);
            setPagination(data.pagination || { totalPages: 1 });
        } catch (error) {
            console.error('Error fetching location data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchShed();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await removeLocation(id);
            setLocations((prev) => prev.filter((location) => location._id !== id));
            Swal.fire('Deleted!', 'Location has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete Location:', error);
            Swal.fire('Error', 'Failed to delete Location.', 'error');
        }
    };

    const handleClick = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };
    
    // التوجه لتعديل الوزن
    function editLocations(id) {
        navigate(`/editLocation/${id}`);
    }

    const renderPaginationButtons = () => {
        return Array.from({ length: pagination.totalPages }, (_, i) => (
            <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                </button>
            </li>
        ));
    };

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                                <Rings
                                    visible={true}
                                    height="100"
                                    width="100"
                                    color="#9cbd81"
                                    ariaLabel="rings-loading"
                                />
                            </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
            
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 mb-3">
        <h2 className="vaccine-table-title">Location Shed</h2>



{/* 
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-dark" onClick={handleExportToExcel} title={t('export_all_data')}>
            <i className="fas fa-download me-1"></i> {t('export_all_data')}
          </button>
          <button className="btn btn-success" onClick={handleDownloadTemplate} title={t('download_template')}>
            <i className="fas fa-file-arrow-down me-1"></i> {t('download_template')}
          </button>
          <label className="btn btn-dark  btn-outline-dark mb-0 d-flex align-items-center" style={{ cursor: 'pointer', color:"white" }} title={t('import_from_excel')}>
            <i className="fas fa-file-import me-1"></i> {t('import_from_excel')}
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleImportFromExcel} />
          </label>
        </div> */}







      </div>

                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table table-hover mt-5">
                                <thead>
                                    <tr>
                                        <th className="text-center bg-color">#</th>
                                        <th className="text-center bg-color">Location Shed Name</th>
                                              <th className="text-center bg-color">actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((location, index) => (
                                        <tr key={location._id}>
                                            <td>{(currentPage - 1) * locationPerPage + index + 1}</td>
                                            <td>{location.locationShedName}</td>
                                        

                                              <td className="text-center">
                                            
                                                                <button className="btn btn-link p-0 me-2"            onClick={() => editLocations(location._id)} title='edit' style={{
                                                                  color:"#808080"
                                                                }}><FaRegEdit /></button>
                                                                <button className="btn btn-link  p-0" style={{
                                                                  color:"#808080"
                                                                }}  onClick={() => handleClick(location._id)} title='delete' ><RiDeleteBinLine/></button>
                                                              </td>
                                        </tr>
                                    ))}
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

export default LocationTable;
