import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebare from "../Sidebare/Sidebare";
import Footer from "../Footer/Footer";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
            <Sidebare isOpen={isSidebarOpen} />
            <div className="w-100">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
