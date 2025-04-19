import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import Footer from "../Footer/Footer";
import "./Layout.css";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const shouldShowSidebar = !['/', '/home', '/register', '/login', '/dashboard', '/forgetpassword', '/verifyotp', '/resetpassword'].includes(location.pathname);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    return (
        <>
            <div className="app-container">
                <Navbar 
                    toggleSidebar={toggleSidebar} 
                    isSidebarOpen={isSidebarOpen} 
                />

                <div className="content-wrapper">
                    {shouldShowSidebar && (
                        <Sidebare 
                            isOpen={isSidebarOpen} 
                            toggleSidebar={toggleSidebar} 
                        />
                    )}
                    <main className={`main-content ${isSidebarOpen && shouldShowSidebar ? "sidebar-open" : ""}`}>
                        <div className="content-container">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </>
    );
}
