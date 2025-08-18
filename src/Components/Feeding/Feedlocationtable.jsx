import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Feedbylocationcontext } from "../../Context/FeedbylocationContext.jsx";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import "../Vaccine/styles.css"
import { useTranslation } from 'react-i18next';

function FeedlocationTable() {
  const navigate = useNavigate();
  const { getAllfeeds, Deletfeed } = useContext(Feedbylocationcontext);
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    locationShed: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1); 
  const animalsPerPage = 10; 
  const [totalPages, setTotalPages] = useState(1); 
  const { t } = useTranslation();

  const fetchFeedData = async () => {
    try {
      const filters = { locationShed: searchCriteria.locationShed, date: searchCriteria.date };
      setIsLoading(true);
      const { data } = await getAllfeeds(currentPage, animalsPerPage, filters);
      setFeedData(data.data.feedShed || []);
      setTotalPages(data.data.pagination?.totalPages ?? 1);
    } catch (error) {
      console.error("Error fetching feed data:", error);
      setFeedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedData();
  };

  useEffect(() => {
    fetchFeedData(); 
  }, [currentPage]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: t('delete_confirmation_title'),
      text: t('delete_confirmation_text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yes_delete_it'),
      cancelButtonText: t('cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Deletfeed(id);
          await fetchFeedData();  
          Swal.fire(t('deleted'), t('feed_deleted_success'), "success");
        } catch (error) {
          console.error("Error deleting feedShed:", error);
          Swal.fire(t('error'), t('delete_feed_error'), "error");
        }
      }
    });
  };

  const Editfeed = (id) => {
    navigate(`/editfeedbylocation/${id}`);
  };

  const renderModernPagination = () => {
    const total = totalPages;
    const pageButtons = [];
    const maxButtons = 5;
    const addPage = (page) => {
        pageButtons.push(
            <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
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
                <button className="page-link pagination-arrow" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    &lt; {t('back')}
                </button>
            </li>
            {pageButtons}
            <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === total}>
                    {t('next')} &gt;
                </button>
            </li>
        </ul>
    );
  };

  return (
    <>
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
          <h2 className="vaccine-table-title">{t('feed_by_location')}</h2>

          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control" 
                value={searchCriteria.locationShed} 
                placeholder={t('search_location_placeholder')} 
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))} 
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={searchCriteria.date}
                placeholder={t('search_date_placeholder')}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-outline-secondary" onClick={handleSearch}>{t('search')}</button>
            </div>
          </div>
       
          <table className="table table-striped text-center mt-4">
            <thead>
              <tr>
                <th scope="col" className="text-center bg-color">{t('location_shed')}</th>
                <th scope="col" className="text-center bg-color">{t('quantity')}</th>
                <th scope="col" className="text-center bg-color">{t('date')}</th>
                <th scope="col" className="text-center bg-color">{t('feed_name')}</th>
                <th scope="col" className="text-center bg-color">{t('feed_price')}</th>
                <th className="text-center bg-color">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {feedData.length > 0 ? (
                feedData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.locationShed?.locationShedName || item.locationShed || '-'}</td>
                    <td>{item?.feeds?.[0]?.quantity || "N/A"}</td>
                    <td>{item.date ? item.date.split("T")[0] : "N/A"}</td>
                    <td>{item?.feeds?.[0]?.feedName}</td>
                    <td>{item?.feeds?.[0]?.feedPrice}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-link p-0 me-2"   
                        onClick={() => Editfeed(item._id)} 
                        title={t('edit')} 
                        style={{ color: "#0f7e34ff" }}
                      >
                        <FaRegEdit />
                      </button>
                      <button 
                        className="btn btn-link p-0" 
                        style={{ color:"#d33" }} 
                        onClick={() => handleDelete(item._id)} 
                        title={t('delete')}
                      >
                        <RiDeleteBinLine/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">{t('no_records_found')}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-4">
            <nav>
              {renderModernPagination()}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedlocationTable;