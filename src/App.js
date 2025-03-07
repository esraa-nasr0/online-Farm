import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Animals from "./Components/Animals/Animals";
import AnimalsDetails from "./Components/Animals/AnimalsDetails";
import Mating from "./Components/Mating/Mating";
import Weight from "./Components/Weight/Weight";
import { UserContext } from "./Context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AnimalContextProvider from "./Context/AnimalContext";
import EditAnimal from "./Components/Animals/EditAnimal";
import MatingTable from "./Components/Mating/MatingTable.jsx";
import MatingContextProvider from "./Context/MatingContext";
import EditMating from "./Components/Mating/EditMating.jsx";
import Resetpassword from "./Components/Login/Resetpassword.jsx";
import Forgetpassword from "./Components/Login/Forgetpassword.jsx";
import Verifyotp from "./Components/Login/Verifyotp.jsx";
import Breeding from "./Components/Breeding/Breeding.jsx";
import WeightTable from "./Components/Weight/WeightTable.jsx";
import WeightContextProvider from "./Context/WeightContext.js";
import EditWeight from "./Components/Weight/EditWeight.jsx";
import BreedingcontextProvider from "./Context/BreedingContext.js";
import BreadingTable from "./Components/Breeding/BreadingTable.jsx";
import EditBreeding from "./Components/Breeding/EditBreeding.jsx";
import GetAnimalContextProvider from "./Context/GetAnimalContext.js";
import Report from "./Components/Report/Report.jsx";
import ReportDaliy from "./Components/Report/ReportDaliy.jsx";
import Vaccinebyanimal from "./Components/Vaccine/Vaccinebyanimal.jsx";
import Vaccinebylocationshed from "./Components/Vaccine/Vaccinebylocationshed.jsx";
import VaccineanimalContextProvider from "./Context/VaccineanimalContext.js";
import VaccineTable from "./Components/Vaccine/VaccineTable.jsx";
import EditVaccine from "./Components/Vaccine/EditVaccine.jsx";
import HomeServices from "./Components/Home/HomeServices.jsx";
import ExclutedContextProvider from "./Context/ExclutedContext.js";
import Excluted from "./Components/Excluted/Excluted.jsx";
import Exclutedtable from "./Components/Excluted/ExclutedTable.jsx";
import EditExcluted from "./Components/Excluted/EditExcluted.jsx";
import Treatment from "./Components/Treatment/Treatment.jsx";
import TreatmentContextProvider from "./Context/TreatmentContext.js";
import TreatmentTable from "./Components/Treatment/TreatmentTable.jsx";
import EditTreatment from "./Components/Treatment/EditTreatment.jsx";
import TreatmentLocation from "./Components/Treatment/TreatmentLocation.jsx";
import TreatmentAnimal from "./Components/Treatment/TreatmentAnimal.jsx";
import AnimalCost from "./Components/Animals/AnimalCost.jsx";
import TreatAnimalTable from "./Components/Treatment/TreatAnimalTable.jsx";
import EditTreatAnimal from "./Components/Treatment/EditTreatAnimal.jsx";
import FeedContextProvider from "./Context/FeedContext.js";
import FeedbyLocationContextProvider from "./Context/FeedbylocationContext.jsx";
import Editfeed from "./Components/Feeding/Editfeed.jsx";
import EditFeedbyLocation from "./Components/Feeding/Editfeedbylocation.jsx";
import Feedbylocation from "./Components/Feeding/Feedbylocation.jsx";
import FeedingTable from "./Components/Feeding/FeedingTable.jsx";
import Feedlocationtable from "./Components/Feeding/Feedlocationtable.jsx";
import Feed from "./Components/Feeding/Feed.jsx";
import Fodder from "./Components/Feeding/Fodder.jsx";
import FodderTable from "./Components/Feeding/FodderTable.jsx";
import ViewDetailsofAnimal from "./Components/Animals/ViewDetailsofAnimal.jsx";
import EditFodder from "./Components/Feeding/EditFodder.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import NotAuthorized from "./Components/Dashboard/NotAuthorized.jsx";
import DashboardContextProvider from "./Context/DashboardContext.js";



