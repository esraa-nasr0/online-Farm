import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Feedcontext } from "../../Context/FeedContext";
import { Rings } from "react-loader-spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../Vaccine/styles.css"

function FeedingTable() {
  const navigate = useNavigate();
  const { getAllFeed, Deletfeed } = useContext(Feedcontext);
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ name: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1); 
  const animalsPerPage = 10; 
  
  const [totalPages, setTotalPages] = useState(1); 

  const fetchFeedData = async () => {
    setIsLoading(true);
    try {
        const filters = {
            type: searchCriteria.type,
            name: searchCriteria.name,
        };

        const response = await getAllFeed(currentPage, animalsPerPage, filters);
        console.log("Full API Response:", response);

        if (response?.data?.feeds) {
          console.log(response.pagination.total);
          
            const totalAnimals = response.pagination.total?? response.data.feeds.length; 
            setTotalPages(Math.ceil(totalAnimals / animalsPerPage)); 
        } else {
            setTotalPages(1);
        }

        setFeedData(response.data.feeds || []);
    } catch (error) {
        console.error("Error fetching feed data:", error);
        setFeedData([]);
    } finally {
        setIsLoading(false);
    }
};


  useEffect(() => {
    fetchFeedData();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); 
    fetchFeedData();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Deletfeed(id);
          setFeedData(feedData.filter((feed) => feed._id !== id));
          Swal.fire("Deleted!", "Your feed has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting feed:", error);
          Swal.fire("Error!", "Failed to delete the feed. Please try again.", "error");
        }
      }
    });
  };

  const Editfeed = (id) => {
    navigate(`/editfeed/${id}`);
  };

  const handlePageChange = (pageNumber) => {
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
                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
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
                <button className="page-link pagination-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    &lt; Back
                </button>
            </li>
            {pageButtons}
            <li className={`page-item${currentPage === total ? ' disabled' : ''}`}>
                <button className="page-link pagination-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === total}>
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
          <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
        </div>
      ) : (
        <div className="container mt-5 vaccine-table-container">
       
         <h2 className="vaccine-table-title">Feed Records</h2>

       

                          <div className="row g-2 mb-3">
        <div className="col-md-4">
   <input
              type="text"
              className="form-control"
              value={searchCriteria.type}
              placeholder="Search type"
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, type: e.target.value }))}
            />
        </div>
        <div className="col-md-4">
  <input
              type="text"
              className="form-control"
              value={searchCriteria.name}
              placeholder="Search name"
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
            />
        </div>
   
          <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSearch}>search</button>
      </div>
      </div>


          <div className="full-width-table"  >
        
          <table className="table align-middle">
            <thead>
            <tr>
                <th scope="col" className="text-center bg-color">Feed Name</th>
                <th scope="col" className="text-center bg-color">Type</th>
                <th scope="col" className="text-center bg-color">Price / ton</th>
                <th scope="col" className="text-center bg-color">Concentration of Dry Matter (presentage %)</th>
             <th className="text-center bg-color">actions</th>
        
              </tr>
            </thead>
            <tbody>
              {feedData.length > 0 ? (
                feedData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.price}</td>
                    <td>{item.concentrationOfDryMatter}</td>
                                             <td className="text-center">
                                                                                                                                                                    
                                                                              <button className="btn btn-link p-0 me-2" onClick={() => Editfeed(item._id)} title='edit' style={{
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
                  <td colSpan="6">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
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








