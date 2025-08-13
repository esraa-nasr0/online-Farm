import axios from "axios";
import { createContext } from "react";

export const LocationContext = createContext();

const getHeaders = () => {
  const token = localStorage.getItem("Authorization") || "";
  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

function getLocationtMenue() {
  return axios
    .get(
      `https://farm-project-bbzj.onrender.com/api/location/GetAll-Locationsheds-menue`,
      { headers: getHeaders() }
    )
    .then((response) => response)
    .catch((err) => {
      console.error("Error fetching location menu:", err);
      throw err;
    });
}

function getVaccineMenue() {
  return axios
    .get(
      `https://farm-project-bbzj.onrender.com/api/vaccine/GetVaccine-menue`,
      { headers: getHeaders() }
    )
    .then((response) => response)
    .catch((err) => {
      console.error("Error fetching vaccine menu:", err);
      throw err;
    });
}

export default function LocationContextshedProvider({ children }) {
  return (
    <LocationContext.Provider value={{ getLocationtMenue, getVaccineMenue }}>
      {children}
    </LocationContext.Provider>
  );
}
