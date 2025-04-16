import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import "./Layout.css";
import { useEffect } from "react";


export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // useEffect(() => {
    //     if (window.innerWidth <= 768) {
    //         setIsSidebarOpen(false); // خليه مقفول على الموبايل
    //     }
    // }, []);

    return (
        <div className="app-container">
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="content-wrapper">
                <Sidebare isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                    <div className="content-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}