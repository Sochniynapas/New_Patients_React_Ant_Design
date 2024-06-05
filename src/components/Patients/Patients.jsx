import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Switch,
  Typography,
} from "antd"

const Patients = () => {
  const { Title } = Typography

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={12} md={16} xs={20}>
        <Layout style={{ backgroundColor: "white" }}>
          <Row justify={"space-between"} align={"middle"}>
            <Title>Пациенты</Title>
            <Button type="primary">Регистрация нового пациента</Button>
          </Row>
          <Card className="form">
            <Form name="filters">
              <Title style={{ marginTop: 0 }} level={3}>
                Фильтры и сортировка
              </Title>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    name={"name"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Имя"
                  >
                    <Input placeholder="Иванов Иван Иванович"></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={"conclusions"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Имеющиеся заключения"
                  >
                    <Select placeholder="Выберите заключения"></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"space-between"} align={"bottom"}>
                <Col>
                  <Form.Item name={"conclusions"}>
                    <Switch></Switch>
                    <span style={{ marginLeft: "10px" }}>
                      Есть запланированные визиты
                    </span>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"conclusions"}>
                    <Switch></Switch>
                    <span style={{ marginLeft: "10px" }}>Мои пациенты</span>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={"conclusions"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Сортировка пациентов"
                  >
                    <Select placeholder="Выберите сортировку"></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"space-between"} align={"bottom"}>
                <Col span={6}>
                  <Form.Item
                    name={"conclusions"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Число пациентов на странице"
                  >
                    <Select placeholder="Выберите число пациентов"></Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button style={{ width: "100%" }} type="primary">
                      Поиск
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Layout>
      </Col>
    </Row>
  )
}
export default Patients
