import React, { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../../Context/LocationContext';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { Rings } from 'react-loader-spinner';
import {  useNavigate } from 'react-router-dom';
import { BreedContext } from '../../Context/BreedContext';
import "../Vaccine/styles.css"

function BreedTable() {
        let navigate = useNavigate();
    const { getBreed , removeBreed  } = useContext(BreedContext);
    const [isLoading, setIsLoading] = useState(false);
    const [breed, setBreed] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const breedPerPage = 10;
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function fetchBreed() {
        setIsLoading(true);
        try {
            let { data } = await getBreed(currentPage, breedPerPage);
            setBreed(data.data.breeds);
            setPagination(data.pagination || { totalPages: 1 });
        } catch (error) {
            console.error('Error fetching breed data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBreed();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await removeBreed(id);
            setBreed((prev) => prev.filter((breed) => breed._id !== id));
            Swal.fire('Deleted!', 'Breed has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete Breed:', error);
            Swal.fire('Error', 'Failed to delete Breed.', 'error');
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
    function editBreed(id) {
        navigate(`/editBreed/${id}`);
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
                        <h2 className="vaccine-table-title">Breed</h2>


                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table table-hover mt-5">
                                <thead>
                                    <tr>
                                        <th className="text-center bg-color">#</th>
                                        <th className="text-center bg-color">Breed Name</th>
                                                     <th className="text-center bg-color">actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {breed.map((breeds, index) => (
                                        <tr key={breeds._id}>
                                            <td>{(currentPage - 1) * breedPerPage + index + 1}</td>
                                            <td>{breeds.breedName}</td>
                                       

                                              
                                                              <td className="text-center">
                                            
                                                                <button className="btn btn-link p-0 me-2"  onClick={() => editBreed(breeds._id)} title='edit' style={{
                                                                  color:"#808080"
                                                                }}><FaRegEdit /></button>
                                                                <button className="btn btn-link  p-0" style={{
                                                                  color:"#808080"
                                                                }}   onClick={() => handleClick(breeds._id)} title='delete'  ><RiDeleteBinLine/></button>
                                                              </td>
                                        </tr>
                                    ))}
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

export default BreedTable;
