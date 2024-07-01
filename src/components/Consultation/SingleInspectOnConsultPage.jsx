import { FormOutlined, SearchOutlined } from "@ant-design/icons"
import { Card, Col, Row, Typography } from "antd"
import Link from "antd/es/typography/Link"
import { formatedConclusion, formatedDate } from "../../helpers/formatters"
import { useNavigate } from "react-router-dom"

const InspectionForConsult = (params) => {
  const { Title, Text } = Typography
  const navigate = useNavigate()
  return (
    <Row style={{ paddingTop: "20px" }} justify={"center"} align={"middle"}>
      <Col span={24}>
        <Card
          style={
            params.conclusion === "Death" ? { backgroundColor: "#FFEFE8" } : ""
          }
          className="form"
        >
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Row gutter={10}>
                <Col
                  style={{
                    margin: "3px",
                    borderRadius: "5px",
                    backgroundColor: "#7D82A1",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {formatedDate(params.date)}
                  </Text>
                </Col>
                <Col>
                  <Title style={{ margin: 0 }} level={4}>
                    Амбулаторный осмотр
                  </Title>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row align={"middle"} gutter={8}>
                <Col style={{ paddingLeft: "15px" }}>
                  <SearchOutlined
                    style={{ fontSize: "20px", color: "#327CB9" }}
                  />
                </Col>
                <Col>
                  <Link onClick={()=>navigate(`/inspection/${params.id}`)} style={{ fontSize: "16px" }}>Детали осмотра</Link>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col>
              <Text>Заключение: {formatedConclusion(params.conclusion)}</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>
                Основной диагноз:{" "}
                <Text strong>
                  {params.diagnosisName} ({params.code})
                </Text>
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text type="secondary">
                Медицинский работник: {params.doctor}
              </Text>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default InspectionForConsult
