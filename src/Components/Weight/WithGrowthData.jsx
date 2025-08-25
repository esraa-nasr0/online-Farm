import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rings } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import "../Vaccine/styles.css";
import { FiSearch } from "react-icons/fi";


function WithGrowthData() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '' });
    const [growthData, setGrowthData] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [isLoading, setIsLoading] = useState(false);

    const fetchGrowthData = async (page = 1, filters = {}) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Authorization');
            const params = {
                page,
                limit,
                ...filters.tagId && { tagId: filters.tagId }
            };
            const response = await axios.get(`https://farm-project-bbzj.onrender.com/api/weight/getAllAnimalsWithGrowthData`, {
                headers: {
                    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
                },
                params
            });
            setGrowthData(response.data.data || []);
            setPagination(response.data.pagination || { totalPages: 1 });
        } catch (error) {
            console.error("Error fetching growth data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrowthData(currentPage, searchCriteria);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchGrowthData(1, searchCriteria);
    };

    const renderModernPagination = () => {
        const total = pagination.totalPages || 1;
        const pageButtons = [];
        const maxButtons = 5;

        const addPage = (page) => {
            pageButtons.push(
                <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                </li>
            );
        };

        if (total <= maxButtons) {
            for (let i = 1; i <= total; i++) addPage(i);
        } else {
            addPage(1);
            if (currentPage > 3) pageButtons.push(<li key="start-ellipsis" className="pagination-ellipsis">...</li>);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(total - 1, currentPage + 1);
            if (currentPage <= 3) end = 4;
            if (currentPage >= total - 2) start = total - 3;

            for (let i = start; i <= end; i++) {
                if (i > 1 && i < total) addPage(i);
            }

            if (currentPage < total - 2) pageButtons.push(<li key="end-ellipsis" className="pagination-ellipsis">...</li>);
            addPage(total);
        }

        return (
            <ul className="pagination">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        &lt; {t('Back')}
                    </button>
                </li>
                {pageButtons}
                <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                    <button className="page-link pagination-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === total}>
                        {t('Next')} &gt;
                    </button>
                </li>
            </ul>
        );
    };

    return (
        <>
            {isLoading ? (
                <div className="animal">
                    <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
                </div>
            ) : (
                        <div className="container mt-4">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                        <h2 className="vaccine-table-title">{t('Animal Growth')}</h2>
                    </div>
                <div className="container mt-5 vaccine-table-container">
  <h6 className="mb-3 fw-bold custom-section-title">
    {t("filter_animals")}
  </h6>

  <div className="row g-2 mt-3 mb-3 align-items-end">
    {/* Input: Tag ID */}
    <div className="col-12 col-sm-6 col-md-3">
      <label htmlFor="tagIdInput" className="form-label">
        {t("tag_id")}
      </label>
      <input
        type="text"
        id="tagIdInput"
        className="form-control"
        placeholder={t("search_by_tag_id")}
        value={searchCriteria.tagId}
        onChange={(e) =>
          setSearchCriteria({
            ...searchCriteria,
            tagId: e.target.value,
          })
        }
      />
    </div>

    {/* زر البحث */}
    <div className="col-12 d-flex justify-content-end mt-2">
      <button className="btn btn-success" onClick={handleSearch}>
        <FiSearch /> {t("search")}
      </button>
    </div>
  </div>
</div>


                <div className="container mt-5 vaccine-table-container">
                    
                    <div className="table-responsive">
                        <div className="full-width-table">
                            <table className="table align-middle mt-4">
                                <thead>
                                    <tr>
                                        <th className="bg-color">#</th>
                                        <th className="bg-color">{t('tag_id')}</th>
                                        <th className="bg-color">{t('first_weight')}</th>
                                        <th className="bg-color">{t('last_weight')}</th>
                                        <th className="bg-color">{t('total_gain')}</th>
                                        <th className="bg-color">{t('adg')}</th>
                                        <th className="bg-color">{t('conversion_efficiency')}</th>
                                        <th className="bg-color">{t('growth_period_days')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {growthData.length > 0 ? (
                                        growthData.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td>{item.tagId}</td>
                                                <td>{item.growthData.firstWeight.weight} kg<br />{item.growthData.firstWeight.date?.split('T')[0]}</td>
                                                <td>{item.growthData.lastWeight.weight} kg<br />{item.growthData.lastWeight.date?.split('T')[0]}</td>
                                                <td>{item.growthData.overallGrowth.totalWeightGain} kg</td>
                                                <td>{item.growthData.overallGrowth.ADG?.toFixed(2)}</td>
                                                <td>{item.growthData.overallGrowth.conversionEfficiency?.toFixed(2)}</td>
                                                <td>{item.growthData.overallGrowth.growthPeriodDays} {t('days')}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted py-4">{t('no_data_found')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            {renderModernPagination()}
                        </nav>
                    </div>
                </div>
                </div>
            )}
        </>
    );
}

export default WithGrowthData;
