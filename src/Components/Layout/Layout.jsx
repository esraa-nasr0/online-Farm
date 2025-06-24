import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import "./Layout.css";

export default function Layout() {
    const location = useLocation();

    
    // الصفحات التي نريد إخفاء الـ Sidebar فيها (صفحات المصادقة)
    const authPaths = [
        '/',
        '/login',
        '/register',
        '/forgetpassword',
        '/verifyotp',
        '/resetpassword'
    ];

    const isHomePage = location.pathname === '/home';
    const shouldShowSidebar = !authPaths.includes(location.pathname);
    const shouldShowNavbar = isHomePage;

    return (
        <div className="app-container">
            {shouldShowNavbar && <Navbar />}
            
            <div className="content-wrapper">
                {shouldShowSidebar && (
                    <Sidebare isOpen={!isHomePage} /> // Sidebar مفتوح في كل الصفحات ما عدا الهوم
                )}
                
                <main className={`main-content ${shouldShowSidebar && !isHomePage ? "with-sidebar" : ""}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}