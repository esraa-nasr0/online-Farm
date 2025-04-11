import React, { useContext, useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner'; // Ensure this is installed via npm/yarn
import { AnimalContext } from '../../Context/AnimalContext';

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

    // Render pagination buttons
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

    return (
        <div>
            {isLoading ? (
                <div className="animal">
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
                    <div className="title2">Animals Cost</div>
                    <div className="d-flex flex-wrap mt-4">
                        <input
                            type="text"
                            className="form-control me-2 mb-2"
                            placeholder="Search by Animal Tag ID"
                            value={searchAnimalTagId}
                            onChange={(e) => setSearchAnimalTagId(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button
                            className="btn mb-2 me-2"
                            onClick={handleSearch}
                            style={{ backgroundColor: '#FAA96C', color: 'white' }}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    <table className="table table-hover mt-4 p-2">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Animal Tag ID</th>
                                <th scope="col">Feed Cost</th>
                                <th scope="col">Treatment Cost</th>
                                <th scope="col">Date</th>
                                <th scope="col">Total Cost</th>
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
                            <ul className="pagination">
                                {renderPaginationButtons()}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnimalCost;