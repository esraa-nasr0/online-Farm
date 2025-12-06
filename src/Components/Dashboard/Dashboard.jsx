import axiosInstance from "../../api/axios";
import { getToken } from "../../utils/authToken";
import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../Context/DashboardContext";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";


function Dashboard() {
  const { getUsers } = useContext(DashboardContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [DashPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
    const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";



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
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ====== Login as User (impersonation) ======
  const handleImpersonate = async (userId) => {
    const newTab = window.open("", "_blank");
    if (!newTab) {
      Swal.fire("Popup blocked", "Allow popups for this site and try again.", "warning");
      return;
    }

    const rawAdmin = getToken() || "";
    const adminAuth = rawAdmin.startsWith("Bearer ") ? rawAdmin : `Bearer ${rawAdmin}`;
    const frontOrigin = window.location.origin;

    try {
      // 1) ابدأ الانتحال
      const start = await axiosInstance.post(
        `/admin/users/${userId}/impersonate`,
        {},
        { headers: { Authorization: adminAuth } }
      );

      const url = start?.data?.data?.url;
      if (!url) throw new Error("No impersonation URL returned");

      const u = new URL(url);
      const impToken = u.searchParams.get("token");
      if (!impToken) throw new Error("Missing token from URL");

      // 2) redeem → خدي توكن اليوزر النهائي
      const redeem = await axiosInstance.get(
        `/auth/impersonate?token=${encodeURIComponent(impToken)}`
      );

      const userToken = redeem?.data?.data?.token;
      if (!userToken) throw new Error("No user token returned");

      // 3) حقني التوكن في sessionStorage للتاب الجديدة فقط
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
      newTab.close();
      const msg = e?.response?.data?.message || e?.message || "Failed to impersonate user";
      Swal.fire("Error", msg, "error");
    }
  };

  // Pagination UI (بدون تعديل لأنه شغال)
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
