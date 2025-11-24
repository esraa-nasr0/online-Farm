// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { getToken, clearToken } from "../../utils/authToken";
import ModernSidebar from "../Sidebare/ModernSidebar";
import MobileNavbar from "../MobileNavbar/MobileNavbar";

const BASE_URL = "https://farm-project-bbzj.onrender.com";

export default function Layout() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? saved === "1" : false;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isRTL = i18n.language === "ar" || i18n.language === "ur";
  const [isFattening, setIsFattening] = useState(false);

  const hideSidebarPaths = [
    "/",
    "/home",
    "/login",
    "/register",
    "/forgetpassword",
    "/verifyotp",
    "/resetpassword",
  ];

  const { data: notifCheckData } = useQuery({
    queryKey: ["notifications", "check", i18n.language],
    queryFn: async () => {
      const lang = i18n.language || "en";
      const res = await axiosInstance.get(`${BASE_URL}/api/notifications/check`, {
        params: { lang },
      });

      // متوقع يرجع حاجة زي:
      // { status: "success", data: { unreadCount, hasNew, ... } }
      return res.data?.data || { unreadCount: 0, hasNew: false };
    },
    refetchInterval: 60000, // كل 60 ثانية يشيك تاني (اختياري)
  });

  const unreadCount = notifCheckData?.unreadCount ?? 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen ? "1" : "0");
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const shouldShowNavbar =
    location.pathname === "/" || location.pathname === "/home";

  return (
    <div
      className={`app-container ${
        isSidebarOpen && shouldShowSidebar ? "app-has-wide-sidebar" : ""
      }`}
    >
      {/* ✨ Navbar العادي يظهر بس في المسارات المحددة */}
      {shouldShowNavbar && !isMobile && (
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          showSidebarToggle={shouldShowSidebar}
        />
      )}

      {/* ✨ Navbar خاص بالموبايل */}
      {isMobile && shouldShowSidebar && (
        <MobileNavbar
          toggleSidebar={toggleSidebar}
          notificationCount={unreadCount}
        />
      )}

      <div
        className={`content-wrapper ${isRTL ? "rtl" : "ltr"} ${
          shouldShowSidebar ? "should-show-sidebar" : "no-sidebar"
        }`}
      >
        {shouldShowSidebar && (
          <>
            {/* Sidebar */}
            <ModernSidebar
              isOpen={isSidebarOpen}
              isMobile={isMobile}
              isRTL={isRTL}
              notificationCount={unreadCount}
              isFattening={isFattening}
              onLogout={() => {
                clearToken();
                window.location.href = "/";
              }}
              onChangeLanguage={(lang) => {
                i18n.changeLanguage(lang);
                localStorage.setItem("lang", lang);
                document.dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
              }}
              onToggle={toggleSidebar}
            />

            {/* scrim في الموبايل */}
            {isSidebarOpen && isMobile && (
              <div className="sidebar-scrim" onClick={toggleSidebar} />
            )}
          </>
        )}

        <main
          className={`main-content ${
            shouldShowSidebar && isSidebarOpen ? "with-sidebar" : "full-width"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}