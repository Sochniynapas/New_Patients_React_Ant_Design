import { Card, Col, Form, Row, Typography } from "antd"
import { formatedDate, formatedGender } from "../../helpers/formatters"
import { useNavigate } from "react-router-dom"

const Patient = (props) => {
    
  const { Title, Text } = Typography
  const navigate = useNavigate()
  return (
    <Row style={{ marginTop: "30px" }} justify={"center"} align={"middle"}>
      <Col span={24}>
        <Card onClick={()=>navigate(`/patient/${props.id}`)} className="form">
          <Title style={{ marginTop: "0px" }} level={4}>
            {props.name}
          </Title>
          <Row>
            <Text type="secondary">Email - <Text>{props.email}</Text></Text>
          </Row>
          <Row>
            <Text type="secondary">Пол - <Text>{formatedGender(props.gender)}</Text></Text>
          </Row>
          <Row>
            <Text type="secondary">Дата рождения - <Text>{formatedDate(props.bDate)}</Text></Text>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Patient
