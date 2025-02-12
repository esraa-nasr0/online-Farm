import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { ExclutedContext } from '../../Context/ExclutedContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';

const NO_DATE = 'No Date';

function formatDate(date) {
    if (!date) return NO_DATE;
    try {
        return new Date(date).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
        return NO_DATE;
    }
}

function Exclutedtable() {
    const navigate = useNavigate();
    const { getExcluted, deleteExcluted } = useContext(ExclutedContext);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const animalsPerPage = 10;
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '', matingDate: '', sonarRsult: '', animalType: '' });
    const [excluded, setExcluded] = useState([]);

    async function fetchExcluted() {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                matingDate: searchCriteria.matingDate,
                sonarRsult: searchCriteria.sonarRsult,
                animalType: searchCriteria.animalType,
            };
            const { data } = await getExcluted(currentPage, animalsPerPage, filters);
            setExcluded(data.data.excluded);
            setTotalPages(Math.ceil(data.data.total / animalsPerPage));
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchExcluted();
    }, [currentPage, searchCriteria]);  // Add searchCriteria as a dependency

    function editMating(id) {
        navigate(`/editExcluted/${id}`);
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
            console.error("Error occurred:", error);
            Swal.fire('Error', 'Failed to delete item', 'error');
        }
    }

    function handleClick(id) {
        Swal.fire({
            title: "هل تريد الاستمرار؟",
            icon: "question",
            confirmButtonText: "نعم",
            cancelButtonText: "لا",
            showCancelButton: true,
            showCloseButton: true
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
                    <Rings visible={true} height="100" width="100" color="#88522e" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center  mb-4" style={{ marginTop: "140px" }}>
                        <h2 className="" style={{ color: "#88522e" }}>Excluted Records</h2>
                        <Link to='/excluted'>
                            <button type="button" className="btn btn-secondary button2 btn-lg active mt-3" style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" }}>
                                <MdOutlineAddToPhotos /> Add New Excluted
                            </button>
                        </Link>
                    </div>

                    <table className="table table-hover mt-4">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>tagId</th>
                                <th>excludedType</th>
                                <th>price</th>
                                <th>weight</th>
                                <th>Edit Mating</th>
                                <th>Remove Mating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {excluded.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                                    <td>{formatDate(item.Date)}</td>
                                    <td>{item.tagId}</td>
                                    <td>{item.excludedType}</td>
                                    <td>{item.price}</td>
                                    <td>{item.weight}</td>
                                    <td>
                                        <button className="btn " style={{ cursor: 'pointer', color: "#5a3e2b" }} onClick={() => editMating(item._id)}>
                                            <FaRegEdit /> Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" style={{ cursor: 'pointer', color: "#ff0000" }} onClick={() => handleClick(item._id)}>
                                            <RiDeleteBin6Line /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default Exclutedtable;
