import ReactDOM from "react-dom/client"
import RegComponent from "./components/RegPage/Reg"
import { Provider } from "react-redux"
import store from "./store/store.js"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Auth from "./components/Auth/Auth.jsx"
import MainPage from "./MainPage.jsx"
import Profile from "./components/Profile/Profile.jsx"
import Patients from "./components/Patients/Patients.jsx"
import PatientCard from "./components/PatientCard/PatientCard.jsx"
import CreateInspection from "./components/Inspection/CreateInspection.jsx"
import InspectionDetails from "./components/Inspection/InspectionDetails.jsx"
import ConsultationsPage from "./components/Consultation/ConsultationsPage.jsx"

const router = createBrowserRouter([
  {
    path: '/register',
    element: <MainPage children = {RegComponent} />
  },
  {
    path: '/login',
    element: <MainPage children = {Auth} />
  },
  {
    path: '/profile',
    element: <MainPage children = {Profile} />
  },
  {
    path: '/patients',
    element: <MainPage children = {Patients} />
  },
  {
    path: '/patient/:id',
    element: <MainPage children = {PatientCard} />
  },
  {
    path: '/inspection/create',
    element: <MainPage children = {CreateInspection} />
  },
  {
    path: '/inspection/:id',
    element: <MainPage children = {InspectionDetails} />
  },
  {
    path: '/consultations',
    element: <MainPage children = {ConsultationsPage} />
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
)
