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
  Pagination,
} from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CONCLUSION_OPTIONS,
  PATIENTS_COUNT_OPTIONS,
  SORTING_OPTIONS,
} from "../../helpers/constants"
import { useEffect, useState } from "react"
import Patient from "./SinglePatientElement"
import { useGetPatientsQuery } from "../../api/patientsApi"
import { patientsListParams } from "../../helpers/navigate"

const Patients = () => {
  const { Title } = Typography
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const conclusions = searchParams.getAll("conclusions")
  const scheduledVisits = searchParams.get("scheduledVisits") === "true"
  const onlyMine = searchParams.get("onlyMine") === "true"
  const sorting = searchParams.get("sorting") || "NameAsc"
  const page = parseInt(searchParams.get("page"), 10) || 1
  const size = parseInt(searchParams.get("size"), 10) || 5

  const initialValues = {
    conclusions: conclusions,
    scheduledVisits: scheduledVisits,
    onlyMine: onlyMine,
    sorting: sorting,
    page: page,
    size: size,
  }

  const { data: patients, error: patientsError } = useGetPatientsQuery({
    token: localStorage.getItem("token"),
    name: initialValues.name,
    conclusions: initialValues.conclusions,
    sorting: initialValues.sorting,
    scheduledVisits: initialValues.scheduledVisits,
    onlyMine: initialValues.onlyMine,
    page: initialValues.page,
    size: initialValues.size,
  })

  const [hasError, setHasError] = useState(false)
  const [currentPage, setCurrentPage] = useState(page)

  const onFinish = async (values) => {
    const params = patientsListParams(
      values.name,
      values.conclusions,
      values.sorting,
      values.scheduledVisits,
      values.onlyMine,
      1,
      values.size
    )
    navigate(`/patients?${params.toString()}`)
    console.log(patients.pagination.count)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page)
    navigate(`/patients?${params.toString()}`)
    setCurrentPage(page)
  }

  useEffect(() => {
    if (patientsError) {
      if (patientsError.status === 401) {
        localStorage.clear()
        navigate("/login")
      } else {
        setHasError(true)
      }
    } else {
      setHasError(false)
    }
  }, [patientsError, navigate])

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={14} md={16} xs={20}>
        <Layout style={{ backgroundColor: "white" }}>
          <Row justify={"space-between"} align={"middle"}>
            <Title>Пациенты</Title>
            <Button type="primary">Регистрация нового пациента</Button>
          </Row>
          <Card className="form">
            <Form
              onFinish={onFinish}
              initialValues={initialValues}
              name="filters"
            >
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
                    <Select
                      mode="multiple"
                      options={CONCLUSION_OPTIONS}
                      placeholder="Выберите заключения"
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"space-between"} align={"bottom"}>
                <Col>
                  <Form.Item
                    label="Есть запланированные визиты"
                    valuePropName="checked"
                    name={"scheduledVisits"}
                  >
                    <Switch></Switch>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Мои пациенты"
                    valuePropName="checked"
                    name={"onlyMine"}
                  >
                    <Switch></Switch>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={"sorting"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Сортировка пациентов"
                  >
                    <Select
                      options={SORTING_OPTIONS}
                      placeholder="Выберите сортировку"
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"space-between"} align={"bottom"}>
                <Col span={6}>
                  <Form.Item
                    name={"size"}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label="Число пациентов на странице"
                  >
                    <Select
                      options={PATIENTS_COUNT_OPTIONS}
                      placeholder="Выберите число пациентов"
                    ></Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Поиск
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          {!hasError && patients && (
            <>
              {patients.patients.map((element) => (
                <Patient
                  key={element.id}
                  name={element.name}
                  email={element.email}
                  gender={element.gender}
                  bDate={element.birthday}
                  id={element.id}
                />
              ))}
              <Pagination
                current={currentPage}
                total={patients.pagination.count}
                pageSize={1}
                onChange={handlePageChange}
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              />
            </>
          )}
        </Layout>
      </Col>
    </Row>
  )
}
export default Patients
