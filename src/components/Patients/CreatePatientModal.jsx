import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd"
import { useCreatePatientMutation } from "../../api/patientsApi"

const CrPatientModal = (props) => {
  const { Title } = Typography

  const [createPatient] = useCreatePatientMutation()

  const onFinish = async (values) => {
    const formattedDate = values.birthday.toISOString()
    const formattedValues = {
      ...values,
      birthday: formattedDate,
    }
    const response = await createPatient({
      token: localStorage.getItem("token"),
      data: formattedValues,
    })
    if(response.data){
        props.setOpen(false)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }

  const disableFutureDates = (current) => {
    return current && new Date(current) >= new Date()
  }
  return (
    <Modal
      centered
      onCancel={() => props.setOpen(false)}
      open={props.open}
      width={700}
      footer={""}
    >
      <Form
        name="createPat"
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          remember: true,
        }}
      >
        <Title>Регистрация пациента</Title>
        <Row>
          <Col span={24}>
            <Form.Item
              name={"name"}
              rules={[{ required: true, message: "Введите имя" }]}
              label="Имя"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Иванов Иван Иванович"></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"center"} gutter={20}>
          <Col span={12}>
            <Form.Item
              name={"gender"}
              rules={[{ required: true, message: "Выберите пол" }]}
              label="Пол"
              labelCol={{ span: 24 }}
            >
              <Select placeholder="Выберите пол">
                <Select.Option value="Male">Мужской</Select.Option>
                <Select.Option value="Female">Женский</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"birthday"}
              rules={[{ required: true, message: "Выберите дату рождения" }]}
              label="Дата рождения"
              labelCol={{ span: 24 }}
            >
              <DatePicker
                placeholder="Выберите дату рождения"
                format={"DD/MM/YYYY"}
                disabledDate={disableFutureDates}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Зарегистрировать
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CrPatientModal
