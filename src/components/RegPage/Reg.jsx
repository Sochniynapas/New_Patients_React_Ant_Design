import { Card, Col, DatePicker, Form, Row, Typography } from "antd"
import Input from "antd/es/input/Input"

const RegComponent = () => {
  const { Title } = Typography
  return (
    <Row justify={"center"} align={"middle"}>
      <Col span={8}>
        <Card style={{ backgroundColor: "#f5f5f5" }}>
          <Title style={{ marginTop: 0 }}>Регистрация</Title>
          <Form>
            <Form.Item
              label="Имя"
              name="name"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Введите имя" }]}
            >
              <Input placeholder="Иванов Иван Иванович" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Имя"
                  name="name1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: "Введите имя" }]}
                >
                  <Input placeholder="Иванов Иван Иванович" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Дата рождения"
                  name="bDate"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: "Выберите дату рождения" }]}
                >
                  <DatePicker style={{width: "100%"}} placeholder="Выберите дату рождения" format={"DD/MM/YYYY"}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default RegComponent
