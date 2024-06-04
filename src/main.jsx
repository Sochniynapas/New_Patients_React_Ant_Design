import ReactDOM from "react-dom/client"
import RegComponent from "./components/RegPage/Reg"
import { Layout } from "antd"
import "./index.css"
import { Provider } from "react-redux"
import store from "./store/store.js"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegComponent />
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Layout className="main">
      <RouterProvider router={router} />
    </Layout>
  </Provider>
)
