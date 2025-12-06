import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";
import { DashboardContext } from "../../Context/DashboardContext";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import "./Dashboard.css"; // استخدام نفس استايل Supplier

function Dashboard() {
  const navigate = useNavigate();
  const { getUsers } = useContext(DashboardContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [DashPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({ name: "", email: "" });

  const API_BASE = process.env.REACT_APP_API_BASE || "https://farm-project-bbzj.onrender.com";

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getUsers(currentPage, DashPerPage, searchCriteria);
      setUsers(data?.data?.users || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(t("fetch_error") || "Failed to fetch data");
      Swal.fire(t("error") || "Error", t("fetch_error") || "Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleImpersonate = async (userId) => {
    const newTab = window.open("", "_blank");
    if (!newTab) {
      Swal.fire("Popup blocked", "Allow popups for this site and try again.", "warning");
      return;
    }

    const rawAdmin = localStorage.getItem("Authorization") || "";
    const adminAuth = rawAdmin.startsWith("Bearer ") ? rawAdmin : `Bearer ${rawAdmin}`;
    const frontOrigin = window.location.origin;

    try {
      const start = await axios.post(
        `${API_BASE}/admin/users/${userId}/impersonate`,
        {},
        { headers: { Authorization: adminAuth } }
      );
      const url = start?.data?.data?.url;
      if (!url) throw new Error("No impersonation URL returned");

      const u = new URL(url);
      const impToken = u.searchParams.get("token");
      if (!impToken) throw new Error("Missing token from URL");

      const redeem = await axios.get(
        `${API_BASE}/auth/impersonate?token=${encodeURIComponent(impToken)}`
      );
      const userToken = redeem?.data?.data?.token;
      if (!userToken) throw new Error("No user token returned");

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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const renderPagination = () => {
    const total = totalPages;
    const pageButtons = [];
    const maxButtons = 5;

    const addPage = (page) => {
      pageButtons.push(
        <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
          <button className="page-link" onClick={() => paginate(page)}>
            {page}
          </button>
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
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${currentPage === total ? " disabled" : ""}`}>
          <button className="page-link pagination-arrow" onClick={() => paginate(currentPage + 1)} disabled={currentPage === total}>
            {t("next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-wrap">
          <Rings visible={true} height="100" width="100" color="#21763e" />
        </div>
      ) : (
        <div className={`supplier-container ${isRTL ? "rtl" : ""}`}>
          <div className="toolbar">
            <div className="supplier-info">
              <h2 className="supplier-title">{t("Dashboard")}</h2>
              <p className="supplier-subtitle">{t("manage_users")}</p>
            </div>
          </div>

        

          {/* Desktop Table View */}
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">{t("name")}</th>
                  <th className="text-center">{t("email")}</th>
                  <th className="text-center">{t("phone")}</th>
                  <th className="text-center">{t("country")}</th>
                  <th className="text-center">{t("user_type")}</th>
                  <th className="text-center">{t("login_as_user")}</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="text-center">{(currentPage - 1) * DashPerPage + index + 1}</td>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">{item.email}</td>
                      <td className="text-center">{item.phone}</td>
                      <td className="text-center">{item.country}</td>
                      <td className="text-center">{item.usertype}</td>
                      <td className="text-center">
                        <button className="btn-edit" onClick={() => handleImpersonate(item._id)}>
                          <IoPersonCircleOutline /> {t("login")}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center no-data">
                      {t("no_users_found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">{renderPagination()}</div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
