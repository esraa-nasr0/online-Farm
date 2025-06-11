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

function FeedingTable() {
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


  const fetchFeedData = async () => {
    try {
      const filters = { locationShed: searchCriteria.locationShed, date: searchCriteria.date };
      console.log("Filters:", filters);  
      setIsLoading(true);
    
      const { data } = await getAllfeeds(currentPage, animalsPerPage, filters);
      console.log(data);
      
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
         
          await Deletfeed(id);
  
          
          await fetchFeedData();  
  
          Swal.fire("Deleted!", "Your feedShed has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting feedShed:", error);
          Swal.fire("Error!", "Failed to delete the feedShed. Please try again.", "error");
        }
      }
    });
  };
  

  const Editfeed = (id) => {
    navigate(`/editfeedbylocation/${id}`);
  };

  // Modern pagination rendering function
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
                    &lt; Back
                </button>
            </li>
            {pageButtons}
            <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === total}>
                    Next &gt;
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
            color="#9cbd81"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className="container mt-5 vaccine-table-container">
                    <h2 className="vaccine-table-title">Feed by location shed</h2>

      
                                          <div className="row g-2 mb-3">
        <div className="col-md-4">
                        <input type="text" className="form-control" value={searchCriteria.locationShed} placeholder="Search locationShed" onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))} />

        </div>
        <div className="col-md-4">
  <input
  type="text"
  className="form-control"
  value={searchCriteria.date}
  placeholder="Search date"
  onChange={(e) => {
    setSearchCriteria((prev) => {
      const newSearchCriteria = { ...prev, date: e.target.value };
      console.log("New Date:", newSearchCriteria.date);  
      return newSearchCriteria;
    });
  }}
/>
        </div>
  
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>search</button>
      </div>
      </div>
       
          <table className="table table-striped text-center mt-4">
            <thead>
              <tr>
                <th scope="col" className="text-center bg-color">Location Shed</th>
                <th scope="col" className="text-center bg-color">Quantity</th>
                <th scope="col" className="text-center bg-color">Date</th>
                <th scope="col" className="text-center bg-color">Feed Name</th>
                                <th scope="col" className="text-center bg-color">Feed Price</th>
            <th className="text-center bg-color">actions</th>
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
                                                                                         
 <button className="btn btn-link p-0 me-2"   onClick={() => Editfeed(item._id)} title='edit' style={{
     color:"#808080"
   }}><FaRegEdit /></button>
   <button className="btn btn-link  p-0" style={{
     color:"#808080"
   }} onClick={() => handleDelete(item._id)} title='delete'  ><RiDeleteBinLine/></button>
                                                                              </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No records found for the search criteria.</td>
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

export default FeedingTable;
