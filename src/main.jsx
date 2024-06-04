import ReactDOM from "react-dom/client"
import RegComponent from "./components/RegPage/Reg"
import { Provider } from "react-redux"
import store from "./store/store.js"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Auth from "./components/Auth/Auth.jsx"
import MainPage from "./MainPage.jsx"

const router = createBrowserRouter([
  {
    path: '/register',
    element: <MainPage children = {RegComponent} />
  },
  {
    path: '/login',
    element: <MainPage children = {Auth} />
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
)
