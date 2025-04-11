import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import "./Layout.css";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="app-container">
            <Navbar toggleSidebar={toggleSidebar} />
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