import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Feedbylocationcontext } from "../../Context/FeedbylocationContext.jsx";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

function Feedlocationtable() {
  const navigate = useNavigate();
  const { getAllfeeds, Deletfeed } = useContext(Feedbylocationcontext);
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    locationShed: "",
    date: "",
  });

  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0);
  const animalsPerPage = 10;

  const fetchFeedData = async () => {
    try {
      setIsLoading(true);
      let { data } = await getAllfeeds(currentPage, animalsPerPage);

      if (data && data.data.feedShed) {
        console.log("API Response:", data);

        const filteredData = data.data.feedShed.filter((item) => {
          const formattedDate = item.date ? item.date.split("T")[0] : "";
          const matchesLocation = searchCriteria.locationShed
            ? item.locationShed
                .toLowerCase()
                .includes(searchCriteria.locationShed.toLowerCase())
            : true;
          const matchesDate = searchCriteria.date
            ? formattedDate === searchCriteria.date
            : true;

          return matchesLocation && matchesDate;
        });

        setFeedData(filteredData); // تعيين البيانات المصفاة
        setTotalPages(Math.ceil(data.data.totalCount / animalsPerPage)); // حساب عدد الصفحات
      } else {
        setFeedData([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching feed data:", error);
      setFeedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedData(); // استدعاء البيانات بناءً على معايير البحث
  };

  useEffect(() => {
    fetchFeedData(); // جلب البيانات عند تحميل الصفحة
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFeedData(); // جلب البيانات عند تغيير الصفحة
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Deletfeed(id); // استدعاء دالة الحذف
          setFeedData(feedData.filter((feed) => feed._id !== id));
          Swal.fire("تم الحذف!", "تم حذف السجل بنجاح.", "success");
          setIsLoading(true); // تشغيل حالة التحميل أثناء جلب البيانات
          await fetchFeedData(); // إعادة جلب البيانات
        } catch (error) {
          console.error("خطأ أثناء حذف السجل:", error);
          Swal.fire("خطأ!", "فشل في حذف السجل. يرجى المحاولة مرة أخرى.", "error");
        } finally {
          setIsLoading(false); // إيقاف حالة التحميل
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
            <h2 style={{ color: "#88522e" }}>Feed Records</h2>
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
          <div className="d-flex align-items-center gap-2 mt-4">
            <input
              type="text"
              className="form-control"
              value={searchCriteria.locationShed}
              placeholder="Search by locationShed"
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  locationShed: e.target.value,
                }))
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by date"
              value={searchCriteria.date}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
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
                <th scope="col">Location Shed</th>
                <th scope="col">Quantity</th>
                <th scope="col">Date</th>
                <th scope="col">Feed Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedData.length > 0 ? (
                feedData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.locationShed}</td>
                    <td>{item.quantity}</td>
                    <td>{item.date ? item.date.split("T")[0] : "N/A"}</td>
                    <td>{item.feedName}</td>
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
                                          <FaRegEdit/> Edit
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
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(1)}>First</button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
        </ul>
    </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedlocationtable;
