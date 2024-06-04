import { Layout } from "antd"
import HeaderComponent from "./components/Header/Header"

const MainPage = (prop) => {
  return (
    <Layout className="main">
      <HeaderComponent />
      <prop.children />
    </Layout>
  )
}

export default MainPage
