import axios from "axios";
import { createContext } from "react";

const getHeaders = () => {
  const Authorization = localStorage.getItem("Authorization");
  const formattedToken = Authorization?.startsWith("Bearer ")
    ? Authorization
    : `Bearer ${Authorization}`;

  return {
    Authorization: formattedToken,
  };
};

export const VaccineTypeContext = createContext();

async function addVaccineType(formData) {
  const headers = getHeaders();
  const res = await axios.post(
    "https://farm-project-bbzj.onrender.com/api/vaccine-types/add",
    formData,
    { headers }
  );
  return res;
}

async function getVaccineTypes() {
  const headers = getHeaders();
  const res = await axios.get(
    "https://farm-project-bbzj.onrender.com/api/vaccine-types",
    { headers }
  );
  return res.data; // بيرجع array من الفاكسينز
}

export default function VaccineTypeContextProvider({ children }) {
  return (
    <VaccineTypeContext.Provider value={{ addVaccineType, getVaccineTypes }}>
      {children}
    </VaccineTypeContext.Provider>
  );
}
