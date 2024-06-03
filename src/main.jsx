import ReactDOM from 'react-dom/client'
import RegComponent from './components/RegPage/Reg'
import { Layout } from 'antd'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Layout className='main'>
    <RegComponent />
  </Layout>
)
