import React, { useEffect, useState } from "react"
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd"
import { useGetIcdQuery } from "../../api/patientsApi"
import { formatedDiagType } from "../../helpers/formatters"
import { CONCLUSION_OPTIONS } from "../../helpers/constants"
import TextArea from "antd/es/input/TextArea"
import { useRedactInspectionMutation } from "../../api/inspectionsApi"

const RedactInspectionModal = ({ setIsModalOpen, isModalOpen, details }) => {
  const { Title, Text } = Typography
  const [conclusion, setConclusion] = useState(details.conclusion)
  const [dateValues, setDateValues] = useState({
    nextVisitDate: "",
    deathDate: "",
  })
  const [diagText, setDiagText] = useState("")

  const [responseError, setResponseError] = useState(false)

  const { data: icd } = useGetIcdQuery({ request: diagText })
  const [icdArray, setIcdArray] = useState([])

  const [diagnosisParams, setDiagnosisParams] = useState({
    icdDiagnosisId: "",
    description: "",
    type: "",
  })
  const [diagnosisNames, setDiagnosisNames] = useState([])
  const [diagnoses, setDiagnoses] = useState([])

  const [redactInspection] = useRedactInspectionMutation()

  const handleChangeDiagParams = (name, value) => {
    if (name === "icdDiagnosisId") {
      const selectedIcd = icdArray.find((icd) => icd.value === value)
      setDiagnosisParams((prev) => ({
        ...prev,
        [name]: value,
      }))
      setDiagnosisNames((prev) => [
        ...prev,
        selectedIcd ? selectedIcd.label : "",
      ])
    } else {
      setDiagnosisParams((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const disablePreviousDates = (current) => {
    return current && new Date(current) < new Date()
  }
  const fillDiagnosis = (icd) => {
    const options = icd.map((element) => ({
      value: element.id,
      label: `(${element.code})` + " - " + element.name,
    }))
    setIcdArray(options)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleAddNewDiagnosis = () => {
    if (
      diagnosisParams.icdDiagnosisId &&
      diagnosisParams.description &&
      diagnosisParams.type
    ) {
      setDiagnoses((prev) => [...prev, diagnosisParams])
      setDiagnosisParams({
        icdDiagnosisId: "",
        description: "",
        type: "",
      })
    }
  }
  const handleSetDateValues = (type, date) => {
    setDateValues({
      nextVisitDate: "",
      deathDate: "",
    })
    setDateValues((prev) => ({
      ...prev,
      [type]: date,
    }))
  }
  const handleSearchDiag = (value) => {
    setDiagText(value)
  }

  const onFinish = async(values) => {
    const data = {}
    data["anamnesis"] = values.anamnesis
    data["complaints"] = values.complaints
    data["treatment"] = values.treatment
    data["conclusion"] = conclusion
    if (dateValues.nextVisitDate !== "") {
      data["nextVisitDate"] = dateValues.nextVisitDate
    }
    if (dateValues.deathDate !== "") {
      data["deathDate"] = dateValues.deathDate
    }
    data["diagnoses"] = diagnoses
    const response = await redactInspection({
      id: details.id,
      data: data,
      token: localStorage.getItem("token"),
    })
    if (response && response.error) {
      if ((response.error.status === 401)) {
        localStorage.clear()
        navigate('/login')
      } else {
        setResponseError(true)
      }
    } else {
      if (response) {
        setResponseError(false)
        setIsModalOpen(false)
      }
    }
  }

  useEffect(() => {
    if (icd) {
      fillDiagnosis(icd.records)
    }
  }, [diagText, icd])
  return (
    <>
      <Modal
        centered
        onCancel={() => setIsModalOpen(false)}
        width={1000}
        open={isModalOpen}
        footer={""}
      >
        <Row justify={"center"} align={"middle"}>
          <Col>
            <Title level={1}>Редактирование осмотра</Title>
            <Form
              onFinish={onFinish}
              initialValues={{
                complaints: details.complaints,
                anamnesis: details.anamnesis,
                treatment: details.treatment,
                conclusion: details.conclusion,
              }}
              name="redactInspect"
            >
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Жалобы
                </Title>
                <Form.Item name={"complaints"}>
                  <TextArea></TextArea>
                </Form.Item>
              </Card>
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Анамнез заболевания
                </Title>
                <Form.Item name={"anamnesis"}>
                  <TextArea></TextArea>
                </Form.Item>
              </Card>
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Рекомендации по лечению
                </Title>
                <Form.Item name={"treatment"}>
                  <TextArea></TextArea>
                </Form.Item>
              </Card>
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Диагнозы
                </Title>
                <Row>
                  {diagnoses &&
                    diagnoses.map((elem, index) => (
                      <Col
                        style={{ paddingBottom: 20 }}
                        span={24}
                        key={elem.id}
                      >
                        <Row>
                          <Title level={5}>{diagnosisNames[index]}</Title>
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
                  <Col span={24}>
                    <Form.Item label="Болезни" labelCol={{ span: 24 }}>
                      <Select
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleChangeDiagParams("icdDiagnosisId", e)
                        }
                        showSearch
                        filterOption={false}
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={icdArray}
                        onSearch={handleSearchDiag}
                        placeholder="Выберите диагноз"
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={"description"}>
                      <Input
                        onChange={(e) =>
                          handleChangeDiagParams("description", e.target.value)
                        }
                        placeholder="Введите пояснение"
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={"type"}>
                      <Radio.Group
                        onChange={(e) =>
                          handleChangeDiagParams("type", e.target.value)
                        }
                      >
                        <Radio
                          disabled={diagnoses.some(
                            (diagnosis) => diagnosis.type === "Main"
                          )}
                          value={"Main"}
                        >
                          Основной
                        </Radio>
                        <Radio
                          disabled={
                            !diagnoses.some(
                              (diagnosis) => diagnosis.type === "Main"
                            )
                          }
                          value={"Concomitant"}
                        >
                          Сопутствующий
                        </Radio>
                        <Radio
                          disabled={
                            !diagnoses.some(
                              (diagnosis) => diagnosis.type === "Main"
                            )
                          }
                          value={"Complication "}
                        >
                          Осложнение
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Button onClick={handleAddNewDiagnosis} type="primary">
                    + Добавить диагноз
                  </Button>
                </Row>
              </Card>
              <Card style={{ marginTop: "20px" }} className="form">
                <Title style={{ marginTop: 0 }} level={2}>
                  Заключение
                </Title>
                <Row gutter={10} align={"bottom"}>
                  <Col span={8}>
                    <Form.Item
                      name="conclusion"
                      label="Заключение"
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        defaultValue={"Recovery"}
                        onChange={(e) => setConclusion(e)}
                        options={CONCLUSION_OPTIONS}
                      ></Select>
                    </Form.Item>
                  </Col>
                  {conclusion !== "Recovery" && (
                    <Col span={8}>
                      <Form.Item
                        rules={[{ required: true }]}
                        label={
                          conclusion === "Death"
                            ? "Дата и время смерти"
                            : "Дата следующего визита"
                        }
                        labelCol={{ span: 24 }}
                      >
                        <DatePicker
                          onChange={(e) => {
                            conclusion === "Death"
                              ? handleSetDateValues(
                                  "deathDate",
                                  e.add(7, "hour").toISOString()
                                )
                              : handleSetDateValues(
                                  "nextVisitDate",
                                  e.add(7, "hour").toISOString()
                                )
                          }}
                          placeholder="Выберите дату"
                          style={{ width: "100%" }}
                          showTime
                          disabledDate={disablePreviousDates}
                          format="DD.MM.YYYY HH:mm"
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Card>
              {responseError && (
                <Row justify={"center"}>
                  <Title level={3} type="danger">
                    Проверьте корректность введённых полей
                  </Title>
                </Row>
              )}
              <Row
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
                gutter={20}
                align={"middle"}
                justify={"center"}
              >
                <Col>
                  <Button type="primary" htmlType="submit">
                    Сохранить осмотр
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  )
}
export default RedactInspectionModal
