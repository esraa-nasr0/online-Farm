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
import BreedingcontextProvider from "./Context/BreedingContext.jsx";
import BreadingTable from "./Components/Breeding/BreadingTable.jsx";
import EditBreeding from "./Components/Breeding/EditBreeding.jsx";
import GetAnimalContextProvider from "./Context/GetAnimalContext.js";
import Report from "./Components/Report/Report.jsx";
import ReportDaliy from "./Components/Report/ReportDaliy.jsx";
import Vaccinebyanimal from "./Components/Vaccine/Vaccinebyanimal.jsx";
import Vaccinebyanimalsstable from "./Components/Vaccine/Vaccinebyanimalstable.js";
import Vaccinebylocationshed from "./Components/Vaccine/Vaccinebylocationshed.jsx";
import VaccineanimalContextProvider from "./Context/VaccineanimalContext.js";
import VaccineTable from "./Components/Vaccine/VaccineTable.jsx";
import EditVaccine from "./Components/Vaccine/EditVaccine.jsx";
import HomeServices from "./Components/Home/HomeServices.jsx";
import ExcludedContextProvider from "./Context/ExcludedContext.js";
import Excluded from "./Components/Excluded/Excluded.jsx";
import Excludedtable from "./Components/Excluded/Excludedtable.jsx";
import EditExcluded from "./Components/Excluded/EditExcluded.jsx";
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
import LocationContextProvider from "./Context/Locationshedcontext.js";
import VaccinetableentriescontextProvider from "./Context/Vaccinetableentriescontext.jsx";
import EditVaccineanimals from "./Components/Vaccine/EditVaccineanimals.jsx";
import Vaccinebytagid from "./Components/Vaccine/Vaccinebytagid.jsx";
import AnimalServices from "./Components/Services/AnimalServices.jsx";
import MatingServices from "./Components/Services/MatingServices.jsx";
import WeightServices from "./Components/Services/WeightServices.jsx";
import BreedingServices from "./Components/Services/BreedingServices.jsx";
import VaccineServices from "./Components/Services/VaccineServices.jsx";
import ExcludedServices from "./Components/Services/ExcludedServices.jsx";
import TreetmentServices from "./Components/Services/TreetmentSerivces.jsx";
import FeedingServices from "./Components/Services/FeedingServices.jsx";
import FodderServices from "./Components/Services/FodderServices.jsx";
import MatingLocation from "./Components/Mating/MatingLocation.jsx";
import LocationPost from "./Components/LocationShed/LocationPost.jsx";
import LocationContextshedProvider from "./Context/LocationContext.js";
import LocationTable from "./Components/LocationShed/LocationTable.jsx";
import EditLocation from "./Components/LocationShed/EditLocation.jsx";
import BreedPost from "./Components/Breed/BreedPost.jsx";
import BreedContextProvider from "./Context/BreedContext.js";
import BreedTable from "./Components/Breed/BreedTable.jsx";
import EditBreed from "./Components/Breed/EditBreed.jsx";
import LocationServices from "./Components/Services/LocationServices.jsx";
import BreedServices from "./Components/Services/BreedServices.jsx";
import Use from "./Components/Home/Usefullto.jsx";
import Features from "./Components/LastSection/LastSection.jsx"
import Manageemployee from "./Components/Section/Section.jsx";
import { SidebarProvider, useSidebar } from './Context/SidebarContext.jsx';
import NewvaccineContextProvider from "./Context/NewvaccineContext.jsx";
import ReportServices from "./Components/Services/ReportServices.jsx";
import { useTranslation } from "react-i18next";
import NotificationPage from "./Components/Notification/NotificationPage.jsx";
import Support from "./Components/Support/Support.jsx";
import Pharmacy from "./Components/Services/Pharmacy.jsx";
import WithGrowthData from "./Components/Weight/WithGrowthData.jsx";
import Supplier from "./Components/Suppliers/Supplier.jsx";
import SupplierTable from "./Components/Suppliers/SupplierTable.jsx";
import SupplierContextProvider from "./Context/SupplierContext.js";
import EditSupplier from "./Components/Suppliers/EditSupplier.jsx";
import SupplierServices from "./Components/Services/SupplierServices.jsx";
import LinkSupplierTreatment from "./Components/Suppliers/LinkSupplierTreatment.jsx";
import LinkSupplierFeed from "./Components/Suppliers/LinkSupplierFeed.jsx";






