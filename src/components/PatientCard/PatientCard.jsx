import {
  Button,
  Card,
  Col,
  Form,
  Layout,
  Radio,
  Row,
  Select,
  Typography,
} from "antd"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { SIZE_OPTIONS } from "../../helpers/constants"
import { useEffect, useState } from "react"
import { useGetPatientCardQuery } from "../../api/patientsApi"
import { formatedDate } from "../../helpers/formatters"
import { ManOutlined, WomanOutlined } from "@ant-design/icons"

const PatientCard = () => {
  const { Title, Text } = Typography
  const { id } = useParams()
  const navigate = useNavigate()

  const [hasError, setHasError] = useState(false)

  const { data: patientCard, error: patientCardError } = useGetPatientCardQuery(
    { token: localStorage.getItem("token"), id: id }
  )

  useEffect(() => {
    if (patientCardError) {
      if (patientCardError.status === 401) {
        localStorage.clear()
        navigate("/login")
      } else if (patientCardError.status === 400) {
        navigate("/patients")
      } else {
        setHasError(true)
      }
    } else {
      console.log(patientCard)
      setHasError(false)
    }
  }, [patientCardError, patientCard, navigate])
  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={14} md={16} xs={20}>
        {patientCard && (
          <Layout style={{ backgroundColor: "white" }}>
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <Title>Медицинская карта пациента</Title>
              </Col>
              <Col>
                <Button type="primary">Добавить осмотр</Button>
              </Col>
            </Row>
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <Title level={2}>
                  {patientCard.name}
                  {patientCard.gender === "Female" ? (
                    <WomanOutlined />
                  ) : (
                    <ManOutlined />
                  )}
                </Title>
              </Col>
              <Col>
                <Text>Дата рождения: {formatedDate(patientCard.birthday)}</Text>
              </Col>
            </Row>
            <Card className="form">
              <Form>
                <Row align={"bottom"} justify={"space-between"}>
                  <Col span={12}>
                    <Form.Item label="МКБ-10" labelCol={{ span: 24 }}>
                      <Select placeholder="Выбрать"></Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item>
                      <Radio.Group value={true}>
                        <Radio value={true}>Сгруппировать по повторным</Radio>

                        <Radio value={false}>Показать все</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"space-between"} align={"bottom"}>
                  <Col span={6}>
                    <Form.Item
                      label="Число осмотров на странице"
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        placeholder="Выберите количество"
                        options={SIZE_OPTIONS}
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item>
                      <Button
                        style={{ width: "100%" }}
                        htmlType="submit"
                        type="primary"
                      >
                        Поиск
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Layout>
        )}
      </Col>
    </Row>
  )
}

export default PatientCard
