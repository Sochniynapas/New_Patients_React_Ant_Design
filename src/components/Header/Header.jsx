import { Col, Menu, Row, Typography } from "antd"
import { Header } from "antd/es/layout/layout"
import { useSelector } from "react-redux"
import { selectName } from "../../store/slice/authSlice"

const HeaderComponent = () => {
  const { Title, Link } = Typography
  const name = useSelector(selectName)

  return (
    <Header
      style={{
        height: "auto",
        marginBottom: "40px",
      }}
    >
      <Row style={{ display: "flex", alignItems: "center" }} gutter={30}>
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
              <Link style={{ color: "white" }}>Привет</Link>
            </Col>
          </>
        )}

        <Col style={{ marginLeft: "auto" }}>
          {localStorage.getItem("token") ? (
            <Link style={{ color: "white" }}>{name}</Link>
          ) : (
            <Link style={{ color: "white" }}>Войти</Link>
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default HeaderComponent
