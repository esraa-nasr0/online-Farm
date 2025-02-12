import React from "react";
import { IoHome } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export const SidebarData = [
{
    title: "Dashboard",
    path: "dashboard",
    icon: <TbLayoutDashboardFilled />,
    cName: "nav-text"
},
{
    title: "Home",
    path: "/",
    icon: <IoHome />,
    cName: "nav-text"
},
{
    title: "Services",
    path: "services",
    icon: <MdMiscellaneousServices />,
    cName: "nav-text"
},
];

