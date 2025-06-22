import React, { useContext, useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner'; // Ensure this is installed via npm/yarn
import { AnimalContext } from '../../Context/AnimalContext';
import "../Vaccine/styles.css"

function AnimalCost() {
    const { costAnimal } = useContext(AnimalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [animalCost, setAnimalCost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [CostAnimalsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchAnimalTagId, setSearchAnimalTagId] = useState('');

    // Function to fetch animal cost data
    const getCostAnimal = async () => {
        setIsLoading(true);
        const filters = {
            animalTagId: searchAnimalTagId,
        };
        try {
            const { data } = await costAnimal(currentPage, CostAnimalsPerPage, filters);
            setAnimalCost(data.data.animalCost || []);
            setTotalPages(data.pagination?.totalPages || 1); // Set totalPages based on the response
        } catch (error) {
            console.error('Error fetching animal costs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component is mounted or currentPage changes
    useEffect(() => {
        getCostAnimal();
    }, [currentPage]); // Remove searchAnimalTagId from dependency array

    // Handle the search by animal tag ID
    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page when searching
        getCostAnimal(); // Fetch data with the new search filter
    };

    // Pagination handler
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Modern pagination rendering function
    const renderModernPagination = () => {
        const total = totalPages;
        const pageButtons = [];
        const maxButtons = 5;
        const addPage = (page) => {
            pageButtons.push(
                <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(page)}>{page}</button>
                </li>
            );
        };
        if (total <= maxButtons) {
            for (let i = 1; i <= total; i++) addPage(i);
        } else {
            addPage(1);
            if (currentPage > 3) {
                pageButtons.push(<li key="start-ellipsis" className="pagination-ellipsis">...</li>);
            }
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(total - 1, currentPage + 1);
            if (currentPage <= 3) end = 4;
            if (currentPage >= total - 2) start = total - 3;
            for (let i = start; i <= end; i++) {
                if (i > 1 && i < total) addPage(i);
            }
            if (currentPage < total - 2) {
                pageButtons.push(<li key="end-ellipsis" className="pagination-ellipsis">...</li>);
            }
            addPage(total);
        }
        return (
            <ul className="pagination">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        &lt; Back
                    </button>
                </li>
                {pageButtons}
                <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
                        Next &gt;
                    </button>
                </li>
            </ul>
        );
    };

    return (
        <div>
            {isLoading ? (
                <div className="animal">
                    <Rings
                        visible={true}
                        height="100"
                        width="100"
                        color="#21763e"
                        ariaLabel="rings-loading"
                    />
                </div>
            ) : (
                <div className="container mt-5 vaccine-table-container">
                    
                     <h2 className="vaccine-table-title">Animals Cost</h2>
                 

                 <div className="row g-2 mb-3 mt-4">
        <div className="col-md-4">
    <input
                            type="text"
                            className="form-control me-2 mb-2"
                            placeholder="Search by Animal Tag ID"
                            value={searchAnimalTagId}
                            onChange={(e) => setSearchAnimalTagId(e.target.value)}
                            style={{ flex: 1 }}
                        />
        </div>
    
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>search</button>
      </div>
      </div>

                    <table className="table table-hover mt-4 p-2">
                        <thead>
                            <tr>
                                <th scope="col"className=" bg-color" >#</th>
                                <th scope="col" className=" bg-color">Animal Tag ID</th>
                                <th scope="col" className=" bg-color">Feed Cost</th>
                                <th scope="col" className=" bg-color">Treatment Cost</th>
                                <th scope="col" className=" bg-color">Date</th>
                                <th scope="col" className=" bg-color">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animalCost.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{(currentPage - 1) * CostAnimalsPerPage + index + 1}</th>
                                    <td>{item.animalTagId}</td>
                                    <td>{item.feedCost}</td>
                                    <td>{item.treatmentCost}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.totalCost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination buttons */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            {renderModernPagination()}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnimalCost;