import axios from "axios";
import { createContext } from "react";
import axiosInstance from "../api/axios";
export const AdminContext = createContext();

const getHeaders = () => {
  const Authorization = localStorage.getItem("Authorization");

  const formattedToken = Authorization?.startsWith("Bearer ")
    ? Authorization
    : `Bearer ${Authorization}`;

  return {
    Authorization: formattedToken,
  };
};

async function getAdminDashboard() {
  try {
    const res = await axiosInstance.get(
      "/stats/admin",
      { headers: getHeaders() }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return null;
  }
}

export default function AdminContextProvider(props) {
  return (
    <AdminContext.Provider value={{ getAdminDashboard }}>
      {props.children}
    </AdminContext.Provider>
  );
}
