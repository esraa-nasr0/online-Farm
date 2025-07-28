import React, { useContext, useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import { AnimalContext } from '../../Context/AnimalContext';
import "../Vaccine/styles.css";
import { useTranslation } from 'react-i18next';

function AnimalCost() {
    const { costAnimal } = useContext(AnimalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [animalCost, setAnimalCost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [CostAnimalsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchAnimalTagId, setSearchAnimalTagId] = useState('');
    const { t } = useTranslation();

    const getCostAnimal = async () => {
        setIsLoading(true);
        const filters = {
            animalTagId: searchAnimalTagId,
        };
        try {
            const { data } = await costAnimal(currentPage, CostAnimalsPerPage, filters);
            setAnimalCost(data.data.animalCost || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching animal costs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCostAnimal();
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        getCostAnimal();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                        {t("back")}
                    </button>
                </li>
                {pageButtons}
                <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
                        {t("next")}
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
                    <h2 className="vaccine-table-title">{t("animals_cost")}</h2>

                    <div className="row g-2 mb-3 mt-4">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control me-2 mb-2"
                                placeholder={t("search_by_tag_id")}
                                value={searchAnimalTagId}
                                onChange={(e) => setSearchAnimalTagId(e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-outline-secondary" onClick={handleSearch}>
                                {t("search")}
                            </button>
                        </div>
                    </div>

                    <table className="table table-hover mt-4 p-2">
    <thead>
        <tr>
            <th scope="col" className="text-center bg-color">{t("number")}</th>
            <th scope="col" className="text-center bg-color">{t("animal_tag_id")}</th>
            <th scope="col" className="text-center bg-color">{t("feed_cost")}</th>
            <th scope="col" className="text-center bg-color">{t("treatment_cost")}</th>
            <th scope="col" className="text-center bg-color">{t("vaccine_cost")}</th>
            <th scope="col" className="text-center bg-color">{t("purchase_price")}</th>
            <th scope="col" className="text-center bg-color">{t("market_value")}</th>
            <th scope="col" className="text-center bg-color">{t("date")}</th>
            <th scope="col" className="text-center bg-color">{t("total_cost")}</th>
        </tr>
    </thead>
    <tbody>
        {animalCost.map((item, index) => (
            <tr key={index}>
                <th className='text-center' scope="row">{(currentPage - 1) * CostAnimalsPerPage + index + 1}</th>
                <td className='text-center'>{item.animalTagId}</td>
                <td className='text-center'>{item.feedCost}</td>
                <td className='text-center'>{item.treatmentCost}</td>
                <td className='text-center'>{item.vaccineCost}</td>
                <td className='text-center'>{item.purchasePrice}</td>
                <td className='text-center'>{item.marketValue}</td>
                <td className='text-center'>{new Date(item.date).toLocaleDateString()}</td>
                <td className='text-center'>{item.totalCost}</td>
            </tr>
        ))}
    </tbody>
</table>


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
