import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import "./Layout.css";

export default function Layout() {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

    // الصفحات التي نريد إخفاء السايدبار فيها
    const hideSidebarPaths = [
        '/',
        '/home',
        '/login',
        '/register',
        '/forgetpassword',
        '/verifyotp',
        '/resetpassword'
    ];

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            // إغلاق السايدبار تلقائياً عند التبديل إلى الهاتف
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
    const shouldShowNavbar = location.pathname === '/' || location.pathname === '/home';

    return (
        <div className="app-container">
            {shouldShowNavbar && (
                <Navbar 
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    showSidebarToggle={shouldShowSidebar}
                />
            )}
            
            <div className="content-wrapper">
                {shouldShowSidebar && (
                    <Sidebare 
                        isOpen={isSidebarOpen} 
                        isMobile={isMobile}
                    />
                )}
                
                <main className={`main-content ${
                    shouldShowSidebar && isSidebarOpen && !isMobile ? "with-sidebar" : ""
                }`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}