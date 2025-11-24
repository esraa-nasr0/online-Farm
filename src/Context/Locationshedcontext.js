import axiosInstance from "../api/axios";
import { createContext } from "react";

export const LocationContext = createContext();

function getLocationtMenue() {
  return axiosInstance
    .get(`/location/GetAll-Locationsheds-menue`)
    .then((response) => response)
    .catch((err) => {
      console.error("Error fetching location menu:", err);
      throw err;
    });
}

function getVaccineMenue() {
  return axiosInstance
    .get(`/vaccine/GetVaccine-menue`)
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