let routers = createBrowserRouter([
  {
    path: "", 
    element: <Layout />, 
    children: [
      { index: true, element: <Home/> },
      { path: "homeServices", element: <ProtectedRoute ><HomeServices/></ProtectedRoute> },
      { path: "report", element: <ProtectedRoute><Report/></ProtectedRoute> },
      { path: "reportDaliy", element: <ProtectedRoute><ReportDaliy/></ProtectedRoute> },
      { path: "excluded", element: <ProtectedRoute><Excluded/></ProtectedRoute> },
      { path: "excludedtable", element: <ProtectedRoute><Excludedtable/></ProtectedRoute> },
      { path: "editExcluded/:id", element: <ProtectedRoute><EditExcluded/></ProtectedRoute> },
      { path: "notAuthorized", element: <NotAuthorized /> },

      { path: "login", element: <Login /> },
      { path: "verifyotp", element: <Verifyotp /> },
      { path: "forgetpassword", element: <Forgetpassword /> },
      { path: "resetpassword", element: <Resetpassword /> },
      { path: "/Use", element: <Use /> },
      { path: "/Manageemployee", element: <Manageemployee /> },
      { path: "features", element: <Features /> },
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
      { path: "addVaccine", element: <ProtectedRoute><Vaccinebyanimal/></ProtectedRoute> },
      { path: "vaccinebylocationshed", element: <ProtectedRoute><Vaccinebylocationshed/></ProtectedRoute> },
      { path: "Vaccinebyanimalsstable", element: <ProtectedRoute><Vaccinebyanimalsstable/></ProtectedRoute> },
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

      { path: "editVaccineanimals/:id", element: <ProtectedRoute><EditVaccineanimals/></ProtectedRoute> },
      { path: "vaccinebytagid", element: <ProtectedRoute><Vaccinebytagid/></ProtectedRoute> },

      { path: "reportServices", element: <ProtectedRoute><ReportServices/></ProtectedRoute> },
      { path: "animalServices", element: <ProtectedRoute><AnimalServices/></ProtectedRoute> },
      { path: "matingServices", element: <ProtectedRoute><MatingServices/></ProtectedRoute> },
      { path: "weightServices", element: <ProtectedRoute><WeightServices/></ProtectedRoute> },
      { path: "breedingServices", element: <ProtectedRoute><BreedingServices/></ProtectedRoute> },
      { path: "vaccineServices", element: <ProtectedRoute><VaccineServices/></ProtectedRoute> },
      { path: "excludedServices", element: <ProtectedRoute><ExcludedServices/></ProtectedRoute> },
      { path: "treetmentServices", element: <ProtectedRoute><TreetmentServices/></ProtectedRoute> },
      { path: "feedingServices", element: <ProtectedRoute><FeedingServices/></ProtectedRoute> },
      { path: "fodderServices", element: <ProtectedRoute><FodderServices/></ProtectedRoute> },
      { path: "matingLocation", element: <ProtectedRoute><MatingLocation/></ProtectedRoute> },
      { path: "locationPost", element: <ProtectedRoute><LocationPost/></ProtectedRoute> },
      { path: "locationTable", element: <ProtectedRoute><LocationTable/></ProtectedRoute> },
      { path: "editLocation/:id", element: <ProtectedRoute><EditLocation/></ProtectedRoute> },
      { path: "breedPost", element: <ProtectedRoute><BreedPost/></ProtectedRoute> },
      { path: "breedTable", element: <ProtectedRoute><BreedTable/></ProtectedRoute> },
      { path: "editBreed/:id", element: <ProtectedRoute><EditBreed/></ProtectedRoute> },
      { path: "locationServices", element: <ProtectedRoute><LocationServices/></ProtectedRoute> },
      { path: "breedServices", element: <ProtectedRoute><BreedServices/></ProtectedRoute> },

      { path: "notificationPage", element: <ProtectedRoute><NotificationPage/></ProtectedRoute> },
      { path: "support", element: <ProtectedRoute><Support/></ProtectedRoute> },
      { path: "pharmacy", element: <ProtectedRoute><Pharmacy/></ProtectedRoute> },
      { path: "withGrowthData", element: <ProtectedRoute><WithGrowthData/></ProtectedRoute> },
      { path: "supplier", element: <ProtectedRoute><Supplier/></ProtectedRoute> },
      { path: "supplierTable", element: <ProtectedRoute><SupplierTable/></ProtectedRoute> },
      { path: "editSupplier/:id", element: <ProtectedRoute><EditSupplier/></ProtectedRoute> },
      { path: "SupplierServices", element: <ProtectedRoute><SupplierServices/></ProtectedRoute> },
      { path: "linkSupplierTreatment", element: <ProtectedRoute><LinkSupplierTreatment/></ProtectedRoute> },
      { path: "linkSupplierFeed", element: <ProtectedRoute><LinkSupplierFeed/></ProtectedRoute> },

    ],
  },
]);





export default function App() {

  let {setAuthorization} = useContext(UserContext);
   const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }, [i18n.language]);
  
  useEffect(()=>{
    if(localStorage.getItem('Authorization')!== null){
      setAuthorization(localStorage.getItem('Authorization'))
    }

  },[]);

  return <>
      <SidebarProvider>
        <SupplierContextProvider>
        <NewvaccineContextProvider>
    <VaccinetableentriescontextProvider>
  <BreedContextProvider>
  <LocationContextshedProvider>
  <LocationContextProvider>
  <DashboardContextProvider>
  <FeedbyLocationContextProvider>
  <FeedContextProvider>
  <TreatmentContextProvider>
  <ExcludedContextProvider>
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
  </ExcludedContextProvider>
  </TreatmentContextProvider>
  </FeedContextProvider>
  </FeedbyLocationContextProvider>
  </DashboardContextProvider>
  </LocationContextProvider>
  </LocationContextshedProvider>
  </BreedContextProvider>
  </VaccinetableentriescontextProvider>
        </NewvaccineContextProvider>
</SupplierContextProvider>
  </SidebarProvider>

  </>
}

