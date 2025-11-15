import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../Context/DashboardContext";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { IoPersonCircleOutline } from "react-icons/io5";

function Dashboard() {
  const { getUsers } = useContext(DashboardContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [DashPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // CRA: خدي الـ API من .env.local -> REACT_APP_API_BASE
  const API_BASE =
    process.env.REACT_APP_API_BASE || "https://farm-project-bbzj.onrender.com";

  // تحميل بيانات المستخدمين
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getUsers(currentPage, DashPerPage);
      setUsers(data?.data?.users || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch data");
      Swal.fire("Error", "Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ====== Login as User (impersonation) ======
  const handleImpersonate = async (userId) => {
    // افتحي تاب قبل أي await عشان تمنعي الـ popup blocker
    const newTab = window.open("", "_blank");
    if (!newTab) {
      Swal.fire("Popup blocked", "Allow popups for this site and try again.", "warning");
      return;
    }

    // هيدر الإدمن: ضيفي Bearer لو مش موجود
   const rawAdmin = localStorage.getItem("Authorization") || "";
const adminAuth = rawAdmin.startsWith("Bearer ") ? rawAdmin : `Bearer ${rawAdmin}`;


    const frontOrigin = window.location.origin; // مثال: http://localhost:3000

    try {
      // 1) ابدأ الانتحال -> URL فيه ?token=...
      const start = await axios.post(
        `${API_BASE}/admin/users/${userId}/impersonate`,
        {},
        { headers: { Authorization: adminAuth } }
      );
      const url = start?.data?.data?.url;
      if (!url) throw new Error("No impersonation URL returned");

      // 2) استخرجي imp token من الـ URL
      const u = new URL(url);
      const impToken = u.searchParams.get("token");
      if (!impToken) throw new Error("Missing token from URL");

      // 3) redeem -> خدي توكن اليوزر العادي
      const redeem = await axios.get(
        `${API_BASE}/auth/impersonate?token=${encodeURIComponent(impToken)}`
      );
      const userToken = redeem?.data?.data?.token;
      if (!userToken) throw new Error("No user token returned");

      // 4) حقني التوكن في sessionStorage للتاب الجديدة فقط، ثم رديّركتي للهوم
      const html = `
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Switching...</title></head>
<body style="font-family:system-ui;padding:20px">Switching user...</body>
<script>
try {
  sessionStorage.setItem("impersonation","1");
  sessionStorage.setItem("token","${userToken}");
} catch (e) {}
location.replace("${frontOrigin}/");
</script>
</html>`;
      newTab.document.open();
      newTab.document.write(html);
      newTab.document.close();
    } catch (e) {
      try { newTab.close(); } catch (_) {}
      const msg = e?.response?.data?.message || e?.message || "Failed to impersonate user";
      Swal.fire("Error", msg, "error");
    }
  };
  // ===========================================

  // Pagination UI
  const renderModernPagination = () => {
    const total = totalPages;
    const pageButtons = [];
    const maxButtons = 5;
    const addPage = (page) => {
      pageButtons.push(
        <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
          <button className="page-link" onClick={() => paginate(page)}>{page}</button>
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
      for (let i = start; i <= end; i++) if (i > 1 && i < total) addPage(i);
      if (currentPage < total - 2) pageButtons.push(<li key="end-ellipsis" className="pagination-ellipsis">...</li>);
      addPage(total);
    }
    return (
      <ul className="pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button className="page-link pagination-arrow" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            &lt; Back
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
            Next &gt;
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Rings visible={true} height="100" width="100" color="#21763e" ariaLabel="rings-loading" />
        </div>
      ) : (
        <div className="container">
          <h1 className="title2">Admin Dashboard</h1>
          {error && <p className="text-danger mt-3">{error}</p>}

          <table className="table table-hover mt-4" aria-label="Users Table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User Type</th>
                <th>Country</th>
                <th>Login as User</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((item, index) => (
                  <tr key={item._id || index}>
                    <th scope="row">{(currentPage - 1) * DashPerPage + index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.usertype}</td>
                    <td>{item.country}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleImpersonate(item._id)}
                        title="Open a new tab as this user"
                      >
                        <IoPersonCircleOutline size={18} /> Login as User
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No Users found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-center mt-4">
            <nav>{renderModernPagination()}</nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
