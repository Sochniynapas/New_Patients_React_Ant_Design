import { Button, Card, Col, Form, Input, Row, Typography } from "antd"
import Password from "antd/es/input/Password"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthUserMutation } from "../../api/userApi"

const Auth = () => {
  const { Title, Text } = Typography
  const [error, setError] = useState(false)
  const [userAuth] = useAuthUserMutation()
  const navigate = useNavigate()
  const onFinish = async(values) => {
    const response = await userAuth({ body: values })
    if (response.data) {
      localStorage.setItem("token", response.data.token)
      navigate("/profile")
      setError(false)
    } else {
      setError(true)
    }   
  }
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }

  const initialValues = {
    email: "handiemurim@mail.ru",
    password: "Sukanah1!"
  }

  useEffect(()=>{
    if(localStorage.getItem("token") !== null){
      navigate("/profile")
    }
  },[])
  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={8} md={12} xs={16}>
        <Card className="form">
          <Title style={{ marginTop: 0 }}>Вход</Title>
          <Form
            name="auth"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            align={"middle"}
          >
            <Form.Item
              name="email"
              label="Email"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Введите email" }]}
            >
              <Input
                placeholder="name@example.com"
              ></Input>
            </Form.Item>
            <Form.Item
              name="password"
              label="Пароль"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Password />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                style={{ width: "100%" }}
                type="primary"
              >
                Войти
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => navigate("/register")}
                style={{ width: "100%", backgroundColor: "#D3D3EB" }}
              >
                Регистрация
              </Button>
            </Form.Item>
            {error && <Text type="danger">Неверный логин или пароль</Text>}
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default Auth
