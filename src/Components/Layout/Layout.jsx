// src/components/Layout/Layout.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // دائماً يبدأ مغلقاً
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isFattening, setIsFattening] = useState(false);
  const sidebarRef = useRef(null);

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

  // متابعة حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // على الجوال، نغلق السايدبار تلقائياً عند تغيير حجم الشاشة
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // إغلاق السايدبار عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.navbar-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

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
            <div ref={sidebarRef}>
              <ModernSidebar
                isOpen={isSidebarOpen}
                isMobile={isMobile}
                isRTL={isRTL}
                notificationCount={unreadCount}
                isFattening={isFattening}
                onLogout={() => { 
                  localStorage.removeItem("Authorization"); 
                  window.location.href="/"; 
                }}
                onChangeLanguage={(lang) => { 
                  i18n.changeLanguage(lang); 
                  localStorage.setItem("lang", lang); 
                  document.dir = lang === "ar" ? "rtl" : "ltr"; 
                }}
                onToggle={toggleSidebar}
              />
            </div>
            {isSidebarOpen && isMobile && (
              <div className="sidebar-scrim" onClick={() => setIsSidebarOpen(false)} />
            )}
          </>
        )}

        <main className={`main-content ${shouldShowSidebar && isSidebarOpen ? "with-sidebar" : "full-width"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}