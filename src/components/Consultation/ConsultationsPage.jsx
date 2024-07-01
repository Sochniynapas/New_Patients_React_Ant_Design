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
import { useNavigate, useSearchParams } from "react-router-dom"
import { SIZE_OPTIONS } from "../../helpers/constants"
import { useEffect, useState } from "react"
import {
  useGetIcdRootsQuery,
} from "../../api/patientsApi"
import { consultationsParams } from "../../helpers/navigate"
import { useGetConsultationsListQuery } from "../../api/consultations"
import InspectionForConsult from "./SingleInspectOnConsultPage"

const ConsultationsPage = () => {
  const { Title, Text } = Typography
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

  

  const { data: consultations, error: consultationsError } =
    useGetConsultationsListQuery({
      token: localStorage.getItem("token"),
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

  const onFinish = async (values) => {
    const params = consultationsParams(
      values.icdRoots,
      values.grouped,
      1,
      values.size
    )
    navigate(`/consultations?${params.toString()}`)
  }


  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page)

    navigate(`/consultations?${params.toString()}`)
    setCurrentPage(page)
  }

  useEffect(() => {
    if (icdRootsArray) {
      fillIcd(icdRootsArray)
    }
  }, [icdRootsArray])

  useEffect(() => {
    if (consultationsError) {
      if (consultationsError.status === 401) {
        localStorage.clear()
        navigate("/login")
      } else if (consultationsError.status === 400) {
      } else {
        setHasError(true)
      }
    } else {
      console.log(consultations)
      setHasError(false)
    }
  }, [consultations, navigate, consultationsError])

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={14} md={16} xs={20}>
        <Layout style={{ backgroundColor: "white" }}>
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Title>Консультации</Title>
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
          {consultations && (
            <>
              {consultations.inspections.map((elem) => (
                <InspectionForConsult
                  key={elem.id}
                  id={elem.id}
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
                total={consultations.pagination.count}
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

export default ConsultationsPage
