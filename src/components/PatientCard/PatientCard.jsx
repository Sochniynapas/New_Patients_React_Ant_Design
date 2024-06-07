import {
  Button,
  Card,
  Col,
  Form,
  Layout,
  Pagination,
  Radio,
  Row,
  Select,
  Typography,
} from "antd"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { SIZE_OPTIONS } from "../../helpers/constants"
import { useEffect, useState } from "react"
import {
  useGetIcdRootsQuery,
  useGetPatientCardQuery,
  useGetPatientsInspectionsListQuery,
} from "../../api/patientsApi"
import { formatedDate } from "../../helpers/formatters"
import { ManOutlined, WomanOutlined } from "@ant-design/icons"
import { patientsInspectionParams } from "../../helpers/navigate"
import Inspection from "./InspectionElement"

const PatientCard = () => {
  const { Title, Text } = Typography
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const icdRoots = searchParams.getAll("icdRoots")
  const grouped = searchParams.get("grouped") || false
  const page = parseInt(searchParams.get("page"), 10) || 1
  const size = parseInt(searchParams.get("size"), 10) || 5

  const initialValues = {
    icdRoots: icdRoots,
    grouped: grouped,
    page: page,
    size: size,
  }

  const { data: icdRootsArray, error: icdError } = useGetIcdRootsQuery()

  const { data: inspections, error: inspectionsError } =
    useGetPatientsInspectionsListQuery({
      token: localStorage.getItem("token"),
      id: id,
      grouped: initialValues.grouped,
      icdRoots: initialValues.icdRoots,
      page: initialValues.page,
      size: initialValues.size,
    })

  const [hasError, setHasError] = useState(false)
  const [icdArray, setIcdArray] = useState([])
  const [currentPage, setCurrentPage] = useState(page)

  const fillIcd = (icdArray) => {
    const options = icdArray.map((icdElement) => ({
      value: icdElement.id,
      label: icdElement.name + " " + `(${icdElement.code})`,
    }))
    setIcdArray(options)
  }

  const { data: patientCard, error: patientCardError } = useGetPatientCardQuery(
    { token: localStorage.getItem("token"), id: id }
  )

  const onFinish = async (values) => {
    const params = patientsInspectionParams(
      values.icdRoots,
      values.grouped,
      1,
      values.size
    )
    navigate(`/patient/${id}?${params.toString()}`)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page)
    
    navigate(`/patient/${id}/${params.toString()}`)
    setCurrentPage(page)
  }

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
      setHasError(false)
    }
  }, [patientCardError, patientCard, navigate])

  useEffect(() => {
    if (icdRootsArray) {
      fillIcd(icdRootsArray)
    }
  }, [icdRootsArray])

  useEffect(() => {
    if (inspectionsError) {
      if (inspectionsError.status === 401) {
        localStorage.clear()
        navigate("/login")
      } else if (inspectionsError.status === 400) {
      } else {
        setHasError(true)
      }
    } else {
      console.log(inspections)
      setHasError(false)
    }
  }, [inspections, navigate, inspectionsError])

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
              <Form
                onFinish={onFinish}
                initialValues={initialValues}
                name="filters"
              >
                <Row align={"bottom"} justify={"space-between"}>
                  <Col span={12}>
                    <Form.Item
                      name={"icdRoots"}
                      label="МКБ-10"
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        showSearch
                        mode="multiple"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={icdArray}
                        placeholder="Выберите диагноз"
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name={"grouped"}>
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
                      name={"size"}
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
            {inspections && (
              <>
                {inspections.inspections.map((elem) => (
                  <Inspection
                    key={elem.id}
                    date={elem.date}
                    conclusion={elem.conclusion}
                    diagnosisName={elem.diagnosis.name}
                    code={elem.diagnosis.code}
                    doctor={elem.doctor}
                    hasNested={elem.hasNested}
                  />
                ))}
                <Pagination
                  current={currentPage}
                  total={inspections.pagination.count}
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
        )}
      </Col>
    </Row>
  )
}

export default PatientCard
