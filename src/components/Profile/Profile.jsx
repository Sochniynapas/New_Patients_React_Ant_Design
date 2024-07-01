import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd"
import { useEditProfileMutation, useGetProfileQuery } from "../../api/userApi"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const Profile = () => {
  const { Title } = Typography
  const { data: profile, error: profileError } = useGetProfileQuery({
    token: localStorage.getItem("token"),
  })
  const navigate = useNavigate()
  const [editProfile] = useEditProfileMutation()

  const onFinish = async (values) => {
    const formattedDate = values.birthday.add(7, "hour").toISOString()
    const formattedValues = {
      ...values,
      birthday: formattedDate,
    }
    const response = await editProfile({
      body: formattedValues,
      token: localStorage.getItem("token"),
    })
    if(response.error){
      console.log(response.error)
    }

  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }
  const disableFutureDates = (current) => {
    return current && new Date(current) >= new Date()
  }

  useEffect(() => {
    if (
      (profileError && profileError.status === 401) ||
      localStorage.getItem("token") == null
    ) {
      navigate("/login")
      localStorage.clear()
    }
  }, [profileError])

  const initialValues = profile
    ? {
        name: profile.name,
        gender: profile.gender,
        birthday: dayjs(profile.birthday),
        phone: profile.phone,
        email: profile.email,
      }
    : {}

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={8} md={12} xs={16}>
        <Card className="form">
          <Title style={{ marginTop: 0 }}>Профиль</Title>
          {profile && (
            <Form
              name="profile"
              initialValues={initialValues}
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Имя"
                name="name"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Заполните имя" }]}
              >
                <Input placeholder="Иванов Иван Иванович" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Пол"
                    name="gender"
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    rules={[{ required: true, message: "Выберите пол" }]}
                  >
                    <Select placeholder="Выберите пол">
                      <Select.Option value="Male">Мужской</Select.Option>
                      <Select.Option value="Female">Женский</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Дата рождения"
                    name="birthday"
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "Выберите дату рождения" },
                    ]}
                  >
                    <DatePicker
                      placeholder="Выберите дату рождения"
                      format={"DD/MM/YYYY"}
                      disabledDate={disableFutureDates}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Телефон"
                name="phone"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    pattern: /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/,
                    message:
                      "Введите номер телефона в формате +7 (xxx) xxx xx-xx",
                  },
                ]}
              >
                <Input placeholder="+7 (xxx) xxx xx-xx" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "введите email в формате name@example.com",
                    pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  },
                ]}
              >
                <Input placeholder="name@example.com" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Сохранить изменения
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default Profile
