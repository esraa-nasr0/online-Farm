import axios from "axios";
import { createContext } from "react";
export let GetAnimalContext = createContext();


// Helper function to generate headers with the latest token
const getHeaders = () => {
  const Authorization = localStorage.getItem('Authorization');

  // Ensure the token has only one "Bearer" prefix
  const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

  return {
      Authorization: formattedToken
  };
};

    function getAnimalVaccine(animalid) {
      const headers = getHeaders(); // Get the latest headers

        return axios
          .get(
            `https://farm-project-bbzj.onrender.com/api/vaccine/GetVaccineForAnimal/${animalid}`,
            { headers }
          )
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
      const headers = getHeaders(); // Get the latest headers
        return axios.get(`https://farm-project-bbzj.onrender.com/api/mating/GetSingleAnimalMating/${animalid}` , {headers})
        .then((response)=>response)
        .catch((err)=>err)
    }

    function getAnimalBreeding(animalid) {
      const headers = getHeaders(); // Get the latest headers
      return axios.get(`https://farm-project-bbzj.onrender.com/api/breeding/GetSingleAnimalBreeding/${animalid}` , {headers})
      .then((response)=>response)
      .catch((err)=>err)
  }
  

    
  function getAnimalWeight(animalid) {
    const headers = getHeaders(); // Get the latest headers
      return axios.get(`https://farm-project-bbzj.onrender.com/api/weight/GetSingleAnimalWeight/${animalid}` , {headers})
      .then((response)=>response)
      .catch((err)=>err)
  }
 

  function getAnimalTreatment(animalid) {
    const headers = getHeaders(); // Get the latest headers
    return axios.get(`https://farm-project-bbzj.onrender.com/api/treatment/gettreatmentsForAnimal/${animalid}` , {headers})
    .then((response)=>response)
    .catch((err)=>err)
}
  
export default function GetAnimalContextProvider(props) {
    return <GetAnimalContext.Provider value={{getAnimalVaccine,getAnimalMating,getAnimalBreeding,getAnimalWeight,getAnimalTreatment}}>
            {props.children}      
        </GetAnimalContext.Provider>
    
}