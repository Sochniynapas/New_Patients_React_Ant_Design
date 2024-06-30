import { Button, Card, Col, Row, Typography } from "antd"
import { useGetInspectionDetailsQuery } from "../../api/inspectionsApi"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  formatedConclusion,
  formatedDate,
  formatedDateWithTime,
  formatedDiagType,
  formatedGender,
} from "../../helpers/formatters"
import SingleConsult from "./SingleConsult"
import RedactInspectionModal from "./RedactInspectionDetailsModal"
import { useGetProfileQuery } from "../../api/userApi"

const InspectionDetails = () => {
  const { Title, Text } = Typography

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const { id } = useParams()

  const { data: profileData } = useGetProfileQuery({token: token})
  const [isModalOpen, setIsModalOpen] = useState(false)

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
                {profileData.id === details.doctor.id && (
                  <Button onClick={() => setIsModalOpen(true)} type="primary">
                    Редактировать осмотр
                  </Button>
                )}
                <RedactInspectionModal
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                  details={details}
                />
              </Row>
              <Title style={{ marginTop: 0 }} level={4}>
                Пациент: {details.patient.name}
              </Title>
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
              <Title style={{ marginTop: 0 }} level={2}>
                Жалобы
              </Title>
              <Text>{details.complaints}</Text>
            </Card>
            <Card style={{ marginTop: "20px" }} className="form">
              <Title style={{ marginTop: 0 }} level={2}>
                Анамнез заболевания
              </Title>
              <Text>{details.anamnesis}</Text>
            </Card>
            {details.consultations &&
              details.consultations.map((elem, index) => (
                <Col span={24}>
                  <SingleConsult key={index} details={elem} />
                </Col>
              ))}
            {details.diagnoses && (
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Диагнозы
                </Title>
                {details.diagnoses.map((elem, index) => (
                  <Col
                    style={{ paddingBottom: 20 }}
                    span={24}
                    key={elem.icdDiagnosisId}
                  >
                    <Row>
                      <Title style={{ marginTop: 0 }} level={5}>
                        ({elem.code}) {elem.name}
                      </Title>
                    </Row>
                    <Row>
                      <Text type="secondary">
                        Тип в осмотре: {formatedDiagType(elem.type)}
                      </Text>
                    </Row>
                    <Row>
                      <Text type="secondary">
                        Расшифровка: {elem.description}
                      </Text>
                    </Row>
                  </Col>
                ))}
              </Card>
            )}
            <Card style={{ marginTop: "20px" }} className="form">
              <Title style={{ marginTop: 0 }} level={2}>
                Рекомендации по лечению
              </Title>
              <Text>{details.treatment}</Text>
            </Card>
            <Card style={{ marginTop: "20px" }} className="form">
              <Title style={{ marginTop: 0 }} level={2}>
                Заключение
              </Title>
              <Title level={5}>{formatedConclusion(details.conclusion)}</Title>
              {details.conclusion !== "Recovery" && (
                <>
                  {details.conclusion === "Death" ? (
                    <Text>
                      Дата смерти: {formatedDateWithTime(details.deathDate)}
                    </Text>
                  ) : (
                    <Text>
                      Дата следующего визита:{" "}
                      {formatedDateWithTime(details.nextVisitDate)}
                    </Text>
                  )}
                </>
              )}
            </Card>
          </>
        )}
      </Col>
    </Row>
  )
}

export default InspectionDetails
