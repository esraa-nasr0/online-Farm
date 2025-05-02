import React, { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../../Context/LocationContext';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Rings } from 'react-loader-spinner';
import {  useNavigate } from 'react-router-dom';


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
                <div className="container">
                    <div className="title2">Location Shed</div>

                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table table-hover mt-5">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Location Shed Name</th>
                                        <th>Edit Location</th>
                                        <th>Remove Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((location, index) => (
                                        <tr key={location._id}>
                                            <td>{(currentPage - 1) * locationPerPage + index + 1}</td>
                                            <td>{location.locationShedName}</td>
                                            <td 
                                            onClick={() => editLocations(location._id)}
                                            className="text-success"
                                            style={{ cursor: 'pointer' }}>
                                                <FaRegEdit /> Edit Location
                                            </td>
                                            <td
                                                className="text-danger"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleClick(location._id)}
                                            >
                                                <RiDeleteBin6Line /> Remove Location
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
