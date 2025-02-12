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
  const [totalPages, setTotalPages] = useState(0);
  const animalsPerPage = 10;

  const fetchFeedData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllFeed();
      if (data && data.feeds) {
        // فلترة البيانات بناءً على معايير البحث
        const filteredData = data.feeds.filter((feed) => {
          const nameMatch = feed.name.toLowerCase().includes(searchCriteria.name.toLowerCase());
          const typeMatch = feed.type.toLowerCase().includes(searchCriteria.type.toLowerCase());
          return nameMatch && typeMatch;
        });

        // حساب عدد الصفحات
        const totalItems = filteredData.length;
        setTotalPages(Math.ceil(totalItems / animalsPerPage));

        // تحديد البيانات المعروضة للصفحة الحالية
        const startIndex = (currentPage - 1) * animalsPerPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + animalsPerPage);
        
        setFeedData(paginatedData);
      } else {
        console.error("Unexpected data structure:", data);
        setFeedData([]);
      }
    } catch (error) {
      console.error("Error fetching feed data:", error);
      setFeedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [currentPage, searchCriteria]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // عند تغيير معايير البحث، نعيد الصفحة إلى 1
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
            <h2 style={{ color: "#88522e" }}>Feed Records</h2>
            <Link to="/feed">
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
            <Link to="/feedlocationtable">
              <button
                type="button"
                className="btn btn-lg active "
                style={{
                  background: "#88522e",
                  color: "white",
                  borderColor: "#3a7d44",
                }}
              >
                <MdOutlineAddToPhotos />  Feeding By Location
              </button>
            </Link>
          </div>
          <div className="d-flex align-items-center gap-2 mt-4">
            <input
              type="text"
              className="form-control"
              value={searchCriteria.name}
              placeholder="Search by name"
              onChange={(e) =>
                setSearchCriteria((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="text"
              className="form-control"
              value={searchCriteria.type}
              placeholder="Search by type"
              onChange={(e) =>
                setSearchCriteria((prev) => ({ ...prev, type: e.target.value }))
              }
            />
            <button
              className="btn"
              onClick={handleSearch}
              style={{
                backgroundColor: "#88522e",
                borderColor: "#88522e",
                color: "white",
              }}
            >
              <i className="fas fa-search" style={{ background: "#88522e" }}></i>
            </button>
          </div>
          <table className="table table-striped text-center mt-4">
            <thead>
              <tr>
                <th scope="col">Feed Name</th>
                <th scope="col">Type</th>
                <th scope="col">Price</th>
                <th scope="col">Concentration of Dry Matter</th>
                <th scope="col">Quantity</th>
                <th scope="col">Delete</th>
                <th scope="col">Edit</th>
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
                    <td>{item.quantity}</td>
                    <td
                      onClick={() => handleDelete(item._id)}
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                    >
                      <RiDeleteBin6Line /> Remove
                    </td>
                    <td
                      style={{ cursor: "pointer", color: "#88522e" }}
                      onClick={() => Editfeed(item._id)}
                    >
                      <FaRegEdit /> Edit
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

          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(1)}>
                    First
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {/* Add page number navigation */}
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(totalPages)}
                  >
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedingTable;
