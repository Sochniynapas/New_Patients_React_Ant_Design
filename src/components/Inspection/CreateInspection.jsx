import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
} from "antd"
import Typography from "antd/es/typography/Typography"
import { useEffect, useState } from "react"
import { useGetSpecialtiesListQuery } from "../../api/userApi"
import { useNavigate } from "react-router-dom"
import { useGetIcdQuery, useGetPatientCardQuery } from "../../api/patientsApi"
import { formatedDate, formatedDiagType } from "../../helpers/formatters"
import { CONCLUSION_OPTIONS } from "../../helpers/constants"
import {
  useCreateInspectionMutation,
  useGetPrevInspectionsListQuery,
} from "../../api/inspectionsApi"
import { ManOutlined, WomanOutlined } from "@ant-design/icons"

const CreateInspection = () => {
  const { Title, Text } = Typography
  const { TextArea } = Input

  const [isFirstIns, setIsFirstIns] = useState(false)
  const handleChangeSwitch = () => {
    setIsFirstIns(!isFirstIns)
  }
  const [needConsult, setNeedConsult] = useState(false)
  const handleChangeConsultSwitch = () => {
    setNeedConsult(!needConsult)
  }

  const [specText, setSpecText] = useState("")
  const [diagText, setDiagText] = useState("")
  const [prevInspection, setPrevInspection] = useState("")

  const [consultParams, setConsultParams] = useState({
    specialityId: "",
    comment: {
      content: "",
    },
  })
  const [diagnosisParams, setDiagnosisParams] = useState({
    icdDiagnosisId: "",
    description: "",
    type: "",
  })

  const [conclusion, setConclusion] = useState("Recovery")
  const [dateValues, setDateValues] = useState({
    nextVisitDate: "",
    deathDate: "",
  })

  const [responseError, setResponseError] = useState(false)

  const navigate = useNavigate()

  const { data: patient, error: patientError } = useGetPatientCardQuery({
    token: localStorage.getItem("token"),
    id: localStorage.getItem("patient"),
  })

  //Массив консультаций для запроса
  const [consultations, setConsultations] = useState([])
  const [consultationNames, setConsultationNames] = useState([])

  //Массив диагнозов для запроса
  const [diagnosis, setDiagnosis] = useState([])
  const [diagnosisNames, setDiagnosisNames] = useState([])

  const { data: prevInspecList } = useGetPrevInspectionsListQuery({
    id: localStorage.getItem("patient"),
    request: prevInspection,
    token: localStorage.getItem("token"),
  })
  const [inspections, setInspections] = useState([])

  const [newInspection] = useCreateInspectionMutation()

  const { data: specialties } = useGetSpecialtiesListQuery({ name: specText })
  const [specArray, setSpecArray] = useState([])

  const { data: icd } = useGetIcdQuery({ request: diagText })
  const [icdArray, setIcdArray] = useState([])

  const fillSpecialties = (specialties) => {
    const options = specialties.map((element) => ({
      value: element.id,
      label: element.name,
    }))
    setSpecArray(options)
  }
  const fillDiagnosis = (icd) => {
    const options = icd.map((element) => ({
      value: element.id,
      label: element.code + " - " + element.name,
    }))
    setIcdArray(options)
  }
  const fillInspections = (inspections) => {
    const options = inspections.map((element) => ({
      value: element.id,
      label:
        formatedDate(element.date) +
        "  " +
        element.diagnosis.code +
        " - " +
        element.diagnosis.name,
    }))
    setInspections(options)
  }

  const getFilteredOptions = () => {
    const selectedIds = consultations.map((c) => c.specialityId)
    return specArray.filter((option) => !selectedIds.includes(option.value))
  }

  const getFilteredDiagnosisOptions = () => {
    const selectedIds = diagnosis.map((c) => c.icdDiagnosisId)
    return icdArray.filter((option) => !selectedIds.includes(option.value))
  }

  const handleChangeConsultParams = (name, value) => {
    if (name === "specialityId") {
      const selectedSpec = specArray.find((spec) => spec.value === value)
      setConsultParams((prev) => ({
        ...prev,
        [name]: value,
      }))
      setConsultationNames((prev) => [
        ...prev,
        selectedSpec ? selectedSpec.label : "",
      ])
    } else if (name === "content") {
      setConsultParams((prev) => ({
        ...prev,
        comment: {
          ...prev.comment,
          content: value,
        },
      }))
    }
  }
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

  const handleChangeSearch = (value) => {
    setSpecText(value)
  }
  const handleChangeDiagSearch = (value) => {
    setDiagText(value)
  }

  const handleAddNewConsultation = () => {
    if (consultParams.specialityId && consultParams.comment.content) {
      setConsultations((prev) => [...prev, consultParams])
      setConsultParams({
        specialityId: "",
        comment: {
          content: "",
        },
      })
    }
  }
  const handleAddNewDiagnosis = () => {
    if (
      diagnosisParams.icdDiagnosisId &&
      diagnosisParams.description &&
      diagnosisParams.type
    ) {
      setDiagnosis((prev) => [...prev, diagnosisParams])
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

  const disableFutureDates = (current) => {
    return current && new Date(current) >= new Date()
  }
  const disablePreviousDates = (current) => {
    return current && new Date(current) < new Date()
  }

  const onFinish = async (values) => {
    const data = {}
    data["date"] = values.date.add(7, "hour").toISOString()
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
    if (values.previousInspectionId) {
      data["previousInspectionId"] = values.previousInspectionId
    }
    data["diagnoses"] = diagnosis
    data["consultations"] = consultations
    const response = await newInspection({
      patientId: localStorage.getItem("patient"),
      data: data,
      token: localStorage.getItem("token"),
    })
    if (response && response.error) {
      if ((response.error.status = 401)) {
        localStorage.clear()
        navigate('/login')
      } else {
        setResponseError(true)
      }
    } else {
      if (response.data) {
        setResponseError(false)
        navigate(`/patient/${localStorage.getItem("patient")}`)
      }
    }
  }

  useEffect(() => {
    if (patientError && patientError.status === 401) {
      localStorage.clear()
      navigate("/profile")
    }
  }, [patientError])

  useEffect(() => {
    if (specialties) {
      fillSpecialties(specialties.specialties)
    }
    if (icd) {
      fillDiagnosis(icd.records)
    }
    if (prevInspecList) {
      fillInspections(prevInspecList)
    }
  }, [
    specialties,
    specText,
    diagnosis,
    diagText,
    prevInspecList,
    prevInspection,
  ])

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={14} md={16} xs={20}>
        <Title>Создание осмотра</Title>
        <Form
          onFinish={onFinish}
          initialValues={{ remember: true }}
          name="newInspect"
        >
          <Card className="form">
            {patient && (
              <>
                <Row justify={"space-between"} align={"middle"}>
                  <Col>
                    <Title style={{ marginTop: "0px" }} level={2}>
                      {patient.name}
                      {patient.gender === "Female" ? (
                        <WomanOutlined />
                      ) : (
                        <ManOutlined />
                      )}
                    </Title>
                  </Col>
                  <Col>
                    <Text>Дата рождения: {formatedDate(patient.birthday)}</Text>
                  </Col>
                </Row>
                <Row gutter={10} align={"middle"}>
                  <Col>
                    <Text style={{ color: "blue" }}>Первичный осмотр</Text>
                  </Col>
                  <Col>
                    <Switch onChange={handleChangeSwitch}></Switch>
                  </Col>
                  <Col>
                    <Text>Повторный осмотр</Text>
                  </Col>
                </Row>
              </>
            )}
            {isFirstIns && (
              <Row style={{ paddingTop: "20px" }} justify={"start"}>
                <Col span={12}>
                  <Form.Item
                    label={"Предыдущий осмотр"}
                    labelCol={{ span: 24 }}
                    name="previousInspectionId"
                  >
                    <Select
                      showSearch
                      onSearch={(value) => setPrevInspection(value)}
                      options={inspections}
                      placeholder="Выберите осмотр"
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row style={{ paddingTop: "20px" }} justify={"start"}>
              <Col span={6}>
                <Form.Item
                  label={"Дата осмотра"}
                  name={"date"}
                  labelCol={{ span: 24 }}
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Выберите дату"
                    disabledDate={disableFutureDates}
                    showTime
                    format="DD.MM.YYYY HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card style={{ marginTop: "20px" }} className="form">
            <Title level={2}>Жалобы</Title>
            <Form.Item name={"complaints"}>
              <TextArea></TextArea>
            </Form.Item>
          </Card>
          <Card style={{ marginTop: "20px" }} className="form">
            <Title level={2}>Анамнез заболевания</Title>
            <Form.Item name={"anamnesis"}>
              <TextArea></TextArea>
            </Form.Item>
          </Card>
          <Card style={{ marginTop: "20px" }} className="form">
            <Title level={2}>Консультации</Title>
            <Row>
              {consultations &&
                consultations.map((elem, index) => (
                  <Col
                    style={{ paddingBottom: 20 }}
                    span={24}
                    key={elem.specialityId}
                  >
                    <Row>
                      <Text type="secondary">
                        Специализация врача: {consultationNames[index]}
                      </Text>
                    </Row>
                    <Row>
                      <Text type="secondary">
                        Комментарий: {elem.comment.content}
                      </Text>
                    </Row>
                  </Col>
                ))}
              <Col span={8}>
                <Switch onChange={handleChangeConsultSwitch}></Switch>
                <Text style={{ marginLeft: 10 }}>Требуется консультация</Text>
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  onChange={(e) => handleChangeConsultParams("specialityId", e)}
                  showSearch
                  disabled={!needConsult}
                  filterOption={false}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={getFilteredOptions()}
                  placeholder="Выберите специальность"
                  onSearch={handleChangeSearch}
                ></Select>
              </Col>
              <Col style={{ marginTop: 20, marginBottom: 20 }} span={24}>
                <Form.Item label="Комментарий" labelCol={{ span: 24 }}>
                  <TextArea
                    name={"comment"}
                    disabled={!needConsult}
                    onChange={(e) =>
                      handleChangeConsultParams("content", e.target.value)
                    }
                  ></TextArea>
                </Form.Item>
              </Col>
              <Button
                onClick={handleAddNewConsultation}
                type="primary"
                disabled={!needConsult}
              >
                + Добавить консультацию
              </Button>
            </Row>
          </Card>
          <Card style={{ marginTop: "20px" }} className="form">
            <Title level={2}>Диагнозы</Title>
            <Row>
              {diagnosis &&
                diagnosis.map((elem, index) => (
                  <Col
                    style={{ paddingBottom: 20 }}
                    span={24}
                    key={elem.icdDiagnosisId}
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
                    options={getFilteredDiagnosisOptions()}
                    placeholder="Выберите специальность"
                    onSearch={handleChangeDiagSearch}
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
                      disabled={diagnosis.some(
                        (diagnosis) => diagnosis.type === "Main"
                      )}
                      value={"Main"}
                    >
                      Основной
                    </Radio>
                    <Radio
                      disabled={
                        !diagnosis.some(
                          (diagnosis) => diagnosis.type === "Main"
                        )
                      }
                      value={"Concomitant"}
                    >
                      Сопутствующий
                    </Radio>
                    <Radio
                      disabled={
                        !diagnosis.some(
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
            <Title level={2}>Рекомендации по лечению</Title>
            <Form.Item name={"treatment"}>
              <TextArea></TextArea>
            </Form.Item>
          </Card>
          <Card style={{ marginTop: "20px" }} className="form">
            <Title level={2}>Заключение</Title>
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
              <Button onClick={() => navigate(-1)}>Отмена</Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateInspection
