import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rings } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import { FiSearch } from "react-icons/fi";
import "./GrowthData.css"; // سيتم إنشاء هذا الملف

function WithGrowthData() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div className="loading-wrap">
                    <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className={`growth-container ${isRTL ? "rtl" : ""}`}>
                    <div className="toolbar">
                        <div className="growth-info">
                            <h2 className="growth-title">{t('Animal Growth')}</h2>
                            <p className="growth-subtitle">{t('manage_growth_data')}</p>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <h6 className="search-title">{t("filter_animals")}</h6>

                        <div className="search-fields">
                            <div className="search-field">
                                <label htmlFor="tagIdInput" className="search-label">
                                    {t("tag_id")}
                                </label>
                                <input
                                    type="text"
                                    id="tagIdInput"
                                    className="search-input"
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
                            <div className="search-button">
                                <button className="btn-search" onClick={handleSearch}>
                                    <FiSearch /> {t("search")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mobile-cards">
                        {growthData.length > 0 ? (
                            growthData.map((item, index) => (
                                <div key={item._id} className="growth-card">
                                    <div className="card-content">
                                        <div className="card-row">
                                            <span className="card-label">#</span>
                                            <span className="card-value">
                                                {(currentPage - 1) * limit + index + 1}
                                            </span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('tag_id')}</span>
                                            <span className="card-value">{item.tagId}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('first_weight')}</span>
                                            <span className="card-value">
                                                {item.growthData.firstWeight.weight} kg
                                                <br />
                                                <small>{item.growthData.firstWeight.date?.split('T')[0]}</small>
                                            </span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('last_weight')}</span>
                                            <span className="card-value">
                                                {item.growthData.lastWeight.weight} kg
                                                <br />
                                                <small>{item.growthData.lastWeight.date?.split('T')[0]}</small>
                                            </span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('total_gain')}</span>
                                            <span className="card-value">{item.growthData.overallGrowth.totalWeightGain} kg</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('adg')}</span>
                                            <span className="card-value">{item.growthData.overallGrowth.ADG?.toFixed(2)}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('conversion_efficiency')}</span>
                                            <span className="card-value">{item.growthData.overallGrowth.conversionEfficiency?.toFixed(2)}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">{t('growth_period_days')}</span>
                                            <span className="card-value">{item.growthData.overallGrowth.growthPeriodDays} {t('days')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data-mobile">
                                {t('no_data_found')}
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="table-wrapper">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">{t('tag_id')}</th>
                                    <th className="text-center">{t('first_weight')}</th>
                                    <th className="text-center">{t('last_weight')}</th>
                                    <th className="text-center">{t('total_gain')}</th>
                                    <th className="text-center">{t('adg')}</th>
                                    <th className="text-center">{t('conversion_efficiency')}</th>
                                    <th className="text-center">{t('growth_period_days')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {growthData.length > 0 ? (
                                    growthData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td className="text-center">{(currentPage - 1) * limit + index + 1}</td>
                                            <td className="text-center">{item.tagId}</td>
                                            <td className="text-center">
                                                {item.growthData.firstWeight.weight} kg
                                                <br />
                                                <small>{item.growthData.firstWeight.date?.split('T')[0]}</small>
                                            </td>
                                            <td className="text-center">
                                                {item.growthData.lastWeight.weight} kg
                                                <br />
                                                <small>{item.growthData.lastWeight.date?.split('T')[0]}</small>
                                            </td>
                                            <td className="text-center">{item.growthData.overallGrowth.totalWeightGain} kg</td>
                                            <td className="text-center">{item.growthData.overallGrowth.ADG?.toFixed(2)}</td>
                                            <td className="text-center">{item.growthData.overallGrowth.conversionEfficiency?.toFixed(2)}</td>
                                            <td className="text-center">{item.growthData.overallGrowth.growthPeriodDays} {t('days')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center no-data">
                                            {t('no_data_found')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-container">
                        {renderModernPagination()}
                    </div>
                </div>
            )}
        </>
    );
}

export default WithGrowthData;