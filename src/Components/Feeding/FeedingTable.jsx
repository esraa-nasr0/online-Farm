import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Feedcontext } from "../../Context/FeedContext";
import { Rings } from "react-loader-spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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


  
  return (
    <>
      {isLoading ? (
        <div className="animal">
          <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
        </div>
      ) : (
        <div className="">
             <div className="d-flex container flex-column flex-md-row justify-content-between align-items-center mb-4" style={{ marginTop: "140px" }}>
             <h2 style={{ color: "#88522e" }} className="bottom-line pb-2">Feed Records</h2>
                                      <div className='d-flex flex-column flex-sm-row gap-2'>
                <Link to="/feed">
              <button type="button" className="btn btn-lg active" style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" }}>
                <MdOutlineAddToPhotos /> Add New Feed
              </button>
            </Link> <Link to="/feedlocationtable">
              <button type="button" className="btn btn-lg active" style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" }}>
                <MdOutlineAddToPhotos /> +Feed for shed
              </button>
            </Link>
                                        </div>
         
                                  </div>
         

          <div className="d-flex container flex-column flex-md-row align-items-center gap-2 mt-4" style={{ flexWrap: 'nowrap' }}>
            <input
              type="text"
              className="form-control"
              value={searchCriteria.type}
              placeholder="Search type"
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, type: e.target.value }))}
            />
            <input
              type="text"
              className="form-control"
              value={searchCriteria.name}
              placeholder="Search name"
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
            />
            <button className="btn" onClick={handleSearch} style={{ backgroundColor: '#88522e', borderColor: '#88522e', color: 'white' }}>
              <i className="fas fa-search" style={{ background: "#88522e" }}></i>
            </button>
          </div>
          <div className="full-width-table"  >


        
          <table className="table table-striped text-center mt-4">
            <thead>
            <tr>
                <th scope="col">Feed Name</th>
                <th scope="col">Type</th>
                <th scope="col">Price</th>
                <th scope="col">Concentration of Dry Matter</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
         
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
                    <td style={{ cursor: "pointer", color: "#198754" }} onClick={() => Editfeed(item._id)}>
                      <FaRegEdit /> Edit
                    </td>
                    <td onClick={() => handleDelete(item._id)} className="text-danger" style={{ cursor: "pointer" }}>
                      <RiDeleteBin6Line /> Remove
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
        <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
</div>

        </div>
      )}
    </>
  );
}

export default FeedingTable;








