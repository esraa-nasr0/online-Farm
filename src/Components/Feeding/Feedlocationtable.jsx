import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Feedbylocationcontext } from "../../Context/FeedbylocationContext.jsx";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { FaRegEdit } from "react-icons/fa";

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
      setTotalPages(data.pagination?.totalPages ?? 1);
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

  return (
    <>
      {isLoading ? (
        <div className="animal">
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#2f5e97"
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className="container">
          <div
            className="d-flex justify-content-between align-items-center mb-4"
            style={{ marginTop: "140px" }}
          >
            <h2 style={{ color: "#88522e" }}>Feed Records for sheds</h2>
            <Link to="/feedbylocation">
              <button
                type="button"
                className="btn btn-lg active"
                style={{
                  background: "#88522e",
                  color: "white",
                  borderColor: "#3a7d44",
                }}
              >
                <MdOutlineAddToPhotos /> Add New Feed
              </button>
            </Link>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4">
                        <input type="text" className="form-control" value={searchCriteria.locationShed} placeholder="Search locationShed" onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))} />
                        {/* <input
  type="text"
  className="form-control"
  value={searchCriteria.date}
  placeholder="Search date"
  onChange={(e) => {
    setSearchCriteria((prev) => {
      const newSearchCriteria = { ...prev, date: e.target.value };
      console.log("New Date:", newSearchCriteria.date);  // إضافة log للتأكد من أن القيمة تتغير
      return newSearchCriteria;
    });
  }}
/> */}

                        <button className="btn" onClick={handleSearch} style={{ backgroundColor: '#88522e', color: 'white' }}>
    <i className="fas fa-search"></i>
</button>

                    </div>
       
          <table className="table table-striped text-center mt-4">
            <thead>
              <tr>
                <th scope="col">Location Shed</th>
                <th scope="col">Quantity</th>
                <th scope="col">Date</th>
                <th scope="col">Feed Name</th>
                <th scope="col">Feed Price</th>
                    {/* <th>Edit</th> */}
                    <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {feedData.length > 0 ? (
                feedData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.locationShed}</td>
                    <td>{item?.feeds?.[0]?.quantity || "N/A"}</td>
                    <td>{item.date ? item.date.split("T")[0] : "N/A"}</td>
                    <td>{item?.feeds?.[0]?.feedName}</td>
                    <td>{item?.feeds?.[0]?.feedPrice}</td>
                    {/* <td
                                          style={{ cursor: "pointer", color: "#198754" }}
                                          onClick={() => Editfeed(item._id)}
                                        >
                                          <FaRegEdit/> Edit
                                        </td> */}
                      <td onClick={() => handleDelete(item._id)} className="text-danger" style={{ cursor: "pointer" }}>
                                        <RiDeleteBin6Line /> Remove
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
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
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
