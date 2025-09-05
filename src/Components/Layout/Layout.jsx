// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ModernSidebar from "../Sidebare/ModernSidebar";

const BASE_URL = "https://farm-project-bbzj.onrender.com";

export default function Layout() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // ——— الحالة ثابتة ومحفوظة في localStorage ———
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? saved === "1" : false; // يبدأ مغلقاً لو مفيش قيمة محفوظة
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isRTL = i18n.language === "ar";
  const [isFattening, setIsFattening] = useState(false);

  // المسارات التي نخفي فيها الـ Sidebar
  const hideSidebarPaths = [
    "/",
    "/home",
    "/login",
    "/register",
    "/forgetpassword",
    "/verifyotp",
    "/resetpassword",
  ];

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    return token
      ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      : {};
  };

  // جلب الإشعارات
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: getHeaders(),
      });
      return res.data.data.notifications;
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ——— تحديث الـ isMobile بدون ما نقفل السايدبار ———
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ——— حفظ حالة الفتح/الغلق ———
  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen ? "1" : "0");
  }, [isSidebarOpen]);

  // ——— مفيش إغلاق عند الضغط خارج السايدبار ———
  // (اتشال الـ useEffect الخاص بـ mousedown والإغلاق)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // منطق إظهار الـ Sidebar و Navbar
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const shouldShowNavbar =
    location.pathname === "/" || location.pathname === "/home";

  return (
    <div className={`app-container ${isSidebarOpen && shouldShowSidebar ? "app-has-wide-sidebar" : ""}`}>
      {shouldShowNavbar && (
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          showSidebarToggle={shouldShowSidebar}
        />
      )}

      <div className={`content-wrapper ${isRTL ? "rtl" : "ltr"} ${shouldShowSidebar ? "should-show-sidebar" : "no-sidebar"}`}>
        {shouldShowSidebar && (
          <>
            {/* السايدبار نفسه */}
            <ModernSidebar
              isOpen={isSidebarOpen}
              isMobile={isMobile}
              isRTL={isRTL}
              notificationCount={unreadCount}
              isFattening={isFattening}
              onLogout={() => {
                localStorage.removeItem("Authorization");
                window.location.href = "/";
              }}
              onChangeLanguage={(lang) => {
                i18n.changeLanguage(lang);
                localStorage.setItem("lang", lang);
                document.dir = lang === "ar" ? "rtl" : "ltr";
              }}
              onToggle={toggleSidebar} // يفتح/يقفل من زرار الكولابس أو اللوجو فقط
            />

            {/* Scrim للموبايل للـ dim فقط — بدون onClick */}
            {isSidebarOpen && isMobile && <div className="sidebar-scrim" />}
          </>
        )}

        <main className={`main-content ${shouldShowSidebar && isSidebarOpen ? "with-sidebar" : "full-width"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}