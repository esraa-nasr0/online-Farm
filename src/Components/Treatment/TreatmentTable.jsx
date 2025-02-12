import React, { useContext, useState, useEffect } from 'react';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { Rings } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

function TreatmentTable() {
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
            setTreatment(data?.data?.treatments || []); // Safely handle undefined data
            setPagination(data.pagination || {}); // Safely handle pagination data
            setTotalPages(data.pagination?.totalPages || 1); // Update total pages
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
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
            Swal.fire('Deleted!', 'Treatment has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete treatment:', error);
            Swal.fire('Error', 'Failed to delete treatment.', 'error');
        }
    };

    const editTreatment = (id) => {
        navigate(`/editTreatment/${id}`);
    };

    const confirmDelete = (id) => {
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

    const handleSearch = () => {
        setCurrentPage(1); // Reset to page 1 when search is triggered
        fetchTreatment(); // Fetch data with the new search filters
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">Treatment</div>
                    <div className="flex-column flex-md-row mb-4 mt-3">
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
                            <Link to="/treatment">
                                <button type="button" className="btn btn-lg btn-secondary active button2">
                                    <MdOutlineAddToPhotos /> Add New Treatment
                                </button>
                            </Link>
                            <Link to="/treatAnimalTable">
                                <button type="button" className="btn btn-lg btn-secondary active button2">
                                    <MdOutlineAddToPhotos /> Treatment by Animal
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="container mt-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder="Search by Name"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder="Search by Type"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn mb-2 me-2"
                                onClick={handleSearch}
                                style={{ backgroundColor: '#88522e', borderColor: '#88522e', color: 'white' }}
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    <table className="table table-hover mt-4" aria-label="Treatment Table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Type</th>
                                <th scope="col">Volume</th>
                                <th scope="col">Price</th>
                                <th scope="col">Edit Treatment</th>
                                <th scope="col">Remove Treatment</th>
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
                                        <td
                                            onClick={() => editTreatment(item._id)}
                                            className="text-success"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <FaRegEdit /> Edit Treatment
                                        </td>
                                        <td
                                            onClick={() => confirmDelete(item._id)}
                                            className="text-danger"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <RiDeleteBin6Line /> Remove Treatment
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No treatments found.</td>
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

export default TreatmentTable;