import { Button, Card, Col, Row, Typography } from "antd"
import { useGetInspectionDetailsQuery } from "../../api/inspectionsApi"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  formatedDate,
  formatedDateWithTime,
  formatedGender,
} from "../../helpers/formatters"

const InspectionDetails = () => {
  const { Title, Text } = Typography

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const { id } = useParams()

  const { data: details, error: detailsError } = useGetInspectionDetailsQuery({
    id: id,
    token: token,
  })

  useEffect(() => {
    if (detailsError && detailsError.status === 401) {
      localStorage.clear()
      navigate("/profile")
    } else {
      if (details) {
        console.log(details)
      }
    }
  }, [detailsError, details])

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={14} md={16} xs={20}>
        {details && (
          <>
            <Card className="form">
              <Row justify={"space-between"} align={"middle"}>
                <Title style={{ marginTop: 0 }} level={2}>
                  Амбулаторный осмотр от: {formatedDateWithTime(details.date)}
                </Title>
                <Button type="primary">Редактировать осмотр</Button>
              </Row>
              <Title level={4}>Пациент: {details.patient.name}</Title>
              <Col span={24}>
                <Text>Пол: {formatedGender(details.patient.gender)}</Text>
              </Col>
              <Col span={24}>
                <Text>
                  Дата рождения {formatedDate(details.patient.birthday)}
                </Text>
              </Col>
              <Col style={{ paddingTop: 20 }} span={24}>
                <Text type="secondary">
                  Медицинский работник: {details.doctor.name}
                </Text>
              </Col>
            </Card>
            <Card style={{ marginTop: "20px" }} className="form">
              <Title level={2}>Анамнез заболевания</Title>
              <Form.Item name={"anamnesis"}>
                <TextArea></TextArea>
              </Form.Item>
            </Card>
            <Card style={{ marginTop: "20px" }} className="form">
              <Title level={2}>Анамнез заболевания</Title>
              <Form.Item name={"anamnesis"}>
                <TextArea></TextArea>
              </Form.Item>
            </Card>
          </>
        )}
      </Col>
    </Row>
  )
}

export default InspectionDetails
