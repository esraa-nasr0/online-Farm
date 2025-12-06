import axiosInstance from "../api/axios";
import { createContext } from "react";
export let GetAnimalContext = createContext();

    function getAnimalVaccine(animalid) {
        return axiosInstance
          .get(`/vaccine/GetVaccineForAnimal/${animalid}`)
          .then((response) => {
            console.log("Response Data:", response.data);
            return response.data; 
          })
          .catch((err) => {
            console.error("Error:", err); 
            throw err; 
          });
    }

    function getAnimalMating(animalid) {
        return axiosInstance.get(`/mating/GetSingleAnimalMating/${animalid}`)
        .then((response)=>response)
        .catch((err)=>err)
    }

    function getAnimalBreeding(animalid) {
      return axiosInstance.get(`/breeding/GetSingleAnimalBreeding/${animalid}`)
      .then((response)=>response)
      .catch((err)=>err)
  }
  

    
  function getAnimalWeight(animalid) {
      return axiosInstance.get(`/weight/GetSingleAnimalWeight/${animalid}`)
      .then((response)=>response)
      .catch((err)=>err)
  }
 

  function getAnimalTreatment(animalid) {
    return axiosInstance.get(`/treatment/gettreatmentsForAnimal/${animalid}`)
    .then((response)=>response)
    .catch((err)=>err)
}
  
export default function GetAnimalContextProvider(props) {
    return <GetAnimalContext.Provider value={{getAnimalVaccine,getAnimalMating,getAnimalBreeding,getAnimalWeight,getAnimalTreatment}}>
            {props.children}      
        </GetAnimalContext.Provider>
    
}