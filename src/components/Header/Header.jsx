import { DownOutlined } from "@ant-design/icons"
import { Col, Dropdown, Menu, Row, Space, Typography } from "antd"
import { Header } from "antd/es/layout/layout"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetProfileQuery } from "../../api/userApi"



const HeaderComponent = () => {
  const { Title, Link, Text } = Typography
  const navigate = useNavigate()
  const {data: profile} = useGetProfileQuery({token: localStorage.getItem("token")})
  const [name, setName] = useState('')

  const items = [
    {
      label: <a style={{color:"black"}} onClick={()=>navigate("/profile")}>Профиль</a>,
      key: "0",
    },
    {
      label: (
        <a style={{color:"black"}} onClick={()=> {localStorage.clear(), navigate("/login")}}>
          Выход
        </a>
      ),
      key: "1",
    },
  ]

  useEffect(()=>{
    if(profile){
      setName(profile.name)
    }
  },[])
  return (
    <Header
      style={{
        height: "auto",
        marginBottom: "40px",
      }}
    >
      <Row align={"middle"} gutter={30}>
        <Col
          style={{
            backgroundImage: 'url("/src/assets/skull-svgrepo-com.svg")',
            backgroundRepeat: "no-repeat",
            width: "64px",
            height: "64px",
          }}
        />
        <Col>
          <Title
            level={3}
            style={{ textAlign: "end", margin: "0", color: "white" }}
          >
            Try not to
          </Title>
          <Title
            level={3}
            style={{
              margin: "0",
              fontWeight: "bold",
              textAlign: "end",
              color: "white",
            }}
          >
            Die
          </Title>
        </Col>
        {localStorage.getItem("token") && (
          <>
            <Col>
              <Link style={{ color: "white" }}>Пациенты</Link>
            </Col>
            <Col>
              <Link style={{ color: "white" }}>Консультации</Link>
            </Col>
            <Col>
              <Link style={{ color: "white" }}>Отчёты и статистика</Link>
            </Col>
          </>
        )}

        <Col style={{ marginLeft: "auto" }}>
          {(localStorage.getItem("token")) ? (
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Text style={{color:"white"}}>{name}</Text>
                  <DownOutlined style={{color:"white"}}/>
                </Space>
              </a>
            </Dropdown>
          ) : (
            <Link onClick={() => navigate("/login")} style={{ color: "white" }}>
              Войти
            </Link>
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default HeaderComponent