let routers = createBrowserRouter([
  {
    path: "", 
    element: <Layout />, 
    children: [
      { index: true, element: <Home/> },
      { path: "homeServices", element: <ProtectedRoute ><HomeServices/></ProtectedRoute> },
      { path: "report", element: <ProtectedRoute><Report/></ProtectedRoute> },
      { path: "reportDaliy", element: <ProtectedRoute><ReportDaliy/></ProtectedRoute> },
      { path: "excluted", element: <ProtectedRoute><Excluted/></ProtectedRoute> },
      { path: "exclutedtable", element: <ProtectedRoute><Exclutedtable/></ProtectedRoute> },
      { path: "editExcluted/:id", element: <ProtectedRoute><EditExcluted/></ProtectedRoute> },
      { path: "notAuthorized", element: <NotAuthorized /> },

      { path: "login", element: <Login /> },
      { path: "verifyotp", element: <Verifyotp /> },
      { path: "forgetpassword", element: <Forgetpassword /> },
      { path: "resetpassword", element: <Resetpassword /> },
      { path: "register", element: <Register /> },
      { path: "breeding", element: <ProtectedRoute><Breeding /></ProtectedRoute> },
      { path: "breadingTable", element: <ProtectedRoute><BreadingTable /></ProtectedRoute> },
      { path: "editbreading/:id", element: <ProtectedRoute><EditBreeding /></ProtectedRoute> },
      { path: "animals", element: <ProtectedRoute><Animals /></ProtectedRoute> },
      // { path: "uploadExcel", element: <ProtectedRoute><UploadExcel /></ProtectedRoute> },
      { path: "editAnimal/:id", element: <ProtectedRoute><EditAnimal /></ProtectedRoute> },
      { path: "animalsDetails", element: <ProtectedRoute><AnimalsDetails /></ProtectedRoute> },
      { path: "animalCost", element: <ProtectedRoute><AnimalCost/></ProtectedRoute> },
      { path:"viewDetailsofAnimal/:id", element: <ProtectedRoute><ViewDetailsofAnimal /></ProtectedRoute> },

      { path: "mating", element: <ProtectedRoute><Mating /></ProtectedRoute> },
      { path:"editMating/:id", element: <ProtectedRoute><EditMating /></ProtectedRoute> },
      { path: "matingTable", element: <ProtectedRoute><MatingTable /></ProtectedRoute> },
      { path: "weight", element: <ProtectedRoute><Weight /></ProtectedRoute> },
      { path: "weightTable", element: <ProtectedRoute><WeightTable /></ProtectedRoute> },
      { path: "editWeight/:id", element: <ProtectedRoute><EditWeight /></ProtectedRoute> },
      { path: "vaccinebyanimal", element: <ProtectedRoute><Vaccinebyanimal/></ProtectedRoute> },
      { path: "vaccinebylocationshed", element: <ProtectedRoute><Vaccinebylocationshed/></ProtectedRoute> },
      { path: "vaccineTable", element: <ProtectedRoute><VaccineTable/></ProtectedRoute> },
      { path: "editVaccine/:id", element: <ProtectedRoute><EditVaccine/></ProtectedRoute> },
      { path: "treatment", element: <ProtectedRoute><Treatment/></ProtectedRoute> },
      { path: "treatmentTable", element: <ProtectedRoute><TreatmentTable/></ProtectedRoute> },
      { path: "editTreatment/:id", element: <ProtectedRoute><EditTreatment/></ProtectedRoute> },
      { path: "treatmentLocation", element: <ProtectedRoute><TreatmentLocation/></ProtectedRoute> },
      { path: "treatmentAnimal", element: <ProtectedRoute><TreatmentAnimal/></ProtectedRoute> },
      { path: "treatAnimalTable", element: <ProtectedRoute><TreatAnimalTable/></ProtectedRoute> },
      { path: "editTreatAnimal/:id", element: <ProtectedRoute><EditTreatAnimal/></ProtectedRoute> },
      { path: "feed", element: <ProtectedRoute><Feed/></ProtectedRoute> },
      { path: "editfeed/:id", element: <ProtectedRoute><Editfeed/></ProtectedRoute> },
      { path: "editFeedbyLocation/:id", element: <ProtectedRoute><EditFeedbyLocation/></ProtectedRoute> },
      { path: "feedbylocation", element: <ProtectedRoute><Feedbylocation/></ProtectedRoute> },
      { path: "feedingTable", element: <ProtectedRoute><FeedingTable/></ProtectedRoute> },
      { path: "feedlocationtable", element: <ProtectedRoute><Feedlocationtable/></ProtectedRoute> },
      { path: "fodder", element: <ProtectedRoute><Fodder/></ProtectedRoute> },
      { path: "fodderTable", element: <ProtectedRoute><FodderTable/></ProtectedRoute> },
      { path: "editFodder/:id", element: <ProtectedRoute><EditFodder/></ProtectedRoute> },
      { path: "dashboard", element: <ProtectedRoute  allowedRoles={['admin']}><Dashboard/></ProtectedRoute> },


    ],
  },
]);





export default function App() {

  let {setAuthorization} = useContext(UserContext);
  
  useEffect(()=>{
    if(localStorage.getItem('Authorization')!== null){
      setAuthorization(localStorage.getItem('Authorization'))
    }

  },[]);

  return <>
  <DashboardContextProvider>
  <FeedbyLocationContextProvider>
  <FeedContextProvider>
  <TreatmentContextProvider>
  <ExclutedContextProvider>
  <VaccineanimalContextProvider>
  <GetAnimalContextProvider>
  <BreedingcontextProvider>
  <WeightContextProvider>
  <MatingContextProvider>
<AnimalContextProvider>
  <RouterProvider router={routers}>

  </RouterProvider>
  </AnimalContextProvider>
  </MatingContextProvider>
  </WeightContextProvider>
  </BreedingcontextProvider>
  </GetAnimalContextProvider>
  </VaccineanimalContextProvider>
  </ExclutedContextProvider>
  </TreatmentContextProvider>
  </FeedContextProvider>
  </FeedbyLocationContextProvider>
  </DashboardContextProvider>
  </>
}

