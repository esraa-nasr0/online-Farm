import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BreedingContext } from '../../Context/BreedingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';

function BreadingTable() {
    const navigate = useNavigate();
    const { getAllBreeding, deleteBreeding } = useContext(BreedingContext);
    const [breading, setBreading] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '', animalType: '', deliveryDate: '' });
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1);
      const [animalsPerPage] = useState(10); 

    const [pagination, setPagination] = useState({ totalPages: 1 });
    const getItem = async () => {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                animalType: searchCriteria.animalType,
                deliveryDate: searchCriteria.deliveryDate,
            };
            let { data } = await getAllBreeding(currentPage, animalsPerPage, filters);
        console.log(data);
        
            if (data?.breeding) {
                setBreading(data.breeding);
        
                if (data?.pagination) {
     setPagination(data.pagination);
                    setTotalPages(data.pagination.totalPages || 1); // تحديث عدد الصفحات
                }
            } else {
                setBreading([]);
            }
        } catch (error) {
            setBreading([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSearch = () => {
        setCurrentPage(1);
        getItem();
    };

    const deleteItem = async (id) => {
        try {
            const response = await deleteBreeding(id);
            if (response.data.status === "success") {
                Swal.fire("Success", "Record deleted successfully.", "success");
                setBreading((prev) => prev.filter((breeding) => breeding._id !== id));
            } else {
                Swal.fire("Error", "Could not delete the record.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "An unexpected error occurred.", "error");
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
        }).then(async (result) => {
              if (result.isConfirmed) {
                   try {
                     await deleteBreeding(id);
                     setBreading(breading.filter((breeding) => breeding._id !== id));
                     Swal.fire("Deleted!", "Your breeding has been deleted.", "success");
                   } catch (error) {
                     console.error("Error deleting breeding:", error);
                     Swal.fire("Error!", "Failed to delete the breeding. Please try again.", "error");
                   }
                 }
        });
    };

    const editMating = (id) => {
        navigate(`/editbreading/${id}`);
    };

    useEffect(() => {
        getItem();
    }, [currentPage]);

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
    

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div>
                    <div className='container'>
                    <div className="title2">Breeding</div>

                        <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4" style={{ flexWrap: 'nowrap' }}>
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.tagId}
                                placeholder="Search Tag ID"
                                onChange={(e) => setSearchCriteria((prev) => ({ ...prev, tagId: e.target.value }))}
                                style={{ flex: '1' }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.animalType}
                                placeholder="Search Animal Type"
                                onChange={(e) => setSearchCriteria((prev) => ({ ...prev, animalType: e.target.value }))}
                                style={{ flex: '1' }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.deliveryDate}
                                placeholder="Search Delivery Date"
                                onChange={(e) => setSearchCriteria((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                                style={{ flex: '1' }}
                            />
                            <button
                                className="btn"
                                onClick={handleSearch}
                                style={{ backgroundColor: '#FAA96C', color: 'white' }}
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table table-hover mt-3 p-2">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tag ID</th>
                                        <th scope="col">Delivery State</th>
                                        <th scope="col">Delivery Date</th>
                                        <th scope="col">Birth Entries</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {breading.map((breeding, index) => (
                                        <tr key={`${breeding._id}-${index}`}>
                                            <th scope="row">{(currentPage - 1) * animalsPerPage + index + 1}</th>
                                            <td>{breeding.tagId}</td>
                                            <td>{breeding.deliveryState}</td>
                                            <td>{breeding.deliveryDate ? breeding.deliveryDate.split('T')[0] : 'No Date'}</td>
                                            <td>
                                                {breeding.birthEntries && breeding.birthEntries.length > 0 ? (
                                                    <ul className="list-group">
                                                        {breeding.birthEntries.map((entry, idx) => (
                                                            <li key={idx} className="list-group-item">
                                                                <strong>Tag ID:</strong> {entry.tagId}, 
                                                                <strong> Gender:</strong> {entry.gender}, 
                                                                <strong> Birthweight:</strong> {entry.birthweight} kg
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-muted">No Birth Entries</span>
                                                )}
                                            </td>
                                            <td
                                                onClick={() => editMating(breeding._id)}
                                                style={{ cursor: 'pointer', color: "#198754" }}
                                            >
                                                <FaRegEdit /> Edit
                                            </td>
                                            <td onClick={() => handleClick(breeding._id)} className="text-danger" style={{ cursor: "pointer" }}>
                                                <RiDeleteBin6Line /> Remove
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
                </div>
            )}
        </>
    );
}

export default BreadingTable;
